import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../Routes/AxiosHelper.js'

const LIMITS = { name: 20, question: 100 }

const Create = () => {
    const [name, setName] = useState('')
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const navigate = useNavigate()

    const addOption = () => {
        if (options.length >= 10) {
            toast.error('Maximum 10 options allowed')
            return
        }
        setOptions([...options, ''])
    }

    const updateOption = (idx, value) => {
        const updated = [...options]
        updated[idx] = value
        setOptions(updated)
    }

    const removeOption = (idx) => {
        if (options.length <= 2) {
            toast.error('At least 2 options required')
            return
        }
        setOptions(options.filter((_, i) => i !== idx))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const filled = options
            .map((text) => text.trim())
            .filter((text) => text)
        if (filled.length < 2) {
            toast.error('At least 2 options required')
            return
        }
        try {
            await api.post('/api/voting/create', { name, question, options: filled })
            toast.success('Poll created!')
            navigate(`/vote/${encodeURIComponent(name)}`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create poll')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Poll</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Poll Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            if (e.target.value.length > LIMITS.name) { toast.error(`Max ${LIMITS.name} characters`); return }
                            setName(e.target.value)
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Question</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => {
                            if (e.target.value.length > LIMITS.question) { toast.error(`Max ${LIMITS.question} characters`); return }
                            setQuestion(e.target.value)
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Options</label>
                    <div className="space-y-2">
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => updateOption(idx, e.target.value)}
                                    placeholder={`Option ${idx + 1}`}
                                    className="flex-1 px-3 py-2 border rounded-lg"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => removeOption(idx)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addOption}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                        + Add option
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Create
