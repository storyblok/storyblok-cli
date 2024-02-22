import inquirer from 'inquirer'
import fs from 'fs-extra'
import { jest } from '@jest/globals'

import { FAKE_COMPONENTS } from '../constants'
import generateMigration from '../../src/tasks/migrations/generate'
import templateFile from '../../src/tasks/templates/migration-file'

const templateFileData = templateFile.replace(/{{ fieldname }}/g, 'subtitle')

jest.mock('fs-extra')
jest.spyOn(fs, 'pathExists')
jest.spyOn(fs, 'outputFile')

afterEach(() => {
  jest.clearAllMocks()
})

const getPath = fileName => `${process.cwd()}/migrations/${fileName}`

const FAKE_API = {
  getComponents: jest.fn(() => Promise.resolve(FAKE_COMPONENTS()))
}

const FILE_NAME = 'change_teaser_subtitle.js'

describe('testing generateMigration', () => {
  describe('when migration file does not exists', () => {
    let backup

    beforeEach(() => {
      backup = inquirer.prompt
      inquirer.prompt = () => Promise.resolve({ choice: true })
    })

    afterEach(() => {
      inquirer.prompt = backup
    })

    it('It returns correctly fileName and created properties when the file does not exists', async () => {
      const data = await generateMigration(FAKE_API, 'teaser', 'subtitle')

      expect(data.fileName).toBe(FILE_NAME)
      expect(data.created).toBe(true)
    })

    it('It checks if the file exists', async () => {
      const filePath = getPath(FILE_NAME)

      await generateMigration(FAKE_API, 'teaser', 'subtitle')
      // call once
      expect(FAKE_API.getComponents.mock.calls.length).toBe(1)
      // the first call receives the file path
      expect(fs.pathExists.mock.calls[0][0]).toBe(filePath)
    })

    it('It create the file correctly', async () => {
      const filePath = getPath(FILE_NAME)

      await generateMigration(FAKE_API, 'teaser', 'subtitle')
      // call once
      expect(fs.outputFile.mock.calls.length).toBe(1)
      // the first call receives the file argument
      expect(fs.outputFile.mock.calls[0][0]).toBe(filePath)
      // the first call receives a string with template
      expect(fs.outputFile.mock.calls[0][1]).toBe(templateFileData)
    })
  })

  it('It throws an error when component does not exists', async () => {
    try {
      await generateMigration(FAKE_API, 'produce', 'price')
    } catch (e) {
      expect(e.message).toBe('The component does not exists')
    }
  })

  describe('when migration file exists and user choice do not overwrite', () => {
    let backup

    beforeEach(() => {
      backup = inquirer.prompt
      inquirer.prompt = () => Promise.resolve({ choice: false })
    })

    afterEach(() => {
      inquirer.prompt = backup
    })

    it('It does not overwrite the migration file', async () => {
      const data = await generateMigration(FAKE_API, 'teaser', 'subtitle')

      expect(data.fileName).toBe(FILE_NAME)
      expect(data.created).toBe(false)
    })

    it('It checks if the file exists', async () => {
      const filePath = getPath(FILE_NAME)

      await generateMigration(FAKE_API, 'teaser', 'subtitle')
      // call once
      expect(FAKE_API.getComponents.mock.calls.length).toBe(1)
      // the first call receives the file path
      expect(fs.pathExists.mock.calls[0][0]).toBe(filePath)
    })

    it('It does not create the file', async () => {
      await generateMigration(FAKE_API, 'teaser', 'subtitle')
      // don't call
      expect(fs.outputFile.mock.calls.length).toBe(0)
    })
  })

  describe('when migration file exists and user choice do overwrite', () => {
    let backup

    beforeEach(() => {
      backup = inquirer.prompt
      inquirer.prompt = () => Promise.resolve({ choice: true })
    })

    afterEach(() => {
      inquirer.prompt = backup
    })

    it('It does overwrite the migration file', async () => {
      const data = await generateMigration(FAKE_API, 'teaser', 'subtitle')

      expect(data.fileName).toBe(FILE_NAME)
      expect(data.created).toBe(true)
    })

    it('It checks if the file exists', async () => {
      const filePath = getPath(FILE_NAME)

      await generateMigration(FAKE_API, 'teaser', 'subtitle')
      // call once
      expect(FAKE_API.getComponents.mock.calls.length).toBe(1)
      // the first call receives the file path
      expect(fs.pathExists.mock.calls[0][0]).toBe(filePath)
    })

    it('It does create the file', async () => {
      const filePath = getPath(FILE_NAME)

      await generateMigration(FAKE_API, 'teaser', 'subtitle')
      // call once
      expect(fs.outputFile.mock.calls.length).toBe(1)
      // the first call receives the file argument
      expect(fs.outputFile.mock.calls[0][0]).toBe(filePath)
      // the first call receives a string with template
      expect(fs.outputFile.mock.calls[0][1]).toBe(templateFileData)
    })
  })
})
