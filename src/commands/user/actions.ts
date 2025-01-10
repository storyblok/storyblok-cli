import chalk from 'chalk'
import type { RegionCode } from '../../constants'
import { customFetch, FetchError } from '../../utils/fetch'
import { APIError, maskToken } from '../../utils'
import { getStoryblokUrl } from '../../utils/api-routes'

export const getUser = async (token: string, region: RegionCode) => {
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
          throw new APIError('unauthorized', 'get_user', error, `The token provided ${chalk.bold(maskToken(token))} is invalid.
        Please make sure you are using the correct token and try again.`)
        default:
          throw new APIError('network_error', 'get_user', error)
      }
    }
    throw new APIError('generic', 'get_user', error as FetchError)
  }
}
