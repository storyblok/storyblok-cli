import axios from 'axios'
import api from '../../src/utils/api'
import creds from '../../src/utils/creds'
import { EMAIL_TEST, TOKEN_TEST, PASSWORD_TEST } from '../constants'
import { USERS_ROUTES } from '../../src/constants'
import { jest } from '@jest/globals'

const isCredCorrects = (email, pass) => {
  return email === EMAIL_TEST && pass === PASSWORD_TEST
}

jest.mock('axios')
jest.spyOn(axios, 'post').mockImplementation(jest.fn((path, data) => {
  const { email, password } = data || {}

  if (path === USERS_ROUTES.LOGIN && isCredCorrects(email, password)) {
    return Promise.resolve({
      data: {
        access_token: TOKEN_TEST
      }
    })
  }

  if (path === USERS_ROUTES.SIGNUP && isCredCorrects(email, password)) {
    return Promise.resolve({
      data: {
        access_token: TOKEN_TEST
      }
    })
  }

  return Promise.reject(new Error('Incorrect access'))
}))

describe('api.signup() method', () => {
  beforeEach(() => {
    creds.set(null)
  })

  afterEach(() => {
    creds.set(null)
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('when signup ends correctly, the .netrc file is populated', async () => {
    try {
      await api.signup(EMAIL_TEST, PASSWORD_TEST)

      expect(creds.get()).toEqual({
        email: EMAIL_TEST,
        token: TOKEN_TEST
      })
    } catch (e) {
      console.error(e)
    }
  })

  it('when signup ends correctly, the .netrc file is not populated and throw a reject message', async () => {
    try {
      await api.signup(EMAIL_TEST, '1234')
    } catch (e) {
      expect(e.message).toBe('Incorrect access')
    }
  })
})
