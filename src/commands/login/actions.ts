import chalk from 'chalk'
import type { RegionCode } from '../../constants'
import { regionsDomain } from '../../constants'
import type { FetchError } from 'ofetch'
import { ofetch } from 'ofetch'
import { maskToken } from '../../utils'

export const loginWithToken = async (token: string, region: RegionCode) => {
  try {
    return await ofetch(`https://${regionsDomain[region]}/v1/users/me`, {
      headers: {
        Authorization: token,
      },
    })
  }
  catch (error) {
    if ((error as FetchError).response?.status === 401) {
      throw new Error(`The token provided ${chalk.bold(maskToken(token))} is invalid: ${chalk.bold(`401 ${(error as FetchError).data.error}`)}

  Please make sure you are using the correct token and try again.`)
    }
    if (!(error as FetchError).response) {
      throw new Error('No response from server, please check if you are correctly connected to internet', error as Error)
    }
    throw new Error('Error logging with token', error as Error)
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
    throw new Error('Error logging in with email and password', error as Error)
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
    throw new Error('Error logging in with email, password and otp', error as Error)
  }
}
