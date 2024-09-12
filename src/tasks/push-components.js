import axios from 'axios'
import fs from 'fs'
import chalk from 'chalk'
import PresetsLib from '../utils/presets-lib'
import lodash from 'lodash'
const { isEmpty } = lodash

const isUrl = source => source.indexOf('http') === 0
 const listOfGroups = []

/**
 * @method isGroupExists
 * @param  {Array<String>} groups
 * @param  {String} name
 * @return {Object}
 */
const getGroupByName = (groups, name) => {
  return groups.find(group => group.name === name) || {}
}

const getGroupByUuid = (groups, uuid) => {
  return groups.find(group => group.source_uuid === uuid)
}

/**
 * Get the data from a local or remote JSON file
 * @param {string} path the local path or remote url of the file
 * @returns {Promise<Object>} return the data from the source or an error
 */
const getDataFromPath = async (path) => {
  if (!path) {
    return {}
  }
  const sources = path.split(',')
  const isList = sources.length > 1

  try {
    if (isUrl(path)) {
      return (await axios.get(path)).data
    } else {
      if (!isList) return JSON.parse(fs.readFileSync(sources[0], 'utf8'))

      const data = []
      sources.forEach((source) => {
        data.push(JSON.parse(fs.readFileSync(source, 'utf8')))
      })
      return data
    }
  } catch (err) {
    console.error(`${chalk.red('X')} Can not load json file from ${path}`)
    return Promise.reject(err)
  }
}

/**
 * Creat an array based in the content parameter and the key provided
 * @param {object} content the data to create a list
 * @param {string} key key to serch in the content
 * @returns {Array} return the data from the source or an error
 */
const createContentList = (content, key) => {
  if (content[key]) return content[key]
  else if (Array.isArray(content)) return [...content]
  else return !isEmpty(content) ? [content] : []
}

const getSpaceInternalTags = (client, spaceId) => {
  return client.get(`spaces/${spaceId}/internal_tags`).then((response) => response.data.internal_tags || []);
}

const createComponentInternalTag =(client, spaceId, tag) => {
  return client.post(`spaces/${spaceId}/internal_tags`, {
    internal_tag: {
      name: tag.name,
      object_type: "component"
    }
  })
  .then((response) => response.data.internal_tag || {})
  .catch((error) => Promise.reject(error));
}

const pushComponents = async (api, { source, presetsSource }) => {
  try {
    const rawComponents = await getDataFromPath(source)
    const components = createContentList(rawComponents, 'components')
    const rawPresets = await getDataFromPath(presetsSource)
    const presets = createContentList(rawPresets, 'presets')
    const componentGroups = createContentList(rawComponents, 'component_groups')

    return push(api, components, componentGroups, presets)
  } catch (err) {
    console.error(`${chalk.red('X')} Can not push invalid json - please provide a valid json file`)
    return Promise.reject(new Error('Can not push invalid json - please provide a valid json file'))
  }
}

const buildComponentsGroupsTree = (groups) => {
    const map = new Map()
    const roots = []

    groups.forEach(component => {
      map.set(component.id, { ...component, children: [] })
    });

    groups.forEach(component => {
      if (component.parent_id === null) {
        roots.push(map.get(component.id))
      } else {
        const parent = map.get(component.parent_id)
        if (parent) {
          parent.children.push(map.get(component.id))
        }
      }
    })

    return roots
  }

const pushComponentsGroups = async (api, group) => {
    const groupName = group.name

    try {
      console.log(`${chalk.blue('-')} Creating the ${groupName} component group...`)
      const newGroup = await api.post('component_groups', {
        component_group: {
          name: groupName,
          parent_id: group.parent_id
        }
      })

      listOfGroups.push(newGroup.data.component_group)
      
      for (const child of group.children) {
        const children = {
          ...child,
          parent_id: newGroup.data.component_group.id
        }

        await pushComponentsGroups(api, children)
      }

    } catch (err) {
      console.log(err)
      console.log(
        `${chalk.yellow('-')} Components group ${groupName} already exists...`
      )
    }
}

