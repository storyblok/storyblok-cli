import chalk from 'chalk'

export function formatHeader(title: string) {
  return `${title}
  
  `
}
export const konsola = {
  title: (message: string, color: string) => {
    console.log(formatHeader(chalk.bgHex(color).bold.white(` ${message} `)))
  },
  br: () => {
    console.log('') // Add a line break
  },
  ok: (message?: string, header: boolean = false) => {
    if (header) {
      console.log('') // Add a line break
      const successHeader = chalk.bgGreen.bold.white(` Success `)
      console.log(formatHeader(successHeader))
    }

    console.log(message ? `${chalk.green('✔')} ${message}` : '')
  },
  warn: (message?: string, header: boolean = false) => {
    if (header) {
      console.log('') // Add a line break
      const warnHeader = chalk.bgYellow.bold.black(` Warning `)
      console.warn(formatHeader(warnHeader))
    }

    console.warn(message ? `${chalk.yellow('⚠️')} ${message}` : '')
  },
  error: (err: Error, header: boolean = false) => {
    if (header) {
      console.log('') // Add a line break
      const errorHeader = chalk.bgRed.bold.white(` Error `)
      console.error(formatHeader(errorHeader))
      console.error('a111') // Add a line break
    }

    console.error(`${chalk.red('x')} ${err.message || err}`)
    console.log('') // Add a line break
  },
}
