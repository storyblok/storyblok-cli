import fs from 'fs'
import scaffold from '../../src/tasks/scaffold'
import Storyblok from 'storyblok-js-client'
import api from '../../src/utils/api'
import { getRegionApiEndpoint } from '../../src/utils/region'
import { EU_CODE } from '@storyblok/region-helper'

import { jest } from '@jest/globals'

jest.spyOn(fs, 'writeFileSync').mockReturnValue("path_to_file")

const deleteTestComponent = async () => {
  if (process.env.STORYBLOK_TOKEN) {
    const client = new Storyblok({
      oauthToken: process.env.STORYBLOK_TOKEN
    }, getRegionApiEndpoint(EU_CODE))

    try {
      const path = `spaces/${process.env.STORYBLOK_SPACE}/components`
      const body = await client.get(path)
      const comps = body.data.components

      const testComp = comps.filter(comp => comp.name === 'testando')[0] || {}

      if (testComp.id) {
        const { id } = testComp

        const compPath = `spaces/${process.env.STORYBLOK_SPACE}/components/${id}`
        await client.delete(compPath, null)
      }
    } catch (e) {
      console.error(e.message)
    }
  }
}

describe('testing scaffold()', () => {
  beforeEach(async () => {
    await deleteTestComponent()
  })

  afterEach(async () => {
    await deleteTestComponent()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('call scaffold() with space should create a new component with corresponding name', async () => {
    const COMPONENT_TEST_NAME = 'testando'

    if (process.env.STORYBLOK_TOKEN && process.env.STORYBLOK_SPACE) {
      api.accessToken = process.env.STORYBLOK_TOKEN

      await scaffold(api, COMPONENT_TEST_NAME, process.env.STORYBLOK_SPACE)

      const components = await api.getComponents()

      const exists = components.filter(comp => {
        return comp.name === COMPONENT_TEST_NAME
      })

      expect(exists.length).toBe(1)
    }
  })

  it('call scaffold() without space should create correspoding template files', async () => {
    const COMPONENT_TEST_NAME = 'columns'

    await scaffold(api, COMPONENT_TEST_NAME)

    const [firstCall, secondCall] = fs.writeFileSync.mock.calls

    const [firstCallPath] = firstCall
    const [secondCallPath] = secondCall

    expect(firstCallPath).toBe('./views/components/_columns.liquid')
    expect(secondCallPath).toBe('./source/scss/components/below/_columns.scss')
  })
})