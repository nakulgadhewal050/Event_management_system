/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react'
import apiClient from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem('ems_user')
		return storedUser ? JSON.parse(storedUser) : null
	})

	const [token, setToken] = useState(() => localStorage.getItem('ems_token'))
	const [loading, setLoading] = useState(false)

	const login = async (payload) => {
		setLoading(true)

		try {
			const { data } = await apiClient.post('/auth/login', payload)
			setUser(data.data.user)
			setToken(data.data.token)
			localStorage.setItem('ems_user', JSON.stringify(data.data.user))
			localStorage.setItem('ems_token', data.data.token)
			return data.data.user
		} finally {
			setLoading(false)
		}
	}

	const registerVendor = async (payload) => {
		setLoading(true)

		try {
			const { data } = await apiClient.post('/auth/register/vendor', payload)
			return data.data
		} finally {
			setLoading(false)
		}
	}

	const registerUser = async (payload) => {
		setLoading(true)

		try {
			const { data } = await apiClient.post('/auth/register/user', payload)
			return data.data
		} finally {
			setLoading(false)
		}
	}

	const logout = () => {
		setUser(null)
		setToken(null)
		localStorage.removeItem('ems_user')
		localStorage.removeItem('ems_token')
	}

	const value = useMemo(
		() => ({
			user,
			token,
			isAuthenticated: Boolean(user && token),
			loading,
			login,
			registerVendor,
			registerUser,
			logout,
		}),
		[user, token, loading],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}

	return context
}
