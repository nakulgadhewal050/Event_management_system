import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function OrderStatus() {
	const [orders, setOrders] = useState([])
	const [error, setError] = useState('')

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const { data } = await apiClient.get('/orders/my')
				setOrders(data.data)
			} catch {
				setError('Unable to fetch order statuses.')
			}
		}

		fetchOrders()
	}, [])

	return (
		<PageShell
			title="User Order Status"
			links={[
				{ to: '/user/vendors', label: 'Vendor' },
				{ to: '/user/cart', label: 'Cart' },
			]}
		>
			<section className="space-y-4">
				{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

				<div className="overflow-x-auto rounded-md border border-slate-300 bg-white">
					<table className="min-w-full">
						<thead className="bg-blue-600 text-white">
							<tr>
								<th className="px-4 py-3 text-left">Order Id</th>
								<th className="px-4 py-3 text-left">Item Count</th>
								<th className="px-4 py-3 text-left">Total</th>
								<th className="px-4 py-3 text-left">Status</th>
								<th className="px-4 py-3 text-left">Date</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order._id} className="border-t border-slate-200">
									<td className="px-4 py-3 text-sm font-medium text-slate-800">{order._id.slice(-8)}</td>
									<td className="px-4 py-3">{order.items.length}</td>
									<td className="px-4 py-3">Rs {order.totalAmount}</td>
									<td className="px-4 py-3">
										<span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
											{order.status.replaceAll('_', ' ')}
										</span>
									</td>
									<td className="px-4 py-3 text-sm text-slate-600">
										{new Date(order.createdAt).toLocaleDateString()}
									</td>
								</tr>
							))}

							{orders.length === 0 && (
								<tr>
									<td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
										No orders found.
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

export default OrderStatus
