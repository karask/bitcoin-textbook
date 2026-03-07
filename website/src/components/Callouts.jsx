export function Note({ children }) {
    return (
        <div className="callout note">
            <div className="callout-header">📝 Note</div>
            <div className="callout-body">{children}</div>
        </div>
    )
}

export function Summary({ children }) {
    return (
        <div className="callout summary">
            <div className="callout-header">📋 Chapter Summary</div>
            <div className="callout-body">{children}</div>
        </div>
    )
}

export function Exercise({ number, children }) {
    return (
        <div className="callout exercise exercise-item">
            <div className="exercise-number">Exercise {number}</div>
            <div className="callout-body">{children}</div>
        </div>
    )
}

export function Emphbox({ children }) {
    return (
        <div className="callout emphbox">
            {children}
        </div>
    )
}
