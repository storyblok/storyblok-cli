import { jest } from '@jest/globals'

export default jest.fn((blok) => {
  blok.subtitle = 'Hey There!'
})
