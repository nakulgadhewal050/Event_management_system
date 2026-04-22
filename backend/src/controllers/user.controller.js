import Cart from '../models/Cart.js';
import Guest from '../models/Guest.js';
import Membership from '../models/Membership.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ==================== Dashboard ====================
export const getUserDashboard = asyncHandler(async (req, res) => {
  const categories = await User.distinct('category', {
    role: 'vendor',
    isActive: true,
    category: { $nin: [null, ''] },
  });

  const [cart, activeOrders, userWithMembership, availableMemberships] =
    await Promise.all([
      Cart.findOne({ user: req.user._id }),

      Order.countDocuments({
        user: req.user._id,
        status: {
          $in: ['received', 'ready_for_shipping', 'out_for_delivery'],
        },
      }),

      User.findById(req.user._id).populate('membership'),

      Membership.find({ status: 'active', isActive: true }).sort({ price: 1 }),
    ]);

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const currentMembership = userWithMembership?.membership || null;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        categories,
        cartCount,
        activeOrders,
        currentMembership,
        availableMemberships,
      },
      'User dashboard loaded'
    )
  );
});

// ==================== Membership ====================
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

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.membership = membership._id;
  await user.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, membership, 'Membership selected successfully')
    );
});

// Helper function
function addMonths(dateValue, monthsToAdd) {
  const nextDate = new Date(dateValue);
  nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
  return nextDate;
}

export const extendMembership = asyncHandler(async (req, res) => {
  const { extensionMonths = 6 } = req.body;

  if (!extensionMonths) {
    throw new ApiError(400, 'Extension duration is required');
  }

  const allowedDurations = [6, 12, 24];
  const extensionValue = Number(extensionMonths);

  if (!allowedDurations.includes(extensionValue)) {
    throw new ApiError(
      400,
      'Extension must be 6 months, 1 year, or 2 years'
    );
  }

  const user = await User.findById(req.user._id).populate('membership');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user.membership) {
    throw new ApiError(400, 'No active membership to extend');
  }

  const membership = user.membership;

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

// ==================== Vendors ====================
export const getVendors = asyncHandler(async (req, res) => {
  const filter = { role: 'vendor', isActive: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const vendors = await User.find(filter).select(
    'name email category profileImage'
  );

  const vendorsWithProducts = await Promise.all(
    vendors.map(async (vendor) => {
      const products = await Product.find({
        vendor: vendor._id,
        isActive: true,
      }).select('name price imageUrl category stock');

      return {
        ...vendor.toObject(),
        products,
      };
    })
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, vendorsWithProducts, 'Vendors fetched successfully')
    );
});

// ==================== Guests ====================
export const getGuests = asyncHandler(async (req, res) => {
  const guests = await Guest.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, guests, 'Guest list fetched'));
});

export const addGuest = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) {
    throw new ApiError(400, 'Guest name is required');
  }

  const guest = await Guest.create({
    user: req.user._id,
    name,
    email,
    phone,
  });

  res
    .status(201)
    .json(new ApiResponse(201, guest, 'Guest added'));
});

export const deleteGuest = asyncHandler(async (req, res) => {
  const guest = await Guest.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!guest) {
    throw new ApiError(404, 'Guest not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Guest deleted'));
});