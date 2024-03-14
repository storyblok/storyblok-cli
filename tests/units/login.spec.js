import axios from 'axios'
import api from '../../src/utils/api'
import creds from '../../src/utils/creds'
import { EMAIL_TEST, TOKEN_TEST, PASSWORD_TEST, REGION_TEST } from '../constants'
import { jest } from '@jest/globals'

jest.mock('axios')

const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({
  data: {
    access_token: TOKEN_TEST
  }
})

describe('api.login() method', () => {
  beforeEach(() => {
    creds.set(null)
  })

  afterEach(() => {
    creds.set(null)
  })

  it('when login is correct, the .netrc file is populated', async () => {
    await api.login({ email: EMAIL_TEST, password: PASSWORD_TEST })

    expect(creds.get()).toEqual({
      email: EMAIL_TEST,
      token: TOKEN_TEST,
      region: REGION_TEST
    })
  })

  it('when login is incorrect, the .netrc file is not populated and throw a reject message', async () => {
    postSpy.mockRejectedValueOnce(new Error('Incorrect access'))
    try {
      await api.login({ email: EMAIL_TEST, password: '1234', region: REGION_TEST })
    } catch (e) {
      expect(e.message).toBe('Incorrect access')
    }
  })
})
