const FS_ERRORS = {
  file_not_found: 'The file requested was not found',
  permission_denied: 'Permission denied while accessing the file',
}

export class FileSystemError extends Error {
  errorId: string
  cause: string

  constructor(message: string, errorId: keyof typeof FS_ERRORS) {
    super(message)
    this.name = 'File System Error'
    this.errorId = errorId
    this.cause = FS_ERRORS[errorId]
  }

  getInfo() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      errorId: this.errorId,
      stack: this.stack,
    }
  }
}
