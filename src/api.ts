import StoryblokClient from 'storyblok-js-client'

export interface ApiClientState {
  region: string
  accessToken: string
  client: StoryblokClient | null
}

const state: ApiClientState = {
  region: 'eu',
  accessToken: '',
  client: null,
}

export function apiClient() {
  if (!state.client) {
    createClient()
  }

  function createClient() {
    state.client = new StoryblokClient({
      accessToken: state.accessToken,
      region: state.region,
    })
  }

  function setAccessToken(accessToken: string) {
    state.accessToken = accessToken
    state.client = null
    createClient()
  }

  function setRegion(region: string) {
    state.region = region
    state.client = null
    createClient()
  }

  return {
    region: state.region,
    client: state.client,
    setAccessToken,
    setRegion,
  }
}
