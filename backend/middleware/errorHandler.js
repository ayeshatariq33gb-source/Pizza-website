module.exports = (error, request, response, next) => {
  let statusCode = error.statusCode || 500
  let message = error.message || 'Something went wrong.'

  if (error.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(error.errors).map((item) => item.message).join(', ')
  } else if (error.code === 11000) {
    statusCode = 409
    message = 'That record already exists.'
  } else if (error.name === 'CastError') {
    statusCode = 400
    message = 'Invalid record id.'
  } else if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    statusCode = 400
    message = 'Request body contains invalid JSON.'
  }

  if (process.env.NODE_ENV !== 'production') console.error(error)
  response.status(statusCode).json({ message })
}