import ApiError from '../utils/ApiError.js'

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`))
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal server error'

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  })
}
