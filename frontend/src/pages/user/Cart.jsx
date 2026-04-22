import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function Cart() {
	const [cart, setCart] = useState({ items: [], grandTotal: 0 })
	const [error, setError] = useState('')

	const refreshCart = async () => {
		try {
			const { data } = await apiClient.get('/cart')
			setCart(data.data)
		} catch {
			setError('Unable to fetch cart details.')
		}
	}

	useEffect(() => {
		let ignore = false

		const loadInitialCart = async () => {
			try {
				const { data } = await apiClient.get('/cart')
				if (!ignore) {
					setCart(data.data)
				}
			} catch {
				if (!ignore) {
					setError('Unable to fetch cart details.')
				}
			}
		}

		loadInitialCart()

		return () => {
			ignore = true
		}
	}, [])

	const updateQuantity = async (productId, quantity) => {
		try {
			await apiClient.patch(`/cart/items/${productId}`, { quantity })
			refreshCart()
		} catch {
			setError('Unable to update quantity.')
		}
	}

	const removeItem = async (productId) => {
		try {
			await apiClient.delete(`/cart/items/${productId}`)
			refreshCart()
		} catch {
			setError('Unable to remove cart item.')
		}
	}

	const clearCart = async () => {
		try {
			await apiClient.delete('/cart')
			refreshCart()
		} catch {
			setError('Unable to clear cart.')
		}
	}

	return (
		<PageShell
			title="Shopping Cart"
			links={[
				{ to: '/user/vendors', label: 'View Product' },
				{ to: '/user/guest-list', label: 'Request Item' },
				{ to: '/user/order-status', label: 'Product Status' },
			]}
		>
			<section className="space-y-4">
				{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

				<div className="overflow-x-auto rounded-md border border-slate-300 bg-white">
					<table className="min-w-full">
						<thead className="bg-blue-600 text-white">
							<tr>
								<th className="px-4 py-3 text-left">Image</th>
								<th className="px-4 py-3 text-left">Name</th>
								<th className="px-4 py-3 text-left">Price</th>
								<th className="px-4 py-3 text-left">Quantity</th>
								<th className="px-4 py-3 text-left">Total</th>
								<th className="px-4 py-3 text-left">Action</th>
							</tr>
						</thead>
						<tbody>
							{cart.items.map((item) => (
								<tr key={item.productId?._id || item.productId} className="border-t border-slate-200">
									<td className="px-4 py-3">
										{item.productId?.imageUrl ? (
											<img
												src={item.productId.imageUrl}
												alt={item.productId.name}
												className="h-14 w-14 rounded-md object-cover"
											/>
										) : (
											<div className="h-14 w-14 rounded-md bg-slate-200" />
										)}
									</td>
									<td className="px-4 py-3">{item.productId?.name || 'Unknown Product'}</td>
									<td className="px-4 py-3">Rs {item.productId?.price || 0}</td>
									<td className="px-4 py-3">
										<select
											value={item.quantity}
											onChange={(event) => updateQuantity(item.productId?._id || item.productId, Number(event.target.value))}
											className="rounded-md border border-blue-300 bg-blue-100 px-2 py-1"
										>
											{Array.from({ length: 10 }, (_, index) => index + 1).map((qty) => (
												<option key={qty} value={qty}>
													{qty}
												</option>
											))}
										</select>
									</td>
									<td className="px-4 py-3">Rs {item.totalPrice}</td>
									<td className="px-4 py-3">
										<button
											type="button"
											onClick={() => removeItem(item.productId?._id || item.productId)}
											className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white"
										>
											Remove
										</button>
									</td>
								</tr>
							))}

							{cart.items.length === 0 && (
								<tr>
									<td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
										Cart is empty.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-blue-600 px-4 py-3 text-white">
					<p className="font-semibold">Grand Total: Rs {cart.grandTotal}</p>
					<button
						type="button"
						onClick={clearCart}
						className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
					>
						Delete All
					</button>
				</div>

				<Link
					to="/user/payment"
					className="inline-flex rounded-md border border-emerald-400 bg-white px-8 py-3 text-sm font-semibold text-slate-800"
				>
					Proceed to Checkout
				</Link>
			</section>
		</PageShell>
	)
}

export default Cart
