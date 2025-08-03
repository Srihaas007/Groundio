function PageContainer({ children, className = "" }) {
  return (
    <div className={`page-container ${className}`}>
      <div className="container">
        {children}
      </div>
    </div>
  )
}

export default PageContainer
