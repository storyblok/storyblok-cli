import axios from 'axios'
import api from '../../src/utils/api'
import creds from '../../src/utils/creds'
import { EMAIL_TEST, PASSWORD_TEST, TOKEN_TEST } from '../constants'
import { jest } from '@jest/globals'

jest.mock('axios')
jest.spyOn(axios, 'post').mockResolvedValue({
  data: {
    access_token: TOKEN_TEST
  }
})

describe('api.isAuthorized() method', () => {
  beforeEach(() => {
    creds.set(null)
  })

  afterEach(() => {
    creds.set(null)
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('api.isAuthorized() should be true when user is not logged', async () => {
    await api.login(EMAIL_TEST, PASSWORD_TEST)
    expect(api.isAuthorized()).toBe(true)
  })

  it('api.isAuthorized() should be false when user is logout', async () => {
    await api.login(EMAIL_TEST, PASSWORD_TEST)
    expect(api.isAuthorized()).toBe(true)

    api.logout()
    expect(api.isAuthorized()).toBe(false)
  })
})
