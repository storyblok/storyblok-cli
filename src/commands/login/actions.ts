import chalk from 'chalk'
import type { RegionCode } from '../../constants'
import { regionsDomain } from '../../constants'
import { FetchError, ofetch } from 'ofetch'
import { APIError, handleAPIError, maskToken } from '../../utils'

export const loginWithToken = async (token: string, region: RegionCode) => {
  try {
    return await ofetch(`https://${regionsDomain[region]}/v1/users/me`, {
      headers: {
        Authorization: token,
      },
    })
  }
  catch (error) {
    if (error instanceof FetchError) {
      const status = error.response?.status

      switch (status) {
        case 401:
          throw new APIError('unauthorized', 'login_with_token', error, `The token provided ${chalk.bold(maskToken(token))} is invalid: ${chalk.bold(`401 ${(error as FetchError).data.error}`)}
        Please make sure you are using the correct token and try again.`)
        case 422:
          throw new APIError('invalid_credentials', 'login_with_token', error)
        default:
          throw new APIError('network_error', 'login_with_token', error)
      }
    }
  }
}

export const loginWithEmailAndPassword = async (email: string, password: string, region: RegionCode) => {
  try {
    return await ofetch(`https://${regionsDomain[region]}/v1/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }
  catch (error) {
    handleAPIError('login_email_password', error as Error)
  }
}

export const loginWithOtp = async (email: string, password: string, otp: string, region: RegionCode) => {
  try {
    return await ofetch(`https://${regionsDomain[region]}/v1/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password, otp_attempt: otp }),
    })
  }
  catch (error) {
    handleAPIError('login_with_otp', error as Error)
  }
}
