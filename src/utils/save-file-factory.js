import fs from 'fs'

const saveFileFactory = (fileName, content, path = './') => {
  try {
    fs.writeFileSync(`${path}${fileName}`, content);
    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
}

export default saveFileFactory
