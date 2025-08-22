import sync from '../../src/tasks/sync'
import { TOKEN_TEST, EMAIL_TEST, REGION_TEST, FAKE_COMPONENTS } from '../constants'
import creds from '../../src/utils/creds'
import { jest } from '@jest/globals'
import Storyblok from 'storyblok-js-client'
import PresetsLib from '../../src/utils/presets-lib'

const FAKE_COMPONENTS_TO_TEST = {
  '001': {
    data: {
      components: FAKE_COMPONENTS()
    }
  },
  '002': {
    data: {
      components: [
        {
          name: 'feature',
          display_name: null,
          created_at: '2019-11-06T17:07:04.196Z',
          updated_at: '2019-11-06T18:12:29.136Z',
          id: 1,
          schema: {
            logo: {
              type: 'image'
            },
            name: {
              type: 'text'
            },
            description: {
              type: 'textarea'
            },
            link_text: {
              type: 'text'
            },
            link: {
              type: 'multilink'
            }
          },
          image: null,
          preview_field: null,
          is_root: false,
          preview_tmpl: null,
          is_nestable: true,
          all_presets: [],
          internal_tag_ids: [],
          internal_tags_list: [],
          preset_id: null,
          real_name: 'feature',
          component_group_uuid: null
        },
        {
          name: 'teaser',
          display_name: null,
          id: 0,
          schema: {
            headline: {
              type: 'text'
            }
          },
          image: null,
          preview_field: null,
          is_root: false,
          preview_tmpl: null,
          is_nestable: true,
          all_presets: [],
          internal_tag_ids: [],
          internal_tags_list: [],
          preset_id: null,
          real_name: 'teaser',
          component_group_uuid: null
        }
      ],
      internal_tags: [
        {
          id: 1,
          name: 'tag1',
          object_type: 'component',
        },
        {
          id: 2,
          name: 'tag2',
          object_type: 'component',
        }
      ]
    }
  }
}

const COMPONENT_GROUPS = {
  '001': {
    data: {
      component_groups: [
        {
          name: 'General',
          id: 11216,
          uuid: '529cc32a-1d97-4b4a-b0b6-28e33dc56c0d'
        }
      ]
    }
  },
  '002': {
    data: {
      component_groups: []
    }
  }
}

const FAKE_PRESETS = {
  '001': {
    data: {
      presets: [
        {
          id: '01',
          name: 'Hero Variant 1',
          preset: {
            _uid: '5f8b150f-2931-4693-965e-077a53ec9132',
            title: 'A default hero title',
            subtitle: 'A default hero subtitle',
            component: 'hero',
            image: 'https://a.storyblok.com/f/002/bd78c087d1/screen-shot.png'
          },
          component_id: 3, // from FAKE_COMPONENTS 'hero'
          space_id: '000000',
          created_at: '2020-04-24T18:13:35.056Z',
          updated_at: '2020-04-24T18:13:35.056Z',
          image: null
        }
      ]
    }
  }
}

const extractSpace = path => path.split('/')[1]

const mockGetRequest = (path) => {
  if (
    path === 'spaces/001/component_groups' ||
    path === 'spaces/002/component_groups'
  ) {
    return Promise.resolve(COMPONENT_GROUPS[extractSpace(path)])
  }

  if (
    path === 'spaces/001/components' ||
    path === 'spaces/002/components'
  ) {
    return Promise.resolve(FAKE_COMPONENTS_TO_TEST[extractSpace(path)])
  }

  if (
    path === 'spaces/001/internal_tags' ||
    path === 'spaces/002/internal_tags'
  ) {
    return Promise.resolve(FAKE_COMPONENTS_TO_TEST[extractSpace(path)])
  }
  

  if (path === 'spaces/001/presets') {
    return Promise.resolve(FAKE_PRESETS[extractSpace(path)])
  }

  return Promise.reject(new Error('Error on get mock'))
}

const mockPostRequest = (path, payload) => {
  if (path === 'spaces/002/component_groups') {
    return Promise.resolve({
      data: {
        component_group: {
          ...payload.component_group,
          uuid: '000000002'
        }
      }
    })
  }

  if (path === 'spaces/002/components') {
    if (payload.component.name === 'teaser') {
      /* eslint prefer-promise-reject-errors: "off" */
      return Promise.reject({
        response: {
          status: 422
        }
      })
    }

    return Promise.resolve({
      data: {
        component: {
          ...payload.component,
          id: '000000001'
        }
      }
    })
  }

  return Promise.resolve(true)
}

const mockPutRequest = (path, payload) => {
  return Promise.resolve({
    data: {
      component: {
        ...payload.component,
      }
    }
  })
}

