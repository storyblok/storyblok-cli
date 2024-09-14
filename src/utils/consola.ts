import chalk from 'chalk'

export function formatHeader(title:string) {
  return `${title}
  
  `
}
export const consola = {
  
  ok: (message?: string, header: boolean = false) => {
    if(header) {
      const successHeader =  chalk.bgGreen.bold.white(` Success `)
      console.log(formatHeader(successHeader))
    }

    console.log(message ? `${chalk.green('✔')} ${message}` : '')
  },
  error: (err: Error, header: boolean = false) => {
    if(header) {
      const errorHeader =  chalk.bgRed.bold.white(` Error `)
      console.error(formatHeader(errorHeader))
    }

    console.error(chalk.red(err.message || err));
  }
}