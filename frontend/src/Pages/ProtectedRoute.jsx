import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import api from '../Routes/AxiosHelper.js'

const ProtectedRoute = () => {
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        api.get('/api/auth/me')
            .then(() => setStatus('authenticated'))
            .catch(() => setStatus('unauthenticated'))
    }, [])

    if (status === 'loading') return null
    if (status === 'unauthenticated') return <Navigate to="/login" replace />
    return <Outlet />
}

export default ProtectedRoute
