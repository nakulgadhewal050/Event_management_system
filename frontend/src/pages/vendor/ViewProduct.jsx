import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

const defaultForm = {
	name: '',
	price: '',
	imageUrl: '',
	category: '',
	stock: 1,
}

function ViewProduct() {
	const [items, setItems] = useState([])
	const [editingId, setEditingId] = useState(null)
	const [form, setForm] = useState(defaultForm)
	const [error, setError] = useState('')

	const refreshProducts = async () => {
		try {
			const { data } = await apiClient.get('/products/vendor/me')
			setItems(data.data)
		} catch {
			setError('Unable to fetch products.')
		}
	}

	useEffect(() => {
		let ignore = false

		const loadInitialProducts = async () => {
			try {
				const { data } = await apiClient.get('/products/vendor/me')
				if (!ignore) {
					setItems(data.data)
				}
			} catch {
				if (!ignore) {
					setError('Unable to fetch products.')
				}
			}
		}

		loadInitialProducts()

		return () => {
			ignore = true
		}
	}, [])

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')

		try {
			const payload = {
				name: form.name,
				price: Number(form.price),
				imageUrl: form.imageUrl,
				category: form.category,
				stock: Number(form.stock),
			}

			if (editingId) {
				await apiClient.patch(`/products/${editingId}`, payload)
			} else {
				await apiClient.post('/products', payload)
			}

			setForm(defaultForm)
			setEditingId(null)
			refreshProducts()
		} catch {
			setError('Unable to save product details.')
		}
	}

	const handleEdit = (item) => {
		setEditingId(item._id)
		setForm({
			name: item.name,
			price: item.price,
			imageUrl: item.imageUrl || '',
			category: item.category || '',
			stock: item.stock || 1,
		})
	}

	const handleDelete = async (productId) => {
		try {
			await apiClient.delete(`/products/${productId}`)
			refreshProducts()
		} catch {
			setError('Unable to delete product right now.')
		}
	}

	return (
		<PageShell
			title="Vendor Products"
			links={[
				{ to: '/vendor/request-item', label: 'Request Item' },
				{ to: '/vendor/product-status', label: 'Product Status' },
			]}
		>
			<section className="grid gap-5 lg:grid-cols-[420px_1fr]">
				<form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-slate-300 bg-blue-600 p-5 text-white">
					<h2 className="text-xl font-semibold">{editingId ? 'Update Product' : 'Add New Product'}</h2>

					<input
						value={form.name}
						onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
						className="w-full rounded-md bg-white px-3 py-2 text-slate-800"
						placeholder="Product Name"
						required
					/>

					<input
						type="number"
						min="0"
						value={form.price}
						onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
						className="w-full rounded-md bg-white px-3 py-2 text-slate-800"
						placeholder="Price"
						required
					/>

					<input
						value={form.imageUrl}
						onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
						className="w-full rounded-md bg-white px-3 py-2 text-slate-800"
						placeholder="Image URL"
					/>

					<input
						value={form.category}
						onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
						className="w-full rounded-md bg-white px-3 py-2 text-slate-800"
						placeholder="Category"
					/>

					<input
						type="number"
						min="1"
						value={form.stock}
						onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
						className="w-full rounded-md bg-white px-3 py-2 text-slate-800"
						placeholder="Stock"
						required
					/>

					<div className="flex gap-2">
						<button type="submit" className="rounded-md bg-white px-4 py-2 font-semibold text-slate-800">
							{editingId ? 'Update Product' : 'Add Product'}
						</button>
						{editingId && (
							<button
								type="button"
								onClick={() => {
									setEditingId(null)
									setForm(defaultForm)
								}}
								className="rounded-md border border-white px-4 py-2 font-semibold text-white"
							>
								Cancel
							</button>
						)}
					</div>
				</form>

				<div className="overflow-x-auto rounded-md border border-slate-300 bg-white">
					{error && <p className="m-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

					<table className="min-w-full">
						<thead className="bg-blue-600 text-white">
							<tr>
								<th className="px-4 py-3 text-left">Product</th>
								<th className="px-4 py-3 text-left">Price</th>
								<th className="px-4 py-3 text-left">Category</th>
								<th className="px-4 py-3 text-left">Stock</th>
								<th className="px-4 py-3 text-left">Action</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<tr key={item._id} className="border-t border-slate-200">
									<td className="px-4 py-3">
										<div className="font-semibold text-slate-800">{item.name}</div>
										<div className="text-xs text-slate-500">{item.imageUrl || 'No image'}</div>
									</td>
									<td className="px-4 py-3">Rs {item.price}</td>
									<td className="px-4 py-3">{item.category}</td>
									<td className="px-4 py-3">{item.stock}</td>
									<td className="px-4 py-3">
										<div className="flex gap-2">
											<button
												type="button"
												onClick={() => handleEdit(item)}
												className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white"
											>
												Update
											</button>
											<button
												type="button"
												onClick={() => handleDelete(item._id)}
												className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}

							{items.length === 0 && (
								<tr>
									<td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
										No products found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>
		</PageShell>
	)
}

export default ViewProduct
