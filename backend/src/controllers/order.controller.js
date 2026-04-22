import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

export const checkout = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId')

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty')
  }

  const orderItems = cart.items
    .filter((entry) => entry.productId)
    .map((entry) => ({
      productId: entry.productId._id,
      vendorId: entry.productId.vendor,
      name: entry.productId.name,
      imageUrl: entry.productId.imageUrl || '',
      unitPrice: entry.productId.price,
      quantity: entry.quantity,
    }))

  if (orderItems.length === 0) {
    throw new ApiError(400, 'No valid cart items available for checkout')
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const shippingDetails = req.body.shippingDetails || {}

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingDetails,
    paymentMethod: shippingDetails.paymentMethod || 'cash',
    totalAmount,
  })

  cart.items = []
  await cart.save()

  res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'))
})

export const getMyOrders = asyncHandler(async (req, res) => {
  let orders

  if (req.user.role === 'vendor') {
    orders = await Order.find({ 'items.vendorId': req.user._id }).sort({ createdAt: -1 })
  } else if (req.user.role === 'admin') {
    orders = await Order.find().sort({ createdAt: -1 })
  } else {
    orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  }

  res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'))
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (!['received', 'ready_for_shipping', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
    throw new ApiError(400, 'Invalid order status')
  }

  const order = await Order.findById(req.params.id)

  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  if (
    req.user.role === 'vendor' &&
    !order.items.some((item) => String(item.vendorId) === String(req.user._id))
  ) {
    throw new ApiError(403, 'Vendor cannot modify this order')
  }

  order.status = status
  await order.save()

  res.status(200).json(new ApiResponse(200, order, 'Order status updated'))
})
