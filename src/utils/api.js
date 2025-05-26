import chalk from 'chalk'
import axios from 'axios'
import Storyblok from 'storyblok-js-client'
import inquirer from 'inquirer'
import creds from './creds'
import getQuestions from './get-questions'
import { DEFAULT_AGENT } from '../constants'
import { getRegionApiEndpoint } from './region'
import { EU_CODE } from '@storyblok/region-helper'

export default {
  accessToken: '',
  oauthToken: '',
  spaceId: null,
  region: '',

  getClient: (function () {
    let client, accessToken, oauthToken, region, credsRegion

    return function getClient() {
      const { region: _credsRegion } = creds.get()

      // cache the client if the params are the same
      // this is needed so request throttling works properly
      if (
        client
        && accessToken === this.accessToken
        && oauthToken === this.oauthToken
        && region === this.region
        && credsRegion === _credsRegion) {
        return client
      }

      accessToken = this.accessToken
      oauthToken = this.oauthToken
      region = this.region
      credsRegion = _credsRegion

      try {
        return client = new Storyblok({
          accessToken,
          oauthToken,
          region,
          headers: {
            ...DEFAULT_AGENT
          }
        }, this.apiSwitcher(credsRegion))
      } catch (error) {
        throw new Error(error)
      }
    }
  })(),

  getPath (path) {
    if (this.spaceId) {
      return `spaces/${this.spaceId}/${path}`
    }

    return path
  },

  async login (content) {
    const { email, password, region = EU_CODE } = content
    try {
      const response = await axios.post(`${this.apiSwitcher(region)}users/login`, {
        email: email,
        password: password
      })

      const { data } = response

      if (data.otp_required) {
        const questions = [
          {
            type: 'input',
            name: 'otp_attempt',
            message: 'We sent a code to your email / phone, please insert the authentication code:',
            validate (value) {
              if (value.length > 0) {
                return true
              }

              return 'Code cannot blank'
            }
          }
        ]

        const { otp_attempt: code } = await inquirer.prompt(questions)

        const newResponse = await axios.post(`${this.apiSwitcher(region)}users/login`, {
          email: email,
          password: password,
          otp_attempt: code
        })

        return this.persistCredentials(email, newResponse.data.access_token || {}, region)
      }

      return this.persistCredentials(email, data.access_token, region)
    } catch (e) {
      return Promise.reject(e)
    }
  },

  async getUser () {
    const { region } = creds.get()

    try {
      const { data } = await axios.get(`${this.apiSwitcher(this.region ? this.region : region)}users/me`, {
        headers: {
          Authorization: this.oauthToken
        }
      })
      return data.user
    } catch (e) {
      return Promise.reject(e)
    }
  },

  persistCredentials (email, token = null, region = EU_CODE) {
    if (token) {
      this.oauthToken = token
      creds.set(email, token, region)

      return Promise.resolve(token)
    }
    return Promise.reject(new Error('The code could not be authenticated.'))
  },

  async processLogin (token = null, region = null) {
    try {
      if (token && region) {
        await this.loginWithToken({ token, region })
        console.log(chalk.green('✓') + ' Log in successfully! Token has been added to .netrc file.')
        return Promise.resolve({ token, region })
      }

      let content = {}
      await inquirer
        .prompt(getQuestions('login-strategy'))
        .then(async ({ strategy }) => {
          content = await inquirer.prompt(getQuestions(strategy))
        })
        .catch((error) => {
          console.log(error)
        })

      if (!content.token) {
        await this.login(content)
      } else {
        await this.loginWithToken(content)
      }

      console.log(chalk.green('✓') + ' Log in successfully! Token has been added to .netrc file.')

      return Promise.resolve(content)
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        console.error(chalk.red('X') + ' An error ocurred when login the user: ' + e.response.data.error)

        return Promise.reject(e)
      }

      console.error(chalk.red('X') + ' An error ocurred when login the user')
      return Promise.reject(e)
    }
  },

  async loginWithToken (content) {
    const { token, region } = content
    try {
      const { data } = await axios.get(`${this.apiSwitcher(region)}users/me`, {
        headers: {
          Authorization: token
        }
      })

      this.persistCredentials(data.user.email, token, region)
      return data.user
    } catch (e) {
      return Promise.reject(e)
    }
  },

  logout (unauthorized) {
    if (creds.get().email && unauthorized) {
      console.log(chalk.red('X') + ' Your login seems to be expired, we logged you out. Please log back in again.')
    }
    creds.set(null)
  },

  signup (email, password, region = EU_CODE) {
    return axios.post(`${this.apiSwitcher(region)}users/signup`, {
      email: email,
      password: password,
      region
    })
      .then(response => {
        const token = this.extractToken(response)
        this.oauthToken = token
        creds.set(email, token, region)

        return Promise.resolve(true)
      })
      .catch(err => Promise.reject(err))
  },

  isAuthorized () {
    const { token } = creds.get() || {}
    if (token) {
      this.oauthToken = token
      return true
    }

    return false
  },

  setSpaceId (spaceId) {
    this.spaceId = spaceId
  },

  setRegion (region) {
    this.region = region
  },

  getPresets () {
    const client = this.getClient()

    return client
      .get(this.getPath('presets'))
      .then(data => data.data.presets || [])
      .catch(err => Promise.reject(err))
  },

  getSpaceOptions () {
    const client = this.getClient()

    return client
      .get(this.getPath(''))
      .then((data) => data.data.space.options || {})
      .catch((err) => Promise.reject(err))
  },

  getComponents () {
    const client = this.getClient()

    return client
      .get(this.getPath('components'))
      .then(data => data.data.components || [])
      .catch(err => Promise.reject(err))
  },

  getComponentGroups () {
    const client = this.getClient()

    return client
      .get(this.getPath('component_groups'))
      .then(data => data.data.component_groups || [])
      .catch(err => Promise.reject(err))
  },

  getDatasources () {
    const client = this.getClient()

    return client
      .get(this.getPath('datasources'))
      .then(data => data.data.datasources || [])
      .catch(err => Promise.reject(err))
  },

  getDatasourceEntries (id) {
    const client = this.getClient()

    return client
      .get(this.getPath(`datasource_entries?datasource_id=${id}&per_page=${PAGINATION.datasource_entries}`))
      .then(data => data.data.datasource_entries || [])
      .catch(err => Promise.reject(err))
  },

  deleteDatasource (id) {
    const client = this.getClient()

    return client
      .delete(this.getPath(`datasources/${id}`))
      .catch(err => Promise.reject(err))
  },

  post (path, props) {
    return this.sendRequest(path, 'post', props)
  },

  put (path, props) {
    return this.sendRequest(path, 'put', props)
  },

  get (path, options = {}) {
    return this.sendRequest(path, 'get', options)
  },

  getStories (params = {}) {
    const client = this.getClient()
    const _path = this.getPath('stories')

    return client.getAll(_path, params)
  },

  getSingleStory (id, options = {}) {
    const client = this.getClient()
    const _path = this.getPath(`stories/${id}`)

    return client.get(_path, options)
      .then(response => response.data.story || {})
  },

  delete (path) {
    return this.sendRequest(path, 'delete')
  },

  sendRequest (path, method, props = {}) {
    const client = this.getClient()
    const _path = this.getPath(path)

    return client[method](_path, props)
  },

  async getAllSpacesByRegion (region) {
    const customClient = new Storyblok({
      accessToken: this.accessToken,
      oauthToken: this.oauthToken,
      region,
      headers: {
        ...DEFAULT_AGENT
      }
    }, this.apiSwitcher(region))
    return await customClient
      .get('spaces/', {})
      .then(res => res.data.spaces || [])
      .catch(err => Promise.reject(err))
  },

  apiSwitcher (region) {
    return region ? getRegionApiEndpoint(region) : getRegionApiEndpoint(this.region)
  }
}
