import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId })

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] })
  }

  return cart
}

function getCartSummary(cartDocument) {
  const items = cartDocument.items.map((item) => {
    const price = item.productId?.price || 0
    const totalPrice = price * item.quantity

    return {
      productId: item.productId,
      quantity: item.quantity,
      totalPrice,
    }
  })

  const grandTotal = items.reduce((sum, item) => sum + item.totalPrice, 0)

  return { items, grandTotal }
}

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id)
  await cart.populate('items.productId')

  res.status(200).json(new ApiResponse(200, getCartSummary(cart), 'Cart fetched'))
})

export const addCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body

  if (!productId) {
    throw new ApiError(400, 'productId is required')
  }

  const product = await Product.findOne({ _id: productId, isActive: true })

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const cart = await getOrCreateCart(req.user._id)
  const itemIndex = cart.items.findIndex((item) => String(item.productId) === String(productId))

  if (itemIndex >= 0) {
    cart.items[itemIndex].quantity += Number(quantity)
  } else {
    cart.items.push({ productId, quantity: Number(quantity) })
  }

  await cart.save()
  await cart.populate('items.productId')

  res.status(200).json(new ApiResponse(200, getCartSummary(cart), 'Item added to cart'))
})

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body

  if (!quantity || quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1')
  }

  const cart = await getOrCreateCart(req.user._id)
  const item = cart.items.find((entry) => String(entry.productId) === String(req.params.productId))

  if (!item) {
    throw new ApiError(404, 'Item not found in cart')
  }

  item.quantity = Number(quantity)
  await cart.save()
  await cart.populate('items.productId')

  res.status(200).json(new ApiResponse(200, getCartSummary(cart), 'Cart item updated'))
})

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id)
  cart.items = cart.items.filter((entry) => String(entry.productId) !== String(req.params.productId))
  await cart.save()
  await cart.populate('items.productId')

  res.status(200).json(new ApiResponse(200, getCartSummary(cart), 'Cart item removed'))
})

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id)
  cart.items = []
  await cart.save()

  res.status(200).json(new ApiResponse(200, { items: [], grandTotal: 0 }, 'Cart cleared'))
})
