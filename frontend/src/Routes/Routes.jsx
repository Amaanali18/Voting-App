import { createBrowserRouter } from "react-router-dom"
import Layout from "./Layout.jsx"
import Home from "../Pages/Home.jsx"
import Login from "../Pages/Login.jsx"
import Register from "../Pages/Register.jsx"
import Poll from "../Pages/Poll.jsx"
import Vote from "../Pages/Vote.jsx"
import ProtectedRoute from "../Pages/ProtectedRoute.jsx"
import { About, NotFound } from "../Components/store.js"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
        ],
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
        path: '/poll',
        element: <ProtectedRoute />,
        children: [
            { index: true, element: <Poll /> },
        ],
    },
    {
        path: '/vote/:roomName',
        element: <ProtectedRoute />,
        children: [
            { index: true, element: <Vote /> },
        ],
    },
    { path: '*', element: <NotFound /> },
])

export default router
