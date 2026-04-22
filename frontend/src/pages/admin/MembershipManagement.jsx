import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

const termOptions = [
	{ label: '6 months', value: 6 },
	{ label: '1 year', value: 12 },
	{ label: '2 years', value: 24 },
]

const initialAddForm = {
	membershipNumber: '',
	price: '',
	durationMonths: 6,
	features: '',
}

const initialUpdateForm = {
	membershipNumber: '',
	action: 'extend',
	extensionMonths: 6,
}

function formatTerm(months) {
	if (Number(months) === 12) return '1 year'
	if (Number(months) === 24) return '2 years'
	return '6 months'
}

function MembershipManagement() {
	const [addForm, setAddForm] = useState(initialAddForm)
	const [updateForm, setUpdateForm] = useState(initialUpdateForm)
	const [memberships, setMemberships] = useState([])
	const [loadedMembership, setLoadedMembership] = useState(null)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const refreshMemberships = async () => {
		try {
			const { data } = await apiClient.get('/memberships')
			setMemberships(data.data)
		} catch {
			setError('Unable to load memberships right now.')
		}
	}

	useEffect(() => {
		let ignore = false

		const loadInitialMemberships = async () => {
			try {
				const { data } = await apiClient.get('/memberships')
				if (!ignore) {
					setMemberships(data.data)
				}
			} catch {
				if (!ignore) {
					setError('Unable to load memberships right now.')
				}
			}
		}

		loadInitialMemberships()

		return () => {
			ignore = true
		}
	}, [])

	const handleCreate = async (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (!addForm.features.trim()) {
			setError('All fields are mandatory. Please add at least one feature.')
			return
		}

		try {
			await apiClient.post('/memberships', {
				membershipNumber: addForm.membershipNumber.trim().toUpperCase(),
				price: Number(addForm.price),
				durationMonths: Number(addForm.durationMonths),
				features: addForm.features
					.split(',')
					.map((value) => value.trim())
					.filter(Boolean),
			})
			setAddForm(initialAddForm)
			setSuccess('Membership added successfully.')
			refreshMemberships()
		} catch (requestError) {
			setError(requestError?.response?.data?.message || 'Unable to create membership with provided values.')
		}
	}

	const handleLoadMembership = async (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (!updateForm.membershipNumber.trim()) {
			setError('Membership Number is mandatory to load membership details.')
			return
		}

		try {
			const { data } = await apiClient.get(
				`/memberships/number/${encodeURIComponent(updateForm.membershipNumber.trim().toUpperCase())}`,
			)
			setLoadedMembership(data.data)
			setSuccess('Membership details loaded successfully.')
		} catch (requestError) {
			setLoadedMembership(null)
			setError(requestError?.response?.data?.message || 'Unable to load membership details.')
		}
	}

	const handleUpdateMembership = async (event) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (!updateForm.membershipNumber.trim()) {
			setError('Membership Number is mandatory.')
			return
		}

		try {
			await apiClient.patch(`/memberships/number/${encodeURIComponent(updateForm.membershipNumber.trim().toUpperCase())}`, {
				action: updateForm.action,
				extensionMonths: Number(updateForm.extensionMonths),
			})

			const { data } = await apiClient.get(
				`/memberships/number/${encodeURIComponent(updateForm.membershipNumber.trim().toUpperCase())}`,
			)
			setLoadedMembership(data.data)
			setSuccess(
				updateForm.action === 'cancel'
					? 'Membership cancelled successfully.'
					: 'Membership extended successfully.',
			)
			refreshMemberships()
		} catch (requestError) {
			setError(requestError?.response?.data?.message || 'Unable to update membership right now.')
		}
	}

	return (
		<PageShell title="Membership Management" links={[{ to: '/admin/users', label: 'Users' }]}>
			<section className="grid gap-5 xl:grid-cols-[370px_370px_1fr]">
				<form onSubmit={handleCreate} className="space-y-3 rounded-md border border-slate-300 bg-white p-4">
					<h2 className="text-lg font-semibold text-slate-800">Add Membership</h2>
					<p className="text-xs text-slate-500">All fields are mandatory.</p>

					<input
						type="text"
						value={addForm.membershipNumber}
						onChange={(event) =>
							setAddForm((prev) => ({ ...prev, membershipNumber: event.target.value.toUpperCase() }))
						}
						placeholder="Membership Number"
						className="w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						required
					/>


					<input
						type="number"
						min="0"
						value={addForm.price}
						onChange={(event) => setAddForm((prev) => ({ ...prev, price: event.target.value }))}
						placeholder="Membership Price"
						className="w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						required
					/>

					<label className="grid gap-1 text-sm font-medium text-slate-700">
						Duration
						<select
							value={addForm.durationMonths}
							onChange={(event) =>
								setAddForm((prev) => ({ ...prev, durationMonths: Number(event.target.value) }))
							}
							className="w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						>
							{termOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</label>

					<textarea
						value={addForm.features}
						onChange={(event) => setAddForm((prev) => ({ ...prev, features: event.target.value }))}
						placeholder="Enter membership features "
						className="min-h-24 w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
						required
					/>

					<button type="submit" className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white">
						Save Membership
					</button>
				</form>

				<div className="space-y-3 rounded-md border border-slate-300 bg-white p-4">
					<h2 className="text-lg font-semibold text-slate-800">Update Membership</h2>
					<p className="text-xs text-slate-500">
						Membership Number is mandatory. Default extension is 6 months.
					</p>

					<form onSubmit={handleLoadMembership} className="space-y-3">
						<input
							type="text"
							value={updateForm.membershipNumber}
							onChange={(event) =>
								setUpdateForm((prev) => ({ ...prev, membershipNumber: event.target.value.toUpperCase() }))
							}
							placeholder="Membership Number"
							className="w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
							required
						/>

						<button type="submit" className="rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white">
							Load Details
						</button>
					</form>

					{loadedMembership && (
						<div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
							<p>
								<span className="font-semibold">Membership Number:</span> {loadedMembership.membershipNumber}
							</p>
							<p>
								<span className="font-semibold">Price:</span> Rs {loadedMembership.price}
							</p>
							<p>
								<span className="font-semibold">Current Term:</span> {formatTerm(loadedMembership.durationMonths)}
							</p>
							<p>
								<span className="font-semibold">Expiry:</span>{' '}
								{loadedMembership.endDate ? new Date(loadedMembership.endDate).toLocaleDateString() : '-'}
							</p>
							<p>
								<span className="font-semibold">Status:</span> {loadedMembership.status}
							</p>
						</div>
					)}

					<form onSubmit={handleUpdateMembership} className="space-y-3">
						<div className="space-y-2 text-sm text-slate-700">
							<label className="flex items-center gap-2">
								<input
									type="radio"
									name="action"
									value="extend"
									checked={updateForm.action === 'extend'}
									onChange={(event) => setUpdateForm((prev) => ({ ...prev, action: event.target.value }))}
								/>
								Extend Membership
							</label>
							<label className="flex items-center gap-2">
								<input
									type="radio"
									name="action"
									value="cancel"
									checked={updateForm.action === 'cancel'}
									onChange={(event) => setUpdateForm((prev) => ({ ...prev, action: event.target.value }))}
								/>
								Cancel Membership
							</label>
						</div>

						<label className="grid gap-1 text-sm font-medium text-slate-700">
							Extension Term
							<select
								value={updateForm.extensionMonths}
								onChange={(event) =>
									setUpdateForm((prev) => ({ ...prev, extensionMonths: Number(event.target.value) }))
								}
								disabled={updateForm.action === 'cancel'}
								className="w-full rounded-md border border-blue-300 bg-blue-100 px-3 py-2 disabled:opacity-60"
							>
								{termOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</label>

						<button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
							Update Membership
						</button>
					</form>
				</div>

				<div className="space-y-3">
					{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}
					{success && <p className="rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{success}</p>}

					{memberships.map((membership) => (
						<article key={membership._id} className="rounded-md border border-slate-300 bg-white p-4">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div>
									<h3 className="text-lg font-semibold text-slate-800">Membership Plan</h3>
									<p className="text-sm text-slate-600">No: {membership.membershipNumber}</p>
									<p className="text-sm text-slate-600">
										Rs {membership.price} | {formatTerm(membership.durationMonths)}
									</p>
									<p className="text-sm text-slate-600">
										Expiry: {membership.endDate ? new Date(membership.endDate).toLocaleDateString() : '-'}
									</p>
								</div>

								<span
									className={`rounded-full px-3 py-1 text-xs font-semibold ${
										membership.status === 'cancelled'
											? 'bg-red-100 text-red-700'
											: 'bg-emerald-100 text-emerald-700'
									}`}
								>
									{membership.status}
								</span>
							</div>

							<ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
								{membership.features?.map((feature) => (
									<li key={feature}>{feature}</li>
								))}
							</ul>
						</article>
					))}

					{memberships.length === 0 && (
						<p className="rounded-md border border-slate-300 bg-white px-3 py-4 text-sm text-slate-500">
							No memberships created yet.
						</p>
					)}
				</div>
			</section>
		</PageShell>
	)
}

export default MembershipManagement
