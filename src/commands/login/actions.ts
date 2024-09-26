import { regionsDomain } from '../../constants'
import { ofetch } from 'ofetch'

export const loginWithToken = async (token: string, region: string) => {
  try {
    return await ofetch(`https://${regionsDomain[region]}/v1/users/me`, {
      headers: {
        Authorization: token,
      },
    })
  }
  catch (error) {
    throw new Error('Error logging with token', error)
  }
}

export const loginWithEmailAndPassword = async (email: string, password: string, region: string) => {
  try {
    return await ofetch(`https://${regionsDomain[region]}/v1/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }
  catch (error) {
    throw new Error('Error logging in with email and password', error)
  }
}

export const loginWithOtp = async (email: string, password: string, otp: string, region: string) => {
  try {
    return await ofetch(`https://${regionsDomain[region]}/v1/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password, otp_attempt: otp }),
    })
  }
  catch (error) {
    throw new Error('Error logging in with email, password and otp', error)
  }
}
