import Membership from '../models/Membership.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

const ALLOWED_DURATION_MONTHS = [6, 12, 24]

function addMonths(dateValue, monthsToAdd) {
  const nextDate = new Date(dateValue)
  nextDate.setMonth(nextDate.getMonth() + monthsToAdd)
  return nextDate
}

export const listMemberships = asyncHandler(async (req, res) => {
  const memberships = await Membership.find().sort({ createdAt: -1 })
  res.status(200).json(new ApiResponse(200, memberships, 'Memberships fetched'))
})

export const createMembership = asyncHandler(async (req, res) => {
  const { membershipNumber, price, durationMonths, features = [] } = req.body

  if (!membershipNumber || price === undefined || !durationMonths || features.length === 0) {
    throw new ApiError(400, 'All fields are mandatory')
  }

  if (!ALLOWED_DURATION_MONTHS.includes(Number(durationMonths))) {
    throw new ApiError(400, 'Duration must be one of 6 months, 1 year, or 2 years')
  }

  const existingMembership = await Membership.findOne({
    membershipNumber: membershipNumber.toUpperCase(),
  })

  if (existingMembership) {
    throw new ApiError(409, 'Membership number already exists')
  }

  const startDate = new Date()
  const endDate = addMonths(startDate, Number(durationMonths))

  const membership = await Membership.create({
    membershipNumber,
    price,
    durationMonths: Number(durationMonths),
    startDate,
    endDate,
    status: 'active',
    features,
  })

  res.status(201).json(new ApiResponse(201, membership, 'Membership created'))
})

export const getMembershipByNumber = asyncHandler(async (req, res) => {
  const membershipNumber = req.params.membershipNumber?.toUpperCase()

  if (!membershipNumber) {
    throw new ApiError(400, 'Membership number is required')
  }

  const membership = await Membership.findOne({ membershipNumber })

  if (!membership) {
    throw new ApiError(404, 'Membership not found for this number')
  }

  res.status(200).json(new ApiResponse(200, membership, 'Membership fetched successfully'))
})

export const updateMembershipByNumber = asyncHandler(async (req, res) => {
  const membershipNumber = req.params.membershipNumber?.toUpperCase()
  const { action = 'extend', extensionMonths = 6 } = req.body

  if (!membershipNumber) {
    throw new ApiError(400, 'Membership number is required')
  }

  const membership = await Membership.findOne({ membershipNumber })

  if (!membership) {
    throw new ApiError(404, 'Membership not found for this number')
  }

  if (action === 'cancel') {
    membership.status = 'cancelled'
    membership.isActive = false
  } else {
    const extensionValue = Number(extensionMonths || 6)

    if (!ALLOWED_DURATION_MONTHS.includes(extensionValue)) {
      throw new ApiError(400, 'Extension must be one of 6 months, 1 year, or 2 years')
    }

    const referenceDate = membership.endDate && membership.endDate > new Date() ? membership.endDate : new Date()
    membership.endDate = addMonths(referenceDate, extensionValue)
    membership.durationMonths = extensionValue
    membership.status = 'active'
    membership.isActive = true
  }

  await membership.save()

  res.status(200).json(new ApiResponse(200, membership, 'Membership updated successfully'))
})

export const toggleMembershipStatus = asyncHandler(async (req, res) => {
  const membership = await Membership.findById(req.params.id)

  if (!membership) {
    throw new ApiError(404, 'Membership not found')
  }

  membership.isActive = !membership.isActive
  membership.status = membership.isActive ? 'active' : 'cancelled'
  await membership.save()

  res.status(200).json(new ApiResponse(200, membership, 'Membership status updated'))
})
