import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function AdminDashboard() {
	const [stats, setStats] = useState({ users: 0, vendors: 0, memberships: 0, openRequests: 0 })

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const { data } = await apiClient.get('/admin/dashboard')
				setStats(data.data)
			} catch {
				setStats({ users: 0, vendors: 0, memberships: 0, openRequests: 0 })
			}
		}

		fetchStats()
	}, [])

	return (
		<PageShell
			title="Welcome Admin"
			links={[
				{ to: '/admin/users', label: 'Maintain User/Vendor' },
				{ to: '/admin/memberships', label: 'Memberships' },
			]}
		>
			<section className="grid gap-4 md:grid-cols-4">
				<article className="rounded-md bg-blue-600 p-4 text-white">
					<p className="text-sm text-blue-100">Users</p>
					<p className="text-2xl font-bold">{stats.users}</p>
				</article>
				<article className="rounded-md bg-blue-600 p-4 text-white">
					<p className="text-sm text-blue-100">Vendors</p>
					<p className="text-2xl font-bold">{stats.vendors}</p>
				</article>
				<article className="rounded-md bg-blue-600 p-4 text-white">
					<p className="text-sm text-blue-100">Memberships</p>
					<p className="text-2xl font-bold">{stats.memberships}</p>
				</article>
				<article className="rounded-md bg-blue-600 p-4 text-white">
					<p className="text-sm text-blue-100">Open Requests</p>
					<p className="text-2xl font-bold">{stats.openRequests}</p>
				</article>
			</section>

			<section className="grid gap-4 md:grid-cols-2">
				<Link
					to="/admin/users"
					className="rounded-md border border-slate-300 bg-white p-6 text-center text-lg font-semibold text-slate-800"
				>
					Maintain User
				</Link>
				<Link
					to="/admin/memberships"
					className="rounded-md border border-slate-300 bg-white p-6 text-center text-lg font-semibold text-slate-800"
				>
					Maintain Vendor Membership
				</Link>
			</section>
		</PageShell>
	)
}

export default AdminDashboard
