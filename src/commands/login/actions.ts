import chalk from 'chalk'
import type { RegionCode } from '../../constants'
import { customFetch, FetchError } from '../../utils/fetch'
import { APIError, handleAPIError, maskToken } from '../../utils'
import { getStoryblokUrl } from '../../utils/api-routes'

export const loginWithToken = async (token: string, region: RegionCode) => {
  try {
    const url = getStoryblokUrl(region)
    return await customFetch(`${url}/users/me`, {
      headers: {
        Authorization: token,
      },
    })
  }
  catch (error) {
    if (error instanceof FetchError) {
      const status = error.response.status

      switch (status) {
        case 401:
          throw new APIError('unauthorized', 'login_with_token', error, `The token provided ${chalk.bold(maskToken(token))} is invalid.
        Please make sure you are using the correct token and try again.`)
        default:
          throw new APIError('network_error', 'login_with_token', error)
      }
    }
    throw new APIError('generic', 'login_with_token', error as FetchError)
  }
}

export const loginWithEmailAndPassword = async (email: string, password: string, region: RegionCode) => {
  try {
    const url = getStoryblokUrl(region)
    return await customFetch(`${url}/users/login`, {
      method: 'POST',
      body: { email, password },
    })
  }
  catch (error) {
    handleAPIError('login_email_password', error as Error)
  }
}

export const loginWithOtp = async (email: string, password: string, otp: string, region: RegionCode) => {
  try {
    const url = getStoryblokUrl(region)
    return await customFetch(`${url}/users/login`, {
      method: 'POST',
      body: { email, password, otp_attempt: otp },
    })
  }
  catch (error) {
    handleAPIError('login_with_otp', error as Error)
  }
}
