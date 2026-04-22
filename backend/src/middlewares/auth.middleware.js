import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token) {
    throw new ApiError(401, 'Unauthorized: token missing')
  }

  const decoded = jwt.verify(token, env.jwtSecret)
  const user = await User.findById(decoded.userId).select('-password')

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Unauthorized: invalid account')
  }

  req.user = user
  next()
})
