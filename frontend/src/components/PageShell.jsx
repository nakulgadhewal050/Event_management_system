import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const roleHome = {
  admin: '/admin',
  vendor: '/vendor',
  user: '/user',
}

function PageShell({ title, links = [], children }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-bg px-4 py-6 sm:px-8">
      <div className="frame mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
        <header className="panel-soft flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-col gap-2">
            <div className="title-pill px-5 py-3 text-sm font-semibold tracking-wide sm:text-lg">
              {title}
            </div>
            <p className="text-xs font-medium text-slate-600 sm:text-sm">
              Signed in as {user?.name || 'Guest'} ({user?.role || 'unknown'})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user?.role && (
              <Link
                to={roleHome[user.role] || '/'}
                className="nav-chip"
              >
                Home
              </Link>
            )}

            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="nav-chip"
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="nav-chip"
            >
              Log Out
            </button>
          </div>
        </header>

        <div className="shell-content flex flex-col gap-6">{children}</div>
      </div>
    </div>
  )
}

export default PageShell
