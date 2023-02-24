const fs = require('fs')
const pullComponents = require('../../src/tasks/pull-components')
const { FAKE_COMPONENTS, FAKE_PRESET } = require('../constants')

jest.mock('fs')

describe('testing pullComponents', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('api.getComponents() should be called once time', () => {
    const api = {
      getComponents: jest.fn(() => Promise.resolve(FAKE_COMPONENTS())),
      getPresets: jest.fn(() => Promise.resolve([])),
      getComponentGroups () {
        return Promise.resolve([])
      }
    }

    return pullComponents(api, {})
      .then(() => {
        expect(api.getComponents.mock.calls.length).toBe(1)
      })
  })

  it('pull components should be call fs.writeFile correctly and generate component file', async () => {
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
      space: SPACE
    }

    const expectFileName = `components.${SPACE}.json`

    return pullComponents(api, options)
      .then(_ => {
        const [path, data] = fs.writeFile.mock.calls[0]

        expect(fs.writeFile.mock.calls.length).toBe(1)
        expect(path).toBe(`./${expectFileName}`)
        expect(JSON.parse(data)).toEqual({ components: [FAKE_COMPONENTS()[0]] })
      })
  })

  it('pull components should be call fs.writeFile correctly and generate a component and preset files', async () => {
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
      space: SPACE
    }

    const expectComponentFileName = `components.${SPACE}.json`
    const expectPresetFileName = `presets.${SPACE}.json`

    return pullComponents(api, options)
      .then(_ => {
        const [compPath, compData] = fs.writeFile.mock.calls[0]
        const [presetPath, presetData] = fs.writeFile.mock.calls[1]

        expect(fs.writeFile.mock.calls.length).toBe(2)

        expect(compPath).toBe(`./${expectComponentFileName}`)
        expect(JSON.parse(compData)).toEqual({ components: [FAKE_COMPONENTS()[0]] })

        expect(presetPath).toBe(`./${expectPresetFileName}`)
        expect(JSON.parse(presetData)).toEqual({ presets: FAKE_PRESET() })
      })
  })

  it('pull components should be call fs.writeFile and generate a single file for each component', async () => {
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
      space: SPACE,
      separateFiles: true
    }

    return pullComponents(api, options)
      .then(_ => {
        expect(fs.writeFile.mock.calls.length).toBe(FAKE_COMPONENTS().length)

        for (const comp in FAKE_COMPONENTS()) {
          const compFileName = `${FAKE_COMPONENTS()[comp].name}-${SPACE}.json`
          let data = FAKE_COMPONENTS()[comp]
          const [compPath, compData] = fs.writeFile.mock.calls[comp]

          if (FAKE_COMPONENTS()[comp].name === 'logo') {
            data = { ...FAKE_COMPONENTS()[comp], component_group_name: '' }
          }

          expect(compPath).toBe(`./${compFileName}`)
          expect(JSON.parse(compData)).toEqual(data)
        }
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