const spyGet = jest.spyOn(Storyblok.prototype, 'get').mockImplementation(mockGetRequest)
const spyPost = jest.spyOn(Storyblok.prototype, 'post').mockImplementation(mockPostRequest)
const spyPut = jest.spyOn(Storyblok.prototype, 'put').mockImplementation(mockPutRequest)

const spyGetPresets = jest.spyOn(PresetsLib.prototype, 'getPresets').mockImplementation((spaceId) => {
  return Promise.resolve(FAKE_PRESETS[spaceId].data.presets)
})

const spyCreatePresets = jest.spyOn(PresetsLib.prototype, 'createPresets').mockImplementation((presets = [], componentId, method = 'post') => {
  return Promise.resolve(true)
})

const SOURCE_SPACE_TEST = '001'
const TARGET_SPACE_TEST = '002'

describe('testing syncComponents', () => {
  beforeAll(() => {
    creds.set(EMAIL_TEST, TOKEN_TEST, REGION_TEST)
    // we need to execute once this function to test it
    const _types = ['components']

    return sync(_types, {
      api: {
        getClient: jest.fn(() => ({}))
      },
      token: TOKEN_TEST,
      source: SOURCE_SPACE_TEST,
      target: TARGET_SPACE_TEST
    })
  })

  afterAll(() => {
    spyGet.mockClear()
    spyPost.mockClear()
    spyPut.mockClear()
    spyGetPresets.mockClear()
    spyCreatePresets.mockClear()
  })

  it('shoud be get the all data correctly', () => {
    // it must be get each component group
    expect(spyGet).toHaveBeenCalledWith('spaces/001/component_groups')
    expect(spyGet).toHaveBeenCalledWith('spaces/002/component_groups')

    // it must be get components and presets
    expect(spyGet).toHaveBeenCalledWith('spaces/001/components')
    expect(spyGet).toHaveBeenCalledWith('spaces/002/components')

    // it must be get presets
    expect(spyGetPresets).toHaveBeenCalledWith('001')
  })

  it('shoud be create the General component_groups correctly', () => {
    // it must be get each component group
    expect(spyPost).toHaveBeenCalledWith(
      'spaces/002/component_groups',
      {
        component_group: {
          name: 'General'
        }
      }
    )
  })

  it('shoud be try to create teaser component, but it will fail and execute the put to update it', () => {
    // it must be get each component group
    expect(spyPut).toHaveBeenCalledWith(
      'spaces/002/components/0',
      {
        component: {
          all_presets: [],
          component_group_uuid: null,
          display_name: null,
          id: 0,
          image: null,
          internal_tag_ids: [],
          internal_tags_list: [],
          is_nestable: true,
          is_root: false,
          name: 'teaser',
          preset_id: null,
          preview_field: null,
          preview_tmpl: null,
          real_name: 'teaser',
          schema: {
            headline: {
              type: 'text'
            }
          }
        }
      }
    )
  })

  it('shoud be create the presets for specific components correctly', () => {
    // it must be get each component group
    expect(spyCreatePresets).toHaveBeenCalledWith(
      [{
        id: '01',
        name: 'Hero Variant 1',
        preset: {
          _uid: '5f8b150f-2931-4693-965e-077a53ec9132',
          title: 'A default hero title',
          subtitle: 'A default hero subtitle',
          component: 'hero',
          image: 'https://a.storyblok.com/f/002/bd78c087d1/screen-shot.png'
        },
        component_id: 3, // from FAKE_COMPONENTS 'hero'
        space_id: '000000',
        created_at: '2020-04-24T18:13:35.056Z',
        updated_at: '2020-04-24T18:13:35.056Z',
        image: null
      }],
      '000000001'
    )
  })

  it('shoud be create components related to group correctly', () => {
    expect(spyPost).toHaveBeenCalledWith(
      'spaces/002/components',
      {
        component: {
          name: 'logo',
          display_name: null,
          schema: {
            image: {
              type: 'image'
            }
          },
          image: null,
          preview_field: null,
          is_root: false,
          preview_tmpl: null,
          is_nestable: true,
          all_presets: [],
          internal_tag_ids: [],
          internal_tags_list: [],
          preset_id: null,
          real_name: 'logo',
          component_group_uuid: '000000002'
        }
      }
    )
  })

  it('shoud be create components with correct schema', () => {
    expect(spyPost).toHaveBeenCalledWith(
      'spaces/002/components',
      {
        component: {
          name: 'blocks',
          display_name: null,
          schema: {
            other: {
              type: 'bloks',
              max_length: '',
              translatable: false,
              restrict_components: true,
              restrict_type: 'groups',
              component_group_whitelist: [
                '000000002'
              ]
            }
          },
          image: null,
          preview_field: null,
          is_root: false,
          preview_tmpl: null,
          is_nestable: true,
          all_presets: [],
          preset_id: null,
          real_name: 'blocks',
          component_group_uuid: null
        }
      }
    )
  })
})
