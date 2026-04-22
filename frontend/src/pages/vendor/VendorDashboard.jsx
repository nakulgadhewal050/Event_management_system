import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function formatTerm(months) {
  if (Number(months) === 12) return '1 year'
  if (Number(months) === 24) return '2 years'
  return '6 months'
}

function VendorDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    requests: 0,
    pendingOrders: 0,
    currentMembership: null,
    availableMemberships: [],
  })

  const [profileImage, setProfileImage] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [membershipMessage, setMembershipMessage] = useState('')
  const [membershipError, setMembershipError] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [extensionMonths, setExtensionMonths] = useState(6)

  const refreshDashboard = async () => {
    try {
      const { data } = await apiClient.get('/vendor/dashboard')
      setStats(data.data)
    } catch (err) {
      console.error('Dashboard error:', err)
      setStats({
        products: 0,
        requests: 0,
        pendingOrders: 0,
        currentMembership: null,
        availableMemberships: [],
      })
    }
  }

  // ==================== Fetch Data ====================
  useEffect(() => {
    const fetchDashboard = async () => {
      await refreshDashboard()
    }

    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get('/vendor/profile')

        setProfileImage(data.profileImage || '')
        setPhone(data.phone || '')
        setCategory(data.category || '')
      } catch (err) {
        console.error('Profile fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
    fetchProfile()
  }, [])

  const selectMembership = async (membershipNumber) => {
    setMembershipError('')
    setMembershipMessage('')

    try {
      await apiClient.patch('/vendor/membership/select', {
        membershipNumber,
      })

      setMembershipMessage('Membership selected successfully.')
      refreshDashboard()
    } catch (err) {
      setMembershipError(
        err?.response?.data?.message ||
        'Unable to select membership right now.'
      )
    }
  }

  const extendMembership = async () => {
    setMembershipError('')
    setMembershipMessage('')

    try {
      await apiClient.patch('/vendor/membership/extend', {
        extensionMonths: Number(extensionMonths),
      })

      setMembershipMessage('Membership extended successfully.')
      setExtensionMonths(6)
      refreshDashboard()
    } catch (err) {
      setMembershipError(
        err?.response?.data?.message ||
        'Unable to extend membership right now.'
      )
    }
  }

  // ==================== Update Profile ====================
  const handleUpdateProfile = async () => {
    try {
      setError('')
      setMessage('')

      if (!profileImage && !phone && !category) {
        setError('Please fill at least one field to update.')
        return
      }

      // Phone validation
      if (phone && !/^\+?\d{10,15}$/.test(phone)) {
        setError('Enter a valid phone number.')
        return
      }

      setUpdating(true)

      await apiClient.patch('/vendor/profile', {
        profileImage: profileImage || undefined,
        phone: phone || undefined,
        category: category || undefined,
      })

      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to update profile.'
      )
    } finally {
      setUpdating(false)
    }
  }

  // ==================== Loading ====================
  if (loading) {
    return (
      <PageShell title="Welcome Vendor">
        <p className="text-center text-slate-600">
          Loading dashboard...
        </p>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Welcome Vendor"
      links={[
        { to: '/vendor/products', label: 'Your Item' },
        { to: '/vendor/request-item', label: 'Request Item' },
        { to: '/vendor/product-status', label: 'Product Status' },
      ]}
    >
      {/* ==================== Stats ==================== */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-md bg-blue-600 p-5 text-white">
          <p className="text-sm text-blue-100">Products</p>
          <p className="text-2xl font-bold">{stats.products}</p>
        </article>

        <article className="rounded-md bg-blue-600 p-5 text-white">
          <p className="text-sm text-blue-100">Request Items</p>
          <p className="text-2xl font-bold">{stats.requests}</p>
        </article>

        <article className="rounded-md bg-blue-600 p-5 text-white">
          <p className="text-sm text-blue-100">Pending Orders</p>
          <p className="text-2xl font-bold">
            {stats.pendingOrders}
          </p>
        </article>
      </section>

      {/* ==================== Navigation ==================== */}
      <section className="grid gap-4 md:grid-cols-3">
        <Link
          to="/vendor/products"
          className="rounded-md border border-slate-300 bg-white p-5 text-center font-semibold text-slate-800"
        >
          Manage Products
        </Link>

        <Link
          to="/vendor/request-item"
          className="rounded-md border border-slate-300 bg-white p-5 text-center font-semibold text-slate-800"
        >
          Raise Request
        </Link>

        <Link
          to="/vendor/product-status"
          className="rounded-md border border-slate-300 bg-white p-5 text-center font-semibold text-slate-800"
        >
          View Status
        </Link>
      </section>

      {/* ==================== Membership ==================== */}
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-slate-300 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Current Membership
          </h2>

          {stats.currentMembership ? (
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Membership Number:</span>{' '}
                {stats.currentMembership.membershipNumber}
              </p>

              <p>
                <span className="font-semibold">Term:</span>{' '}
                {formatTerm(stats.currentMembership.durationMonths)}
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

      {membershipError && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
          {membershipError}
        </p>
      )}

      {membershipMessage && (
        <p className="rounded-md bg-emerald-100 px-3 py-2 text-sm text-emerald-700">
          {membershipMessage}
        </p>
      )}

      {/* ==================== Profile ==================== */}
      <section className="rounded-md border border-slate-300 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Update Your Profile
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Add or update your profile image, phone, and category
        </p>

        {error && (
          <p className="mt-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-3 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700">
            {message}
          </p>
        )}

        <div className="mt-4 space-y-4">

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Profile Image URL
            </label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g., Catering, Photography, Venue"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleUpdateProfile}
            disabled={updating}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </section>
    </PageShell>
  )
}

export default VendorDashboard