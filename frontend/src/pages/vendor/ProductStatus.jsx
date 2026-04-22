import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function ProductStatus() {
	const [items, setItems] = useState([])
	const [error, setError] = useState('')

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const { data } = await apiClient.get('/vendor/requests')
				setItems(data.data)
			} catch {
				setError('Unable to fetch product status list.')
			}
		}

		fetchStatus()
	}, [])

	return (
		<PageShell
			title="Product Status"
			links={[
				{ to: '/vendor/products', label: 'View Product' },
				{ to: '/vendor/request-item', label: 'Request Item' },
			]}
		>
			<section className="space-y-4">
				{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

				<div className="overflow-x-auto rounded-md border border-slate-300 bg-white">
					<table className="min-w-full">
						<thead className="bg-blue-600 text-white">
							<tr>
								<th className="px-4 py-3 text-left">Name</th>
								<th className="px-4 py-3 text-left">Details</th>
								<th className="px-4 py-3 text-left">Status</th>
								<th className="px-4 py-3 text-left">Updated</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<tr key={item._id} className="border-t border-slate-200">
									<td className="px-4 py-3 font-medium text-slate-800">{item.itemName}</td>
									<td className="px-4 py-3 text-sm text-slate-600">{item.details}</td>
									<td className="px-4 py-3">
										<span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
											{item.status}
										</span>
									</td>
									<td className="px-4 py-3 text-sm text-slate-600">
										{new Date(item.updatedAt).toLocaleDateString()}
									</td>
								</tr>
							))}

							{items.length === 0 && (
								<tr>
									<td className="px-4 py-6 text-center text-slate-500" colSpan={4}>
										No status updates available yet.
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

export default ProductStatus
