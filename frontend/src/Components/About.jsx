import { useNavigate } from 'react-router-dom'

const About = () => {
    const navigate = useNavigate()

    return (
        <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="max-w-lg p-8 bg-white rounded-2xl shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-4">About Voting Application</h1>
                <p className="text-gray-600 mb-6">
                    A real-time polling platform where users can create, discover, and vote on polls
                    securely. Built with a modern stack for speed and reliability.
                </p>
                <ul className="text-left text-gray-700 space-y-2 mb-8">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">&#8226;</span>
                        Create and manage poll rooms with custom questions
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">&#8226;</span>
                        Real-time vote tracking with live result updates
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">&#8226;</span>
                        Secure JWT-based authentication with session management
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">&#8226;</span>
                        Search for polls by name and vote instantly
                    </li>
                </ul>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Home
                </button>
            </div>
        </div>
    )
}

export default About
