import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

const defaultGuest = {
	name: '',
	email: '',
	phone: '',
}

function GuestList() {
	const [guest, setGuest] = useState(defaultGuest)
	const [guests, setGuests] = useState([])
	const [error, setError] = useState('')

	const refreshGuests = async () => {
		try {
			const { data } = await apiClient.get('/user/guests')
			setGuests(data.data)
		} catch {
			setError('Unable to fetch guest list.')
		}
	}

	useEffect(() => {
		let ignore = false

		const loadInitialGuests = async () => {
			try {
				const { data } = await apiClient.get('/user/guests')
				if (!ignore) {
					setGuests(data.data)
				}
			} catch {
				if (!ignore) {
					setError('Unable to fetch guest list.')
				}
			}
		}

		loadInitialGuests()

		return () => {
			ignore = true
		}
	}, [])

	const handleSubmit = async (event) => {
		event.preventDefault()

		try {
			await apiClient.post('/user/guests', guest)
			setGuest(defaultGuest)
			refreshGuests()
		} catch {
			setError('Unable to add guest right now.')
		}
	}

	const handleDelete = async (guestId) => {
		try {
			await apiClient.delete(`/user/guests/${guestId}`)
			refreshGuests()
		} catch {
			setError('Unable to delete guest.')
		}
	}

	return (
		<PageShell
			title="Guest List"
			links={[
				{ to: '/user/vendors', label: 'Vendor' },
				{ to: '/user/cart', label: 'Cart' },
				{ to: '/user/order-status', label: 'Order Status' },
			]}
		>
			<section className="grid gap-5 lg:grid-cols-[360px_1fr]">
				<form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-slate-300 bg-white p-4">
					<h2 className="text-lg font-semibold text-slate-800">Add Guest</h2>

					<input
						value={guest.name}
						onChange={(event) => setGuest((prev) => ({ ...prev, name: event.target.value }))}
						className="w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="Name"
						required
					/>

					<input
						type="email"
						value={guest.email}
						onChange={(event) => setGuest((prev) => ({ ...prev, email: event.target.value }))}
						className="w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="Email"
					/>

					<input
						value={guest.phone}
						onChange={(event) => setGuest((prev) => ({ ...prev, phone: event.target.value }))}
						className="w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						placeholder="Phone"
					/>

					<button type="submit" className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white">
						Add Guest
					</button>
				</form>

				<div className="space-y-3">
					{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

					{guests.map((item) => (
						<article key={item._id} className="rounded-md border border-slate-300 bg-white p-4">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div>
									<h3 className="font-semibold text-slate-800">{item.name}</h3>
									<p className="text-sm text-slate-600">{item.email || 'No email provided'}</p>
									<p className="text-sm text-slate-600">{item.phone || 'No phone provided'}</p>
								</div>

								<button
									type="button"
									onClick={() => handleDelete(item._id)}
									className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
								>
									Delete
								</button>
							</div>
						</article>
					))}

					{guests.length === 0 && (
						<p className="rounded-md border border-slate-300 bg-white px-3 py-4 text-sm text-slate-500">
							No guests added yet.
						</p>
					)}
				</div>
			</section>
		</PageShell>
	)
}

export default GuestList
