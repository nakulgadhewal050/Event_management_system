import React from 'react'
import { Link } from 'react-router-dom'

const roleCards = [
	{
		title: 'Admin',
		description: 'Manage users, memberships, and platform activity from one control panel.',
		to: '/login?role=admin',
	},
	{
		title: 'Vendor',
		description: 'Publish services, manage inventory requests, and handle your event products.',
		to: '/login?role=vendor',
	},
	{
		title: 'User',
		description: 'Explore vendors, curate your cart, track orders, and organize your guest list.',
		to: '/login?role=user',
	},
]

function Index() {
	return (
		<div className="app-bg px-4 py-6 sm:px-8">
			<div className="frame mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 sm:p-6">
				<header className="hero-strip rounded-2xl px-5 py-6 sm:px-8">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Event Command Center</p>
					<h1 className="mt-3 text-2xl font-bold leading-tight sm:text-4xl">
						Plan. Coordinate. Deliver memorable events.
					</h1>
					<p className="mt-3 max-w-3xl text-sm text-blue-50 sm:text-base">
						A single operating workspace for admins, vendors, and users to manage memberships,
						products, guests, carts, and event execution status.
					</p>
				</header>

				<section className="grid gap-4 md:grid-cols-3">
					{roleCards.map((card) => (
						<article
							key={card.title}
							className="panel-soft group p-5 transition-transform duration-200 hover:-translate-y-1"
						>
							<h2 className="text-xl font-bold text-slate-800">{card.title}</h2>
							<p className="mt-2 text-sm text-slate-600">{card.description}</p>
							<Link to={card.to} className="nav-chip mt-5">
								Continue as {card.title}
							</Link>
						</article>
					))}
				</section>

				<section className="panel-soft flex flex-col items-center justify-center gap-3 p-4 text-center sm:flex-row">
					<span className="text-sm font-medium text-slate-700">Get started:</span>
					<Link to="/user/signup" className="nav-chip">
						User Sign Up
					</Link>
					<Link to="/vendor/signup" className="nav-chip">
						Vendor Sign Up
					</Link>
					<Link to="/login" className="nav-chip">
						Login
					</Link>
				</section>
			</div>
		</div>
	)
}

export default Index
