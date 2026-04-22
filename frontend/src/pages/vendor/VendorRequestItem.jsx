import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

const statusClassMap = {
	pending: 'bg-amber-100 text-amber-700',
	approved: 'bg-emerald-100 text-emerald-700',
	rejected: 'bg-red-100 text-red-700',
}

function RequestItem() {
	const [itemName, setItemName] = useState('')
	const [details, setDetails] = useState('')
	const [items, setItems] = useState([])
	const [error, setError] = useState('')

	const fetchItems = async () => {
		try {
			const { data } = await apiClient.get('/vendor/requests')
			setItems(data.data)
		} catch {
			setError('Unable to fetch requested items.')
		}
	}

	useEffect(() => {
		fetchItems()
	}, [])

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')

		try {
			await apiClient.post('/vendor/requests', { itemName, details })
			setItemName('')
			setDetails('')
			fetchItems()
		} catch {
			setError('Unable to submit request item.')
		}
	}

	return (
		<PageShell
			title="Request Item"
			links={[
				{ to: '/vendor/products', label: 'Your Item' },
				{ to: '/vendor/product-status', label: 'Product Status' },
			]}
		>
			<section className="grid gap-5 lg:grid-cols-[360px_1fr]">
				<form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-slate-300 bg-white p-4">
					<h2 className="text-lg font-semibold text-slate-800">Raise New Request</h2>

					<input
						value={itemName}
						onChange={(event) => setItemName(event.target.value)}
						className="w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="Item Name"
						required
					/>

					<textarea
						value={details}
						onChange={(event) => setDetails(event.target.value)}
						className="min-h-28 w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="Describe your item request"
						required
					/>

					<button type="submit" className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white">
						Submit Request
					</button>
				</form>

				<div className="space-y-3">
					{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

					{items.map((item) => (
						<article key={item._id} className="rounded-md border border-slate-300 bg-white p-4">
							<div className="flex items-start justify-between gap-3">
								<div>
									<h3 className="text-lg font-semibold text-slate-800">{item.itemName}</h3>
									<p className="text-sm text-slate-600">{item.details}</p>
								</div>
								<span
									className={`rounded-full px-3 py-1 text-xs font-semibold ${
										statusClassMap[item.status] || 'bg-slate-100 text-slate-700'
									}`}
								>
									{item.status}
								</span>
							</div>
						</article>
					))}

					{items.length === 0 && (
						<p className="rounded-md border border-slate-300 bg-white px-3 py-4 text-sm text-slate-500">
							No requests raised yet.
						</p>
					)}
				</div>
			</section>
		</PageShell>
	)
}

export default RequestItem
