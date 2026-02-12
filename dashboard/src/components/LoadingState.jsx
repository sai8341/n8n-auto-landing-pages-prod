import './LoadingState.css'

export function LoadingSpinner({ message = 'Fetching live data from n8n...' }) {
    return (
        <div className="loading-container animate-in">
            <div className="loading-spinner">
                <div className="spinner-ring" />
                <span className="spinner-icon">⚡</span>
            </div>
            <p className="loading-message">{message}</p>
            <span className="loading-sub">Connecting to your n8n instance</span>
        </div>
    )
}

export function ErrorState({ message, onRetry }) {
    return (
        <div className="error-container animate-in">
            <span className="error-icon">⚠️</span>
            <h3>Connection Failed</h3>
            <p>{message}</p>
            <div className="error-tips">
                <p>Check that:</p>
                <ul>
                    <li>Your n8n instance is running</li>
                    <li>The API key in <code>.env</code> is valid</li>
                    <li>The workflow ID is correct</li>
                    <li>The Vite dev server was restarted after changing <code>.env</code></li>
                </ul>
            </div>
            {onRetry && (
                <button className="retry-btn" onClick={onRetry}>
                    🔄 Retry Connection
                </button>
            )}
        </div>
    )
}
