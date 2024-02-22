import api from '../../src/utils/api'
import creds from '../../src/utils/creds'
import { EMAIL_TEST, TOKEN_TEST } from '../constants'

describe('api.logout() method', () => {
  beforeEach(() => {
    creds.set(EMAIL_TEST, TOKEN_TEST)
  })

  afterEach(() => {
    creds.set(null)
  })

  it('api.logout() should be empty the .netrc file', () => {
    api.logout()

    expect(creds.get()).toEqual(null)
  })
})
