import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../Routes/AxiosHelper.js'

const Vote = () => {
    const { roomName } = useParams()
    const navigate = useNavigate()

    const [poll, setPoll] = useState(null)
    const [selected, setSelected] = useState(null)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (!roomName) return
        api.get(`/api/voting/${encodeURIComponent(roomName)}`)
            .then(({ data }) => setPoll(data))
            .catch((err) => toast.error(err.response?.data?.message || 'Failed to fetch poll'))
    }, [roomName])

    const handleVote = async () => {
        if (selected === null) {
            toast.error('Please select an option')
            return
        }
        try {
            await api.post(`/api/voting/${encodeURIComponent(roomName)}/vote`, { optionIndex: selected })
            setSubmitted(true)
            toast.success('Vote submitted!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Vote failed')
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

    if (!poll) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-end mb-4">
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Logout
                </button>
            </div>

            <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>

                <div className="space-y-3 mb-6">
                    {poll.options.map((opt, idx) => {
                        const total = poll.options.reduce((s, o) => s + o.votes, 0)
                        const pct = total ? Math.round((opt.votes / total) * 100) : 0
                        return (
                            <label
                                key={idx}
                                className={`block p-3 rounded-lg border cursor-pointer ${
                                    selected === idx ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="option"
                                        checked={selected === idx}
                                        onChange={() => setSelected(idx)}
                                        disabled={submitted}
                                    />
                                    <span className="flex-1">{opt.text}</span>
                                    <span className="text-sm text-gray-500">{opt.votes} votes ({pct}%)</span>
                                </div>
                            </label>
                        )
                    })}
                </div>

                {!submitted ? (
                    <button
                        onClick={handleVote}
                        disabled={selected === null}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Submit Vote
                    </button>
                ) : (
                    <p className="text-center text-green-600 font-semibold">Vote submitted!</p>
                )}
            </div>
        </div>
    )
}

export default Vote