const push = async (api, components, componentsGroups = [], presets = []) => {
  const targetSpaceId = api.spaceId
  const presetsLib = new PresetsLib({ oauthToken: api.accessToken, targetSpaceId, })
  const apiClient = api.getClient()
  try {
    const componentGroupsTree = buildComponentsGroupsTree(componentsGroups)

    for (const rootComponent of componentGroupsTree) {
      await pushComponentsGroups(api, rootComponent)
    }
    
    const apiComponents = await api.getComponents()

    for (let i = 0; i < components.length; i++) {
      const componentPresets = presetsLib.getComponentPresets(components[i], presets)
      const defaultPreset = componentPresets.find(preset => preset.id === components[i].preset_id)
      delete components[i].id
      delete components[i].created_at

      const groupName = components[i].component_group_name
      const groupData = getGroupByName(listOfGroups, groupName)

      if (groupName) {
        components[i].component_group_uuid = groupData.uuid
        delete components[i].component_group_name
      }

      const { internal_tags_list, internal_tag_ids } = components[i];
      const existingTags = await getSpaceInternalTags(apiClient, targetSpaceId);

      let processedInternalTagsIds = [];
      if(internal_tags_list.length > 0) {
        await internal_tags_list.forEach(async (tag) => {
          const existingTag = existingTags.find(({ name }) => tag.name === name);
          if(!existingTag) {
            try {
              const response = await createComponentInternalTag(apiClient, targetSpaceId, tag);
              processedInternalTagsIds.push(response.id);
            } catch (e) {
              console.error(chalk.red("X") + ` Internal tag ${tag} creation failed: ${e.message}`);
            }
          } else {
            processedInternalTagsIds.push(existingTag.id);
          }
        })
      }

      components[i].internal_tag_ids = processedInternalTagsIds || internal_tag_ids;


      const schema = components[i].schema
      if (schema) {
        Object.keys(schema).forEach(field => {
          if (schema[field].component_group_whitelist) {
            schema[field].component_group_whitelist = schema[field].component_group_whitelist.map(uuid =>
              getGroupByUuid(listOfGroups, uuid) ? getGroupByUuid(listOfGroups, uuid).uuid : uuid
            )
          }
        })
      }

      const exists = apiComponents.filter(function (comp) {
        return comp.name === components[i].name
      })

      if (exists.length > 0) {
        const { id, name } = exists[0]
        console.log(`${chalk.blue('-')} Updating component ${name}...`)
        const componentTarget = await api.get(`components/${id}`)

        try {
          const presetsToSave = presetsLib.filterPresetsFromTargetComponent(
            componentPresets || [],
            componentTarget.data.component.all_presets || []
          )
          if (presetsToSave.newPresets.length) {
            await presetsLib.createPresets(presetsToSave.newPresets, componentTarget.data.component.id, 'post')
          }
          if (presetsToSave.updatePresets.length) {
            await presetsLib.createPresets(presetsToSave.updatePresets, componentTarget.data.component.id, 'put')
          }
          if (defaultPreset) {
            const defaultPresetInTarget = await presetsLib.getSamePresetFromTarget(api.spaceId, componentTarget.data.component, defaultPreset)
            if (defaultPresetInTarget) {
              components[i].preset_id = defaultPresetInTarget.id
            }
          }

          await api.put(`components/${id}`, {
            component: components[i]
          })

          console.log(`${chalk.green('✓')} Component ${name} has been updated in Storyblok!`)
        } catch (e) {
          console.error(`${chalk.red('X')} An error occurred when update component ${name}`)
          console.error(e.message)
        }
      } else {
        const { name } = components[i]
        console.log(`${chalk.blue('-')} Creating component ${name}...`)
        try {
          const componentRes = await api.post('components', {
            component: components[i]
          })
          if (componentPresets) {
            await presetsLib.createPresets(componentPresets, componentRes.data.component.id)

            if (defaultPreset) {
              const defaultPresetInTarget = await presetsLib.getSamePresetFromTarget(api.spaceId, componentRes.data.component, defaultPreset)
              if (defaultPresetInTarget) {
                components[i].preset_id = defaultPresetInTarget.id

                await api.put(`components/${componentRes.data.component.id}`, {
                  component: components[i]
                })
              }
            }
          }
          console.log(`${chalk.green('✓')} Component ${name} has been updated in Storyblok!`)
        } catch (e) {
          console.error(`${chalk.red('X')} An error occurred when create component`)
          console.error(e.message)
        }
      }
    }

    return Promise.resolve(true)
  } catch (e) {
    console.error(`${chalk.red('X')} An error occurred when load components file from api`)
    return Promise.reject(e.message)
  }
}

export default pushComponents
