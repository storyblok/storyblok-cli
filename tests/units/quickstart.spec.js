import fs from 'fs'
import path from 'path'
import quickstart from '../../src/tasks/quickstart'
import Storyblok from 'storyblok-js-client'
import api from '../../src/utils/api'
import { jest } from '@jest/globals'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getRegionApiEndpoint } from '../../src/utils/region'
import { EU_CODE } from '@storyblok/region-helper'

const __dirname = dirname(fileURLToPath(import.meta.url))

jest.unmock('fs')
jest.unmock('axios')

const deleteFolderRecursive = path => {
  fs.readdirSync(path).forEach(file => {
    const curPath = path + '/' + file
    if (fs.lstatSync(curPath).isDirectory()) {
      deleteFolderRecursive(curPath)
    } else {
      fs.unlinkSync(curPath)
    }
  })

  fs.rmdirSync(path)
}

const TEST_PATH = path.join(__dirname, '../../space-test')

describe('testing quickstart()', () => {
  beforeEach(() => {
    if (fs.existsSync(TEST_PATH)) {
      deleteFolderRecursive(TEST_PATH)
    }

    api.setSpaceId(null)
  })

  afterEach(() => {
    if (fs.existsSync(TEST_PATH)) {
      deleteFolderRecursive(TEST_PATH)
    }

    api.setSpaceId(null)
  })

  it('call quickstart() with spaceId should clone the quickstart repository space-test folder', async () => {
    if (process.env.STORYBLOK_TOKEN && process.env.STORYBLOK_SPACE) {
      api.accessToken = process.env.STORYBLOK_TOKEN

      await quickstart(api, {}, process.env.STORYBLOK_SPACE)

      expect(fs.existsSync(TEST_PATH)).toBe(true)
    }
  })

  it('call quickstart() without spaceId should create an empty space with corresponding name', async () => {
    const TEST_NAME = 'testando'
    if (process.env.STORYBLOK_TOKEN) {
      api.accessToken = process.env.STORYBLOK_TOKEN

      await quickstart(api, { name: TEST_NAME })

      const client = new Storyblok({
        oauthToken: process.env.STORYBLOK_TOKEN
      }, getRegionApiEndpoint(EU_CODE))

      const response = await client.get('spaces')
      const spaces = response.data.spaces

      const exists = spaces.filter(space => space.name === TEST_NAME)

      expect(exists.length).toBe(1)

      await client.delete(`spaces/${exists[0].id}`)
    }
  })
})
