import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../Routes/AxiosHelper.js'

const LIMITS = { username: 40, email: 40 , password: 128 }

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/api/auth/register', { username, email, password })
            toast.success('Registered successfully')
            navigate('/poll')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            if (e.target.value.length > LIMITS.username) { toast.error(`Max ${LIMITS.username} characters`); return }
                            setUsername(e.target.value)
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            if (e.target.value.length > LIMITS.email) { toast.error(`Max ${LIMITS.email} characters`); return }
                            setEmail(e.target.value)
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            if (e.target.value.length > LIMITS.password) { toast.error(`Max ${LIMITS.password} characters`); return }
                            setPassword(e.target.value)
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Register
                </button>
            </form>
        </div>
    )
}

export default Register
