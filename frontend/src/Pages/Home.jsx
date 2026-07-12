import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
    return match ? match[2] : null
}

const Home = () => {
    const navigate = useNavigate()

    useEffect(() => {
        if (getCookie('jwt')) navigate('/poll', { replace: true })
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center max-w-lg p-8 bg-white rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Voting Application</h1>
                <p className="text-gray-600 mb-6">
                    A real-time polling platform to create, discover, and vote on polls securely.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Register
                    </button>
                    <button
                        onClick={() => navigate('/about')}
                        className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-600"
                    >
                        About
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home
