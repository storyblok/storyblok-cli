import type { FetchError } from 'ofetch'
import { ofetch } from 'ofetch'
import { regionsDomain } from '../../constants'
import chalk from 'chalk'
import { maskToken } from '../../utils'

export const getUser = async (token: string, region: string) => {
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
    throw new Error('There was an error logging with token ', error as Error)
  }
}
