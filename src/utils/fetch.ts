export class FetchError extends Error {
  response: {
    status: number
    statusText: string
    data?: Record<string, unknown> | null
  }

  constructor(message: string, response: { status: number, statusText: string, data?: Record<string, unknown> | null }) {
    super(message)
    this.name = 'FetchError'
    this.response = response
  }
}

export interface FetchOptions {
  headers?: Record<string, string>
  method?: string
  body?: any
}

export async function customFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Handle JSON body
    const fetchOptions: FetchOptions = {
      ...options,
      headers,
    }

    if (options.body) {
      fetchOptions.body = typeof options.body === 'string'
        ? options.body
        : JSON.stringify(options.body)
    }

    const response = await fetch(url, fetchOptions)
    let data
    try {
      // We try to parse the response as JSON
      data = await response.json()
    }
    catch {
      // If it fails, we throw an error
      throw new FetchError(`Non-JSON response`, {
        status: response.status,
        statusText: response.statusText,
        data: null,
      })
    }

    if (!response.ok) {
      throw new FetchError(`HTTP error! status: ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        data,
      })
    }

    return data
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
