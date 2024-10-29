import { FetchError } from 'ofetch'

export const API_ACTIONS = {
  login: 'login',
  login_with_token: 'Failed to log in with token',
  login_with_otp: 'Failed to log in with email, password and otp',
  login_email_password: 'Failed to log in with email and password',
} as const

export const API_ERRORS = {
  unauthorized: 'The user is not authorized to access the API',
  network_error: 'No response from server, please check if you are correctly connected to internet',
  invalid_credentials: 'The provided credentials are invalid',
  timeout: 'The API request timed out',
  generic: 'Error logging in',
} as const

export function handleAPIError(action: keyof typeof API_ACTIONS, error: Error): void {
  if (error instanceof FetchError) {
    const status = error.response?.status

    switch (status) {
      case 401:
        throw new APIError('unauthorized', action, error)
      case 422:
        throw new APIError('invalid_credentials', action, error)
      default:
        throw new APIError('network_error', action, error)
    }
  }
  else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
    throw new APIError('network_error', action, error)
  }
  throw new APIError('generic', action, error)
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
      cause: this.cause,
      errorId: this.errorId,
      stack: this.stack,
    }
  }
}