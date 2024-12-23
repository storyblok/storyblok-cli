import fs from 'fs'
import pullComponents from '../../src/tasks/pull-components'
import { FAKE_PRESET, FAKE_COMPONENTS, FAKE_DATASOURCES, FAKE_DATASOURCE_ENTRIES } from '../constants'
import { jest } from '@jest/globals'

jest.spyOn(fs, 'writeFileSync').mockImplementation(jest.fn((key, data, _) => {
  [key] = data
}))

describe('testing pullComponents', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('api.getComponents() should be called once time', async () => {
    const api = {
      getComponents: jest.fn(() => Promise.resolve(FAKE_COMPONENTS())),
      getPresets: jest.fn(() => Promise.resolve([])),
      getComponentGroups () {
        return Promise.resolve([])
      }
    }

    await pullComponents(api, {})
    expect(api.getComponents.mock.calls.length).toBe(1)
  })

  it('pull components should be call fs.writeFileSync correctly and generate component file', async () => {
    const SPACE = 12345

    const api = {
      getComponents () {
        return Promise.resolve([FAKE_COMPONENTS()[0]])
      },
      getComponentGroups () {
        return Promise.resolve([])
      },
      getPresets () {
        return Promise.resolve([])
      }
    }

    const options = {
      fileName: SPACE
    }

    const expectFileName = `components.${SPACE}.json`

    await pullComponents(api, options)
    const [path, data] = fs.writeFileSync.mock.calls[0]

    expect(fs.writeFileSync.mock.calls.length).toBe(1)
    expect(path).toBe(`./${expectFileName}`)
    expect(JSON.parse(data)).toEqual({ components: [FAKE_COMPONENTS()[0]], component_groups: [] })
  })

  it('pull components should be call fs.writeFileSync correctly and generate a component and preset files', async () => {
    const SPACE = 12345

    const api = {
      getComponents () {
        return Promise.resolve([FAKE_COMPONENTS()[0]])
      },
      getComponentGroups () {
        return Promise.resolve([])
      },
      getPresets () {
        return Promise.resolve(FAKE_PRESET())
      }
    }

    const options = {
      fileName: SPACE
    }

    const expectComponentFileName = `components.${SPACE}.json`
    const expectPresetFileName = `presets.${SPACE}.json`

    await pullComponents(api, options)
    const [compPath, compData] = fs.writeFileSync.mock.calls[0]
    const [presetPath, presetData] = fs.writeFileSync.mock.calls[1]

    expect(fs.writeFileSync.mock.calls.length).toBe(2)

    expect(compPath).toBe(`./${expectComponentFileName}`)
    expect(JSON.parse(compData)).toEqual({ components: [FAKE_COMPONENTS()[0]], component_groups: [] })

    expect(presetPath).toBe(`./${expectPresetFileName}`)
    expect(JSON.parse(presetData)).toEqual({ presets: FAKE_PRESET() })
  })

  it('pull components should be call fs.writeFileSync and generate a single file for each component', async () => {
    const SPACE = 12345

    const api = {
      getComponents () {
        return Promise.resolve(FAKE_COMPONENTS())
      },
      getComponentGroups () {
        return Promise.resolve([])
      },
      getPresets () {
        return Promise.resolve([])
      }
    }

    const options = {
      fileName: SPACE,
      separateFiles: true
    }

    await pullComponents(api, options)
    expect(fs.writeFileSync.mock.calls.length).toBe(FAKE_COMPONENTS().length)

    for (const comp in FAKE_COMPONENTS()) {
      const fileName = `${FAKE_COMPONENTS()[comp].name}-${SPACE}.json`
      let data = FAKE_COMPONENTS()[comp]
      const [compPath, compData] = fs.writeFileSync.mock.calls[comp]

      if (FAKE_COMPONENTS()[comp].name === 'logo') {
        data = { ...FAKE_COMPONENTS()[comp], component_group_name: '' }
      }

      expect(compPath).toBe(`./${fileName}`)
      expect(JSON.parse(compData)).toEqual(data)
    }
  })

  it('pull components should be call fs.writeFile correctly and return filled options from datasource entries', async () => {
    const SPACE = 12345

    const api = {
      getComponents () {
        return Promise.resolve([FAKE_COMPONENTS()[5]])
      },
      getComponentGroups () {
        return Promise.resolve([])
      },
      getDatasources () {
        return Promise.resolve(FAKE_DATASOURCES())
      },
      getDatasourceEntries () {
        return Promise.resolve(FAKE_DATASOURCE_ENTRIES())
      },
      getPresets () {
        return Promise.resolve([])
      }
    }

    const options = {
      fileName: SPACE,
      resolveDatasources: true
    }

    const expectFileName = `components.${SPACE}.json`

    await pullComponents(api, options)
    const [path, data] = fs.writeFile.mock.calls[0]

    expect(fs.writeFile.mock.calls.length).toBe(1)
    expect(path).toBe(`./${expectFileName}`)
    expect(JSON.parse(data)).toEqual({
      components: [{
        ...FAKE_COMPONENTS()[5],
        schema: {
          robot: {
            type: "option",
            source: "internal",
            datasource_slug: "robots",
            options: FAKE_DATASOURCE_ENTRIES().map(entry => ({ value: entry.value, name: entry.name }))
          }
        }
      }]
    })
  })

  it('api.getComponents() when a error ocurred, catch the body response', async () => {
    const _api = {
      getComponents (_, fn) {
        return Promise.reject(new Error('Failed'))
      },
      getComponentGroups () {
        return Promise.resolve([])
      },
      getPresets () {
        return Promise.resolve([])
      }
    }

    await expect(pullComponents(_api, {})).rejects.toThrow('Error: Failed')
  })
})
