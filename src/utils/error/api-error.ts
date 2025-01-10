import { FetchError } from '../fetch'

export const API_ACTIONS = {
  login: 'login',
  login_with_token: 'Failed to log in with token',
  login_with_otp: 'Failed to log in with email, password and otp',
  login_email_password: 'Failed to log in with email and password',
  get_user: 'Failed to get user',
  pull_languages: 'Failed to pull languages',
} as const

export const API_ERRORS = {
  unauthorized: 'The user is not authorized to access the API',
  network_error: 'No response from server, please check if you are correctly connected to internet',
  invalid_credentials: 'The provided credentials are invalid',
  timeout: 'The API request timed out',
  generic: 'Error fetching data from the API',
  not_found: 'The requested resource was not found',
} as const

export function handleAPIError(action: keyof typeof API_ACTIONS, error: unknown): void {
  if (error instanceof FetchError) {
    const status = error.response.status

    switch (status) {
      case 401:
        throw new APIError('unauthorized', action, error)
      case 404:
        throw new APIError('not_found', action, error)
      case 422:
        throw new APIError('invalid_credentials', action, error)
      default:
        throw new APIError('network_error', action, error)
    }
  }
  throw new APIError('generic', action, error as FetchError)
}

export class APIError extends Error {
  errorId: string
  cause: string
  code: number
  messageStack: string[]
  error: FetchError | undefined

  constructor(errorId: keyof typeof API_ERRORS, action: keyof typeof API_ACTIONS, error?: FetchError, customMessage?: string) {
    super(customMessage || API_ERRORS[errorId])
    this.name = 'API Error'
    this.errorId = errorId
    this.cause = API_ERRORS[errorId]
    this.code = error?.response?.status || 0
    this.messageStack = [API_ACTIONS[action], customMessage || API_ERRORS[errorId]]
    this.error = error
  }

  getInfo() {
    return {
      name: this.name,
      message: this.message,
      httpCode: this.code,
      cause: this.cause,
      errorId: this.errorId,
      stack: this.stack,
    }
  }
}
