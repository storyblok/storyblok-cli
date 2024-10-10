import chalk from 'chalk'

export function formatHeader(title: string) {
  return `${title}
  
  `
}
export const konsola = {

  ok: (message?: string, header: boolean = false) => {
    if (header) {
      console.log('') // Add a line break
      const successHeader = chalk.bgGreen.bold.white(` Success `)
      console.log(formatHeader(successHeader))
    }

    console.log(message ? `${chalk.green('✔')} ${message}` : '')
  },
  error: (err: Error, header: boolean = false) => {
    if (header) {
      console.log('') // Add a line break
      const errorHeader = chalk.bgRed.bold.white(` Error `)
      console.error(formatHeader(errorHeader))
    }

    console.error(`${chalk.red('x')} ${err.message || err}`)
    console.log('') // Add a line break
  },
}
