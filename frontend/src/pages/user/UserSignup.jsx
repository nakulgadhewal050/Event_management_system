import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/AuthShell.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const initialForm = {
	name: '',
	email: '',
	password: '',
	phone: '',
}

function UserSignup() {
	const [form, setForm] = useState(initialForm)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const { registerUser, loading } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setMessage('')

		try {
			await registerUser(form)
			setMessage('User account created successfully. Please login to continue.')
			setForm(initialForm)
			setTimeout(() => navigate('/login?role=user'), 900)
		} catch (requestError) {
			setError(requestError?.response?.data?.message || 'Unable to create user account.')
		}
	}

	return (
		<AuthShell
			title="Create User Account"
			subtitle="Set up your profile to browse vendors and manage event planning."
			footer={(
				<>
					Already registered?{' '}
					<Link to="/login?role=user" className="font-semibold text-sky-700">
						Login as user
					</Link>
				</>
			)}
		>
			<form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
					<input
						value={form.name}
						onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
						placeholder="Name"
						className="rounded-xl border border-sky-200 bg-white px-3 py-2"
						required
					/>

					<input
						type="email"
						value={form.email}
						onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
						placeholder="Email"
						className="rounded-xl border border-sky-200 bg-white px-3 py-2"
						required
					/>

					<input
						type="password"
						minLength={6}
						value={form.password}
						onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
						placeholder="Password"
						className="rounded-xl border border-sky-200 bg-white px-3 py-2"
						required
					/>

					<input
						value={form.phone}
						onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
						placeholder="Phone Number"
						className="rounded-xl border border-sky-200 bg-white px-3 py-2"
					/>

					{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 md:col-span-2">{error}</p>}
					{message && (
						<p className="rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-700 md:col-span-2">{message}</p>
					)}

					<div className="flex flex-wrap gap-3 md:col-span-2">
						<Link
							to="/"
							className="nav-chip"
						>
							Back
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="title-pill rounded-full px-5 py-2 font-semibold text-white disabled:opacity-60"
						>
							{loading ? 'Submitting...' : 'Sign Up'}
						</button>
					</div>
				</form>
		</AuthShell>
	)
}

export default UserSignup
