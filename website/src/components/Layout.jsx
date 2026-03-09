import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const chapters = [
    { path: '/', title: 'Preface', number: '' },
    { path: '/how-bitcoin-works', title: 'How Bitcoin Works', number: '1' },
    { path: '/p2p-networking', title: 'P2P Networking', number: '2' },
    { path: '/forking', title: 'Forking', number: '3' },
    { path: '/technical-fundamentals', title: 'Technical Fundamentals', number: '4' },
    { path: '/keys-and-addresses', title: 'Keys and Addresses', number: '5' },
    { path: '/scripting-1', title: 'Scripting 1', number: '6' },
    { path: '/scripting-2', title: 'Scripting 2', number: '7' },
    { path: '/advanced-topics', title: 'Advanced Topics', number: '8' },
]

export { chapters }

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setSidebarOpen(false)
        // Scroll to top using multiple strategies for cross-browser support
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        const main = document.querySelector('.main-content')
        if (main) main.scrollTop = 0
    }, [location.pathname])

    return (
        <div className="app-layout">
            {/* Mobile Header */}
            <div className="mobile-header">
                <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                    ☰
                </button>
                <span className="mobile-title">Bitcoin Programming</span>
            </div>

            {/* Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <NavLink to="/" className="sidebar-brand">
                        <div className="sidebar-logo">₿</div>
                        <div className="sidebar-title">Bitcoin Programming</div>
                        <div className="sidebar-subtitle">by Konstantinos Karasavvas &copy; 2021</div>
                    </NavLink>
                </div>

                <div className="sidebar-nav">
                    <div className="nav-section-label">Contents</div>
                    {chapters.map((ch) => (
                        <NavLink
                            key={ch.path}
                            to={ch.path}
                            end={ch.path === '/'}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            {ch.number && <span className="nav-number">{ch.number}.</span>}
                            {ch.title}
                        </NavLink>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <a
                        href={`${import.meta.env.BASE_URL}downloads/bitcoin-textbook.pdf`}
                        download
                        className="sidebar-download"
                    >
                        <span className="download-icon">↓</span> Download PDF
                    </a>
                    <a
                        href="https://github.com/karask/bitcoin-textbook"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sidebar-github"
                    >
                        ⬡ View on GitHub
                    </a>
                    <a
                        href="https://github.com/karask/python-bitcoin-utils"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sidebar-github"
                    >
                        📦 python-bitcoin-utils
                    </a>
                </div>
            </nav>

            {/* Main content */}
            <main className="main-content">
                <div className="chapter-content">
                    {children}
                </div>
            </main>
        </div>
    )
}
