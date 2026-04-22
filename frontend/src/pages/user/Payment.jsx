import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

const defaultForm = {
	name: '',
	email: '',
	phone: '',
	address: '',
	city: '',
	state: '',
	pinCode: '',
	paymentMethod: 'cash',
}

function Payment() {
	const [form, setForm] = useState(defaultForm)
	const [grandTotal, setGrandTotal] = useState(0)
	const [error, setError] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const { data } = await apiClient.get('/cart')
				setGrandTotal(data.data.grandTotal)
			} catch {
				setError('Unable to fetch cart amount.')
			}
		}

		fetchCart()
	}, [])

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')

		try {
			await apiClient.post('/orders/checkout', {
				shippingDetails: form,
			})
			navigate('/user/order-status')
		} catch (requestError) {
			setError(requestError?.response?.data?.message || 'Unable to place order right now.')
		}
	}

	return (
		<PageShell title="Payment Details" links={[{ to: '/user/cart', label: 'Back To Cart' }]}>
			<section className="mx-auto w-full max-w-4xl rounded-md border border-slate-300 bg-white p-5">
				<div className="rounded-md bg-blue-600 px-4 py-3 text-center text-lg font-semibold text-white">
					Grand Total: Rs {grandTotal}
				</div>

				<form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
					<input
						value={form.name}
						onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="Name"
						required
					/>

					<input
						value={form.phone}
						onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="Phone Number"
						required
					/>

					<input
						type="email"
						value={form.email}
						onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="E-mail"
						required
					/>

					<select
						value={form.paymentMethod}
						onChange={(event) => setForm((prev) => ({ ...prev, paymentMethod: event.target.value }))}
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
					>
						<option value="cash">Cash</option>
						<option value="upi">UPI</option>
					</select>

					<input
						value={form.address}
						onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="Address"
						required
					/>

					<input
						value={form.state}
						onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="State"
						required
					/>

					<input
						value={form.city}
						onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="City"
						required
					/>

					<input
						value={form.pinCode}
						onChange={(event) => setForm((prev) => ({ ...prev, pinCode: event.target.value }))}
						className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="Pin Code"
						required
					/>

					{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 md:col-span-2">{error}</p>}

					<button type="submit" className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white md:col-span-2">
						Order Now
					</button>
				</form>
			</section>
		</PageShell>
	)
}

export default Payment
