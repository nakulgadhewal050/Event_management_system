import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function VendorList() {
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || ''

  const [vendors, setVendors] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  // ==================== Fetch Vendors ====================
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setError('')

        const query = selectedCategory
          ? `?category=${encodeURIComponent(selectedCategory)}`
          : ''

        const { data } = await apiClient.get(`/user/vendors${query}`)
        setVendors(data.data)
      } catch {
        setError('Unable to fetch vendor list at the moment.')
      }
    }

    fetchVendors()
  }, [selectedCategory])

  // ==================== Add to Cart ====================
  const addToCart = async (productId) => {
    try {
      setSuccess('')

      await apiClient.post('/cart/items', {
        productId,
        quantity: 1,
      })

      setSuccess('Product added to cart successfully.')
    } catch {
      setError('Unable to add product to cart.')
    }
  }

  // ==================== Modal Handlers ====================
  const openProductModal = (product) => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  return (
    <PageShell
      title="Vendor Directory"
      links={[
        { to: '/user/cart', label: 'Cart' },
        { to: '/user/guest-list', label: 'Guest List' },
      ]}
    >
      <section className="space-y-4">

        {/* Filter */}
        <p className="text-sm text-slate-600">
          Filter:{' '}
          <span className="font-semibold">
            {selectedCategory || 'All Categories'}
          </span>
        </p>

        {/* Messages */}
        {error && (
          <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        )}

        {/* Vendor Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {vendors.map((vendor) => (
            <article
              key={vendor._id}
              className="rounded-md border border-slate-300 bg-blue-600 p-4 text-white"
            >
              {/* Vendor Image */}
              {vendor.profileImage ? (
                <img
                  src={vendor.profileImage}
                  alt={vendor.name}
                  className="mb-3 h-32 w-full rounded-md object-cover"
                />
              ) : (
                <div className="mb-3 flex h-32 w-full items-center justify-center rounded-md bg-blue-500">
                  <span className="text-4xl font-bold text-blue-200">
                    {vendor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <h2 className="text-lg font-semibold">
                {vendor.name}
              </h2>

              <p className="text-sm text-blue-100">
                {vendor.category}
              </p>

              <p className="mt-2 text-xs text-blue-100">
                {vendor.email}
              </p>

              {/* Products */}
              <div className="mt-3 space-y-2">
                {vendor.products?.slice(0, 4).map((product) => (
                  <div
                    key={product._id}
                    onClick={() => openProductModal(product)}
                    className="cursor-pointer rounded-md bg-blue-500 p-2 text-sm transition-all hover:bg-blue-600"
                  >
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="mb-2 h-24 w-full rounded-md object-cover"
                      />
                    )}

                    <div className="font-medium">
                      {product.name}
                    </div>

                    <div className="text-xs text-blue-100">
                      Rs {product.price}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product._id)
                      }}
                      className="mt-2 rounded-md border border-emerald-300 bg-white px-3 py-1 text-xs font-semibold text-slate-800"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}

                {!vendor.products?.length && (
                  <p className="text-xs text-blue-100">
                    No products available yet.
                  </p>
                )}
              </div>
            </article>
          ))}

          {/* Empty State */}
          {vendors.length === 0 && (
            <p className="rounded-md border border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
              No vendors found for this category.
            </p>
          )}
        </div>
      </section>

      {/* ==================== Product Modal ==================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="relative max-h-96 w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg">

            {/* Close Button */}
            <button
              type="button"
              onClick={closeProductModal}
              className="absolute right-4 top-4 text-2xl font-bold text-slate-600 hover:text-slate-900"
            >
              ✕
            </button>

            {/* Image */}
            {selectedProduct.imageUrl && (
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="mb-4 h-64 w-full rounded-lg object-cover"
              />
            )}

            {/* Details */}
            <h2 className="text-2xl font-bold text-slate-800">
              {selectedProduct.name}
            </h2>

            <p className="mt-2 text-lg font-semibold text-green-600">
              Rs {selectedProduct.price}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Stock: {selectedProduct.stock}
            </p>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  addToCart(selectedProduct._id)
                  closeProductModal()
                }}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={closeProductModal}
                className="flex-1 rounded-md bg-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-400"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </PageShell>
  )
}

export default VendorList