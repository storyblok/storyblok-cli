import { FetchError, ofetch } from 'ofetch'
import { regionsDomain } from '../../constants'
import chalk from 'chalk'
import { APIError, maskToken } from '../../utils'

export const getUser = async (token: string, region: string) => {
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
          throw new APIError('unauthorized', 'get_user', error, `The token provided ${chalk.bold(maskToken(token))} is invalid.
        Please make sure you are using the correct token and try again.`)
        default:
          throw new APIError('network_error', 'get_user', error)
      }
    }
    else {
      throw new APIError('generic', 'get_user', error as Error)
    }
  }
}
