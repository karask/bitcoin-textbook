import { Link } from 'react-router-dom'

export default function ChapterNav({ prev, next }) {
    return (
        <nav className="chapter-nav">
            {prev ? (
                <Link to={prev.path} className="chapter-nav-link prev">
                    <span className="chapter-nav-label">← Previous</span>
                    <span className="chapter-nav-title">{prev.title}</span>
                </Link>
            ) : <div />}
            {next ? (
                <Link to={next.path} className="chapter-nav-link next">
                    <span className="chapter-nav-label">Next →</span>
                    <span className="chapter-nav-title">{next.title}</span>
                </Link>
            ) : <div />}
        </nav>
    )
}
