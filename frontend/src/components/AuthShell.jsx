import React from 'react'

function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="app-bg px-4 py-6 sm:px-8">
      <div className="frame mx-auto w-full max-w-4xl p-4 sm:p-6">
        <div className="hero-strip rounded-2xl px-5 py-6 text-center sm:px-8">
          <h1 className="text-xl font-bold sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-blue-50 sm:text-base">{subtitle}</p>}
        </div>

        <div className="panel-soft mt-5 p-4 sm:p-6">{children}</div>

        {footer && <div className="mt-4 text-center text-sm text-slate-700">{footer}</div>}
      </div>
    </div>
  )
}

export default AuthShell
