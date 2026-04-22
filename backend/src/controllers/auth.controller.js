import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { generateToken } from '../utils/generateToken.js'

function sanitizeUser(userDocument) {
  return {
    _id: userDocument._id,
    name: userDocument.name,
    email: userDocument.email,
    role: userDocument.role,
    phone: userDocument.phone,
    category: userDocument.category,
    membership: userDocument.membership,
    isActive: userDocument.isActive,
  }
}

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required')
  }

  const exists = await User.findOne({ email: email.toLowerCase() })

  if (exists) {
    throw new ApiError(409, 'Email already registered')
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: 'user',
  })

  res.status(201).json(new ApiResponse(201, sanitizeUser(user), 'User registered successfully'))
})

export const registerVendor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, category } = req.body

  if (!name || !email || !password || !category) {
    throw new ApiError(400, 'Name, email, password, and category are required')
  }

  const exists = await User.findOne({ email: email.toLowerCase() })

  if (exists) {
    throw new ApiError(409, 'Email already registered')
  }

  const vendor = await User.create({
    name,
    email,
    password,
    phone,
    category,
    role: 'vendor',
  })

  res.status(201).json(new ApiResponse(201, sanitizeUser(vendor), 'Vendor registered successfully'))
})

export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const passwordMatch = await user.comparePassword(password)

  if (!passwordMatch) {
    throw new ApiError(401, 'Invalid email or password')
  }

  if (role && user.role !== role) {
    throw new ApiError(403, `Account is not registered as ${role}`)
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is inactive. Contact admin.')
  }

  const token = generateToken(user._id)

  res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: sanitizeUser(user),
      },
      'Login successful',
    ),
  )
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('membership')

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'))
})
