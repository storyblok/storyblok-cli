import { regions } from '../../constants'
import { addNetrcEntry, getNetrcCredentials } from '../../creds'

export const loginWithToken = async () => {
  try {
    await addNetrcEntry({
      machineName: 'api.storyblok.com',
      login: 'julio.iglesias@storyblok.com',
      password: 'my_access_token',
      region: regions.EU,
    })
    const file = await getNetrcCredentials()
    console.log(file)
  }
  catch (error) {
    console.error('Error reading or parsing .netrc file:', error)
  }
}

export const loginWithEmailAndPassword = () => {

}
