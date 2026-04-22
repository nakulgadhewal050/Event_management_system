import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const roleRoutes = {
	admin: '/admin',
	vendor: '/vendor',
	user: '/user',
}

function Login() {
	const [searchParams] = useSearchParams()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState(searchParams.get('role') || 'user')
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const { login, loading } = useAuth()

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')

		try {
			const loggedInUser = await login({ email, password, role })
			navigate(roleRoutes[loggedInUser.role] || '/', { replace: true })
		} catch (requestError) {
			setError(requestError?.response?.data?.message || 'Unable to sign in with provided details.')
		}
	}

	return (
		<AuthShell
			title="Event Management Login"
			subtitle="Choose your role and sign in to access your dashboard."
			footer={(
				<>
					New user?{' '}
					<Link to="/user/signup" className="font-semibold text-sky-700">
						Create user account
					</Link>
					{'  '}|{'  '}
					Vendor account required?{' '}
					<Link to="/vendor/signup" className="font-semibold text-sky-700">
						Create vendor profile
					</Link>
				</>
			)}
		>
			<form onSubmit={handleSubmit} className="grid gap-4">
					<label className="grid gap-2 text-sm font-medium text-slate-700">
						Login As
						<select
							value={role}
							onChange={(event) => setRole(event.target.value)}
							className="rounded-xl border border-sky-200 bg-white px-3 py-2"
						>
							<option value="admin">Admin</option>
							<option value="vendor">Vendor</option>
							<option value="user">User</option>
						</select>
					</label>

					<label className="grid gap-2 text-sm font-medium text-slate-700">
						Email
						<input
							type="email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className="rounded-xl border border-sky-200 bg-white px-3 py-2"
							placeholder="name@example.com"
						/>
					</label>

					<label className="grid gap-2 text-sm font-medium text-slate-700">
						Password
						<input
							type="password"
							required
							minLength={6}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className="rounded-xl border border-sky-200 bg-white px-3 py-2"
							placeholder="Enter password"
						/>
					</label>

					{error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

					<div className="mt-2 flex flex-wrap gap-3">
						<Link
							to="/"
							className="nav-chip"
						>
							Cancel
						</Link>
						<button
							type="submit"
							disabled={loading}
							className="title-pill rounded-full px-5 py-2 font-semibold text-white disabled:opacity-60"
						>
							{loading ? 'Signing In...' : 'Login'}
						</button>
					</div>
				</form>
		</AuthShell>
	)
}

export default Login
