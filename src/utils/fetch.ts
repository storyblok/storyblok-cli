export class FetchError extends Error {
  response: {
    status: number
    statusText: string
    data?: any
  }

  constructor(message: string, response: { status: number, statusText: string, data?: any }) {
    super(message)
    this.name = 'FetchError'
    this.response = response
  }
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: any
}

export async function customFetch<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Handle JSON body
    const fetchOptions: RequestInit = {
      ...options,
      headers,
    }

    if (options.body) {
      if (typeof options.body === 'string') {
        try {
          JSON.parse(options.body)
          fetchOptions.body = options.body
        }
        catch {
          fetchOptions.body = JSON.stringify(options.body)
        }
      }
      else {
        fetchOptions.body = JSON.stringify(options.body)
      }
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      let data
      try {
        data = await response.json()
      }
      catch {
        // Ignore JSON parse errors
      }
      throw new FetchError(`HTTP error! status: ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        data,
      })
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return await response.json()
    }
    return await response.text() as T
  }
  catch (error) {
    if (error instanceof FetchError) {
      throw error
    }
    // For network errors or other non-HTTP errors, create a FetchError
    throw new FetchError(error instanceof Error ? error.message : String(error), {
      status: 0,
      statusText: 'Network Error',
      data: null,
    })
  }
}
