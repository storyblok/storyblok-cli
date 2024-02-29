const { USERS_ROUTES, EMAIL_TEST, PASSWORD_TEST, TOKEN_TEST } = require('../tests/constants')

const isCredCorrects = (email, pass) => {
  return email === EMAIL_TEST && pass === PASSWORD_TEST
}

const axios = {
  post: jest.fn((path, data) => {
    const { email, password } = data || {}

    if (path === USERS_ROUTES.LOGIN && isCredCorrects(email, password)) {
      return Promise.resolve({
        data: {
          access_token: TOKEN_TEST
        }
      })
    }

    if (path === USERS_ROUTES.SIGNUP && isCredCorrects(email, password)) {
      return Promise.resolve({
        data: {
          access_token: TOKEN_TEST
        }
      })
    }

    return Promise.reject(new Error('Incorrect access'))
  })
}

module.exports = axios
