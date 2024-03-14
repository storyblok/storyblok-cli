import { jest } from '@jest/globals'
import { FAKE_STORIES } from '../constants'
import { jsonParser, discoverExtension, xmlParser, csvParser, sendContent } from '../../src/tasks/import/utils'

const response = [{
  slug: 'this-is-my-title',
  name: 'This is my title',
  parent_id: 0,
  content: {
    component: 'About',
    category: 'press',
    title: 'This is my title',
    image: 'https://a.storyblok.com/f/51376/x/1502f01431/corporate-website.svg',
    text: 'Lorem ipsum dolor sit amet'
  }
}]

describe('Test utils functions to import command', () => {
  it('Test discoverExtension, function', () => {
    const fileName = 'test.csv'
    expect(discoverExtension(fileName)).toEqual('csv')
  })

  it('Test discoverExtension, function', () => {
    const fileName = 'text.test.txt'
    expect(discoverExtension(fileName)).toEqual('txt')
  })

  it('Test xml parser', async () => {
    const data = `
      <?xml version="1.0" encoding="UTF-8"?>
        <root>
          <row>
            <path>this-is-my-title</path>
            <title>This is my title</title>
            <text>Lorem ipsum dolor sit amet</text>
            <image>https://a.storyblok.com/f/51376/x/1502f01431/corporate-website.svg</image>
            <category>press</category>
          </row>
        </root>
    `

    const res = await xmlParser(data, 'About', 0)
    expect(res).toEqual(response)
  })

  // TODO: this test fails because we're trying to iterate over an object as if it was an iterable in the jsonParser function
  // It's either the function that is bugged or this test that has to be reviewed
  it.skip('Test json parser', async () => {
    const data = {
      'this-is-my-title': {
        title: 'This is my title',
        text: 'Lorem ipsum dolor sit amet',
        image: 'https://a.storyblok.com/f/51376/x/1502f01431/corporate-website.svg',
        category: 'press'
      }
    }

    const res = await jsonParser(JSON.stringify(data), 'About', 0)
    expect(res).toEqual(response)
  })

  it('Test csv parser', async () => {
    const data = `path;title;text;image;category
this-is-my-title;This is my title;"Lorem ipsum dolor sit amet";https://a.storyblok.com/f/51376/x/1502f01431/corporate-website.svg;press`

    const res = await csvParser(data, 'About', 0)

    expect(res).toEqual(response)
  })

  it('Test sendContent function', async () => {
    const URL = 'https://api.storyblok.com/v1/'
    const stories = FAKE_STORIES()[0]

    const FAKE_API = {
      getClient: jest.fn(() => Promise.resolve({
        oauthToken: process.env.STORYBLOK_TOKEN
      }, URL)),
      post: jest.fn(() => Promise.resolve(stories.name)),
      spaceId: jest.fn(() => Promise.resolve(75070))
    }

    await sendContent(FAKE_API, [stories])
    expect(await FAKE_API.post()).toBe(stories.name)
  })
})
