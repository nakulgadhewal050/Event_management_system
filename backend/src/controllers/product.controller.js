import Product from '../models/Product.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, imageUrl, category, stock } = req.body

  if (!name || price === undefined) {
    throw new ApiError(400, 'Product name and price are required')
  }

  const product = await Product.create({
    vendor: req.user._id,
    name,
    price,
    imageUrl,
    category,
    stock,
  })

  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'))
})

export const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendor: req.user._id }).sort({ createdAt: -1 })
  res.status(200).json(new ApiResponse(200, products, 'Vendor products fetched'))
})

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, vendor: req.user._id })

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const fields = ['name', 'price', 'imageUrl', 'category', 'stock', 'isActive']
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field]
    }
  })

  await product.save()

  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'))
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user._id })

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'))
})

export const getPublicProducts = asyncHandler(async (req, res) => {
  const filter = { isActive: true }

  if (req.query.vendor) {
    filter.vendor = req.query.vendor
  }

  if (req.query.category) {
    filter.category = req.query.category
  }

  const products = await Product.find(filter)
    .populate('vendor', 'name category email')
    .sort({ createdAt: -1 })

  res.status(200).json(new ApiResponse(200, products, 'Products fetched'))
})
