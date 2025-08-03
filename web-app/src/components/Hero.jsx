function Hero({ title, subtitle, children, className = "" }) {
  return (
    <section className={`hero ${className}`}>
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}

export default Hero
