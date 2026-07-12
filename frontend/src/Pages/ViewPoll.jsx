import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../Routes/AxiosHelper.js'

const ViewPoll = () => {
    const { name } = useParams()
    const navigate = useNavigate()

    const [poll, setPoll] = useState(null)
    const [selected, setSelected] = useState(null)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (!name) return
        api.get(`/api/voting/${encodeURIComponent(name)}`)
            .then(({ data }) => {
                if (Array.isArray(data) && data.length > 0) {
                    const room = data[0]
                    const transformedOptions = room.options.map((text, idx) => ({
                        text,
                        votes: room.counter?.[idx] || 0
                    }))
                    setPoll({ ...room, options: transformedOptions })
                }
            })
            .catch((err) => toast.error(err.response?.data?.message || 'Failed to fetch poll'))
    }, [name])

    const handleVote = async () => {
        if (selected === null) {
            toast.error('Please select an option')
            return
        }
        try {
            await api.post(`/api/voting/${encodeURIComponent(name)}/vote`, { optionIndex: selected })
            setSubmitted(true)
            toast.success('Vote submitted!')
            const updated = await api.get(`/api/voting/${encodeURIComponent(name)}`)
            if (Array.isArray(updated.data) && updated.data.length > 0) {
                const room = updated.data[0]
                const transformedOptions = room.options.map((text, idx) => ({
                    text,
                    votes: room.counter?.[idx] || 0
                }))
                setPoll({ ...room, options: transformedOptions })
            }
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
        navigate('/')
    }

    if (!poll) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{poll.name}</h1>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Logout
                </button>
            </div>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{poll.question}</h2>

                <div className="space-y-4 mb-8">
                    {poll.options.map((opt, idx) => {
                        const total = poll.options.reduce((s, o) => s + o.votes, 0)
                        const pct = total ? Math.round((opt.votes / total) * 100) : 0
                        return (
                            <div
                                key={idx}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                    selected === idx ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => !submitted && setSelected(idx)}
                            >
                                <div className="flex items-center gap-4">
                                    <input
                                        type="radio"
                                        name="option"
                                        checked={selected === idx}
                                        onChange={() => !submitted && setSelected(idx)}
                                        disabled={submitted}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <span className="flex-1 text-lg">{opt.text}</span>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-700">{opt.votes} votes</div>
                                        <div className="text-sm text-gray-500">{pct}%</div>
                                    </div>
                                </div>
                                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${pct}%` }}
                                    ></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {!submitted ? (
                    <button
                        onClick={handleVote}
                        disabled={selected === null}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                    >
                        Submit Vote
                    </button>
                ) : (
                    <p className="text-center text-green-600 font-semibold text-lg">Vote submitted!</p>
                )}
            </div>
        </div>
    )
}

export default ViewPoll