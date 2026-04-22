import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function formatTerm(months) {
  if (Number(months) === 12) return '1 year'
  if (Number(months) === 24) return '2 years'
  return '6 months'
}

function UserDashboard() {
  const [stats, setStats] = useState({
    categories: [],
    cartCount: 0,
    activeOrders: 0,
    currentMembership: null,
    availableMemberships: [],
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [extensionMonths, setExtensionMonths] = useState(6)

  // ==================== Refresh ====================
  const refreshDashboard = async () => {
    try {
      const { data } = await apiClient.get('/user/dashboard')
      setStats(data.data)
    } catch {
      setStats({
        categories: [],
        cartCount: 0,
        activeOrders: 0,
        currentMembership: null,
        availableMemberships: [],
      })
    }
  }

  // ==================== Fetch ====================
  useEffect(() => {
    let ignore = false

    const fetchData = async () => {
      try {
        const { data } = await apiClient.get('/user/dashboard')

        if (!ignore) {
          setStats(data.data)
        }
      } catch {
        if (!ignore) {
          setStats({
            categories: [],
            cartCount: 0,
            activeOrders: 0,
            currentMembership: null,
            availableMemberships: [],
          })
        }
      }
    }

    fetchData()

    return () => {
      ignore = true
    }
  }, [])

  // ==================== Membership ====================
  const selectMembership = async (membershipNumber) => {
    setError('')
    setMessage('')

    try {
      await apiClient.patch('/user/membership/select', {
        membershipNumber,
      })

      setMessage('Membership selected successfully.')
      refreshDashboard()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to select membership right now.'
      )
    }
  }

  const extendMembership = async () => {
    setError('')
    setMessage('')

    try {
      await apiClient.patch('/user/membership/extend', {
        extensionMonths: Number(extensionMonths),
      })

      setMessage('Membership extended successfully.')
      setExtensionMonths(6)
      refreshDashboard()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to extend membership right now.'
      )
    }
  }

  return (
    <PageShell
      title="Welcome User"
      links={[
        { to: '/user/vendors', label: 'Vendor' },
        { to: '/user/cart', label: 'Cart' },
        { to: '/user/guest-list', label: 'Guest List' },
        { to: '/user/order-status', label: 'Order Status' },
      ]}
    >
      {/* ==================== Stats ==================== */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-md bg-blue-600 p-5 text-white">
          <p className="text-sm text-blue-100">Categories</p>
          <p className="text-2xl font-bold">
            {stats.categories.length}
          </p>
        </article>

        <article className="rounded-md bg-blue-600 p-5 text-white">
          <p className="text-sm text-blue-100">Cart Items</p>
          <p className="text-2xl font-bold">
            {stats.cartCount}
          </p>
        </article>

        <article className="rounded-md bg-blue-600 p-5 text-white">
          <p className="text-sm text-blue-100">Active Orders</p>
          <p className="text-2xl font-bold">
            {stats.activeOrders}
          </p>
        </article>
      </section>

      {/* ==================== Membership ==================== */}
      <section className="grid gap-4 md:grid-cols-2">

        {/* Current Membership */}
        <article className="rounded-md border border-slate-300 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Current Membership
          </h2>

          {stats.currentMembership ? (
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              <p>
                <span className="font-semibold">
                  Membership Number:
                </span>{' '}
                {stats.currentMembership.membershipNumber}
              </p>

              <p>
                <span className="font-semibold">Term:</span>{' '}
                {formatTerm(
                  stats.currentMembership.durationMonths
                )}
              </p>

              <p>
                <span className="font-semibold">Price:</span>{' '}
                Rs {stats.currentMembership.price}
              </p>

              <p>
                <span className="font-semibold">Expiry:</span>{' '}
                {stats.currentMembership.endDate
                  ? new Date(
                      stats.currentMembership.endDate
                    ).toLocaleDateString()
                  : '-'}
              </p>

              {/* Extend */}
              <div className="mt-4 space-y-3 border-t border-slate-200 pt-3">
                <div className="flex gap-2">
                  {[6, 12, 24].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setExtensionMonths(m)}
                      className={`flex-1 rounded-md px-2 py-2 text-xs font-semibold ${
                        extensionMonths === m
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {formatTerm(m)}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={extendMembership}
                  className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Extend Membership
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No membership selected yet.
            </p>
          )}
        </article>

        {/* Available Memberships */}
        <article className="rounded-md border border-slate-300 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Available Memberships
          </h2>

          <div className="mt-3 space-y-3">
            {stats.availableMemberships.map((membership) => (
              <div
                key={membership._id}
                className="rounded-md border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-sm font-semibold text-slate-800">
                  Membership Plan
                </p>

                <p className="text-xs text-slate-600">
                  No: {membership.membershipNumber}
                </p>

                <p className="text-xs text-slate-600">
                  {formatTerm(membership.durationMonths)} | Rs{' '}
                  {membership.price}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    selectMembership(
                      membership.membershipNumber
                    )
                  }
                  className="mt-2 rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white"
                >
                  Select Membership
                </button>
              </div>
            ))}

            {stats.availableMemberships.length === 0 && (
              <p className="text-sm text-slate-500">
                No active memberships available.
              </p>
            )}
          </div>
        </article>
      </section>

      {/* Messages */}
      {error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      )}

      {/* Categories */}
      <section className="rounded-md border border-slate-300 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Available Categories
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {stats.categories.map((category) => (
            <Link
              key={category}
              to={`/user/vendors?category=${encodeURIComponent(
                category
              )}`}
              className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
            >
              {category}
            </Link>
          ))}

          {stats.categories.length === 0 && (
            <p className="text-sm text-slate-500">
              No categories yet.
            </p>
          )}
        </div>
      </section>
    </PageShell>
  )
}

export default UserDashboard