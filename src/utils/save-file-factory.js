import fs from 'fs'

const saveFileFactory = async (fileName, content, path = './') => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${path}${fileName}`, content, err => {
      if (err) {
        Promise.reject(err)
        return
      }

      Promise.resolve(true)
    })
  })
}

export default saveFileFactory
