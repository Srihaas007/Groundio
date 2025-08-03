import './LoadingSpinner.css'

function LoadingSpinner({ size = 'medium' }) {
  return (
    <div className={`loading-container ${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  )
}

export default LoadingSpinner
