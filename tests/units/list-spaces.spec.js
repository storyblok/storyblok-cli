const { listSpaces } = require('../../src/tasks/')
const { FAKE_SPACES } = require('../constants')

const REGION_FLAGS = {
  UNITED_STATES: 'us',
  EUROPE: 'eu',
  CHINA: 'cn'
}

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
      await listSpaces(FAKE_API, REGION_FLAGS.CHINA)
    ).toEqual(FAKE_SPACES())
    expect(FAKE_API.getAllSpacesByRegion).toHaveBeenCalled()
  })

  it('Testing list-spaces funtion for Europe and United States regions', async () => {
    const FAKE_API = {
      getAllSpacesByRegion: jest.fn(() => Promise.resolve(FAKE_SPACES()))
    }
    const response = [
      {
        key: REGION_FLAGS.EUROPE,
        res: [...FAKE_SPACES()]
      },
      {
        key: REGION_FLAGS.UNITED_STATES,
        res: [...FAKE_SPACES()]
      }
    ]

    expect(
      await listSpaces(FAKE_API, REGION_FLAGS.EUROPE)
    ).toEqual(response)
  })
})
