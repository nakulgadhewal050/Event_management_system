import Order from '../models/Order.js';
import Membership from '../models/Membership.js';
import Product from '../models/Product.js';
import RequestItem from '../models/RequestItem.js';
import User from '../models/User.js';

import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ==================== Dashboard ====================
export const getVendorDashboard = asyncHandler(async (req, res) => {
  const [
    products,
    requests,
    pendingOrders,
    vendorWithMembership,
    availableMemberships,
  ] = await Promise.all([
    Product.countDocuments({ vendor: req.user._id }),

    RequestItem.countDocuments({ vendor: req.user._id }),

    Order.countDocuments({
      'items.vendorId': req.user._id,
      status: {
        $in: ['received', 'ready_for_shipping', 'out_for_delivery'],
      },
    }),

    User.findById(req.user._id).populate('membership'),

    Membership.find({ status: 'active', isActive: true }).sort({ price: 1 }),
  ]);

  const currentMembership = vendorWithMembership?.membership || null;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          products,
          requests,
          pendingOrders,
          currentMembership,
          availableMemberships,
        },
        'Vendor dashboard loaded'
      )
    );
});

function addMonths(dateValue, monthsToAdd) {
  const nextDate = new Date(dateValue);
  nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
  return nextDate;
}

export const selectMembership = asyncHandler(async (req, res) => {
  const { membershipNumber } = req.body;

  if (!membershipNumber) {
    throw new ApiError(400, 'Membership number is required');
  }

  const membership = await Membership.findOne({
    membershipNumber: membershipNumber.toUpperCase(),
    status: 'active',
    isActive: true,
  });

  if (!membership) {
    throw new ApiError(404, 'Membership not found or inactive');
  }

  const vendor = await User.findById(req.user._id);

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  vendor.membership = membership._id;
  await vendor.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, membership, 'Membership selected successfully')
    );
});

export const extendMembership = asyncHandler(async (req, res) => {
  const { extensionMonths = 6 } = req.body;

  const allowedDurations = [6, 12, 24];
  const extensionValue = Number(extensionMonths);

  if (!allowedDurations.includes(extensionValue)) {
    throw new ApiError(
      400,
      'Extension must be 6 months, 1 year, or 2 years'
    );
  }

  const vendor = await User.findById(req.user._id).populate('membership');

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  if (!vendor.membership) {
    throw new ApiError(400, 'No active membership to extend');
  }

  const membership = vendor.membership;

  const referenceDate =
    membership.endDate && membership.endDate > new Date()
      ? membership.endDate
      : new Date();

  membership.endDate = addMonths(referenceDate, extensionValue);
  membership.durationMonths = extensionValue;
  membership.status = 'active';
  membership.isActive = true;

  await membership.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, membership, 'Membership extended successfully')
    );
});

// ==================== Profile ====================
export const updateVendorProfile = asyncHandler(async (req, res) => {
  const { profileImage, phone, category } = req.body;

  const vendor = await User.findById(req.user._id);

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  if (profileImage) vendor.profileImage = profileImage;
  if (phone) vendor.phone = phone;
  if (category) vendor.category = category;

  await vendor.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, vendor, 'Vendor profile updated successfully')
    );
});

// ==================== Request Item ====================
export const createRequestItem = asyncHandler(async (req, res) => {
  const { itemName, details } = req.body;

  if (!itemName || !details) {
    throw new ApiError(400, 'itemName and details are required');
  }

  const request = await RequestItem.create({
    vendor: req.user._id,
    itemName,
    details,
  });

  res
    .status(201)
    .json(new ApiResponse(201, request, 'Request item created'));
});

// ==================== Vendor Requests ====================
export const getVendorRequests = asyncHandler(async (req, res) => {
  const requests = await RequestItem.find({
    vendor: req.user._id,
  }).sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, requests, 'Vendor requests fetched'));
});