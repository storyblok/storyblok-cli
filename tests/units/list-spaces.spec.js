const { listSpaces } = require('../../src/tasks/')
const { FAKE_SPACES } = require('../constants')
const { REGIONS } = require('../../src/constants')

describe('Test spaces method', () => {
  it('Testing list-spaces funtion without api instance', async () => {
    try {
      const spaces = await listSpaces()
      expect(spaces).toStrictEqual([])
    } catch (e) {
      console.error(e)
    }
  })

  it('Testing list-spaces function for China region', async () => {
    const FAKE_API = {
      getAllSpacesByRegion: jest.fn(() => Promise.resolve(FAKE_SPACES()))
    }
    expect(
      await listSpaces(FAKE_API, REGIONS.cn.key)
    ).toEqual(FAKE_SPACES())
    expect(FAKE_API.getAllSpacesByRegion).toHaveBeenCalled()
  })

  it('Testing list-spaces funtion for all regions', async () => {
    const FAKE_API = {
      getAllSpacesByRegion: jest.fn(() => Promise.resolve(FAKE_SPACES()))
    }
    const response = [
      {
        key: REGIONS.eu.key,
        res: [...FAKE_SPACES()]
      },
      {
        key: REGIONS.us.key,
        res: [...FAKE_SPACES()]
      },
      {
        key: REGIONS.ca.key,
        res: [...FAKE_SPACES()]
      },
      {
        key: REGIONS.ap.key,
        res: [...FAKE_SPACES()]
      }
    ]

    expect(
      await listSpaces(FAKE_API, REGIONS.eu.key)
    ).toEqual(response)
  })
})
