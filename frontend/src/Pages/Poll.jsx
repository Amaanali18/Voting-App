import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../Routes/AxiosHelper.js'

const Poll = () => {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const handleSearch = async (e) => {
        e.preventDefault()
        const name = search.trim()
        if (!name) return

        try {
            const { data } = await api.post('/api/voting/existsByName', { name })
            if (!data.exists) {
                toast.error("Poll doesn't exist")
                return
            }
            navigate(`/vote/${encodeURIComponent(name)}`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Request failed')
        }
    }

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout')
            toast.success('Logged out')
        } catch {
            toast.error('Logout failed')
        }
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex justify-end p-6">
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Logout
                </button>
            </div>
            <div className="flex items-center justify-center -mt-16" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div className="w-full max-w-xl px-4">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Enter poll room name..."
                            className="flex-1 px-4 py-3 border rounded-lg shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => navigate('/create')}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 font-medium"
                        >
                            Create
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Poll
