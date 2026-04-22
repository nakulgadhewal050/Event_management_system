import React, { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import PageShell from '../../components/PageShell.jsx'

function UserManagement() {
  const [role, setRole] = useState('all')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const visibleItems = items.filter((item) => item.role !== 'admin')

  // ==================== Fetch Users ====================
  const fetchUsers = async () => {
    try {
      setError('')
      const query = role === 'all' ? '' : `?role=${role}`
      const { data } = await apiClient.get(`/admin/users${query}`)
      setItems(data.data)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to fetch users at the moment.'
      )
    }
  }

  useEffect(() => {
    let ignore = false

    const loadUsers = async () => {
      try {
        const query = role === 'all' ? '' : `?role=${role}`
        const { data } = await apiClient.get(`/admin/users${query}`)

        if (!ignore) {
          setItems(data.data)
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err?.response?.data?.message ||
            'Unable to fetch users at the moment.'
          )
        }
      }
    }

    loadUsers()

    return () => {
      ignore = true
    }
  }, [role])

  // ==================== Actions ====================
  const toggleStatus = async (userId) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/status`)
      fetchUsers()
    } catch {
      setError('Unable to update user status right now.')
    }
  }

  const cancelMembership = async (userId) => {
    try {
      await apiClient.patch(
        `/admin/users/${userId}/membership/cancel`
      )
      fetchUsers()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to cancel membership right now.'
      )
    }
  }

  return (
    <PageShell
      title="User And Vendor Management"
      links={[{ to: '/admin/memberships', label: 'Memberships' }]}
    >
      <section className="space-y-4">

        {/* ==================== Filter ==================== */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Role Filter
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-md border border-blue-300 bg-blue-100 px-3 py-2"
          >
            <option value="all">All</option>
            <option value="user">Users</option>
            <option value="vendor">Vendors</option>
          </select>
        </div>

        {/* ==================== Error ==================== */}
        {error && (
          <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* ==================== Table ==================== */}
        <div className="overflow-x-auto rounded-md border border-slate-300 bg-white">
          <table className="min-w-full">

            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Membership</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleItems.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-slate-200"
                >
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3 capitalize">
                    {item.role}
                  </td>

                  {/* Membership */}
                  <td className="px-4 py-3">
                    {item.membership ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        None
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="space-x-2 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleStatus(item._id)}
                      className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                    >
                      {item.isActive ? 'Block' : 'Activate'}
                    </button>

                    {item.membership && (
                      <button
                        type="button"
                        onClick={() =>
                          cancelMembership(item._id)
                        }
                        className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                      >
                        Cancel Membership
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {visibleItems.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No records found.
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

export default UserManagement