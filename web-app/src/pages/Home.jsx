import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Find Your Perfect Venue</h1>
        <p>Book stadiums, sports complexes, and venues across the city with ease</p>
        <Link to="/search">
          <button className="cta-button">
            Start Searching
          </button>
        </Link>
      </section>
      
      <section style={{ marginTop: '4rem' }}>
        <h2>Featured Venues</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '2rem'
        }}>
          <div className="card">
            <h3>City Sports Complex</h3>
            <p>Full-size football field with modern facilities</p>
            <p><strong>₹2,000/hour</strong></p>
          </div>
          <div className="card">
            <h3>Downtown Basketball Court</h3>
            <p>Indoor basketball court with air conditioning</p>
            <p><strong>₹800/hour</strong></p>
          </div>
          <div className="card">
            <h3>Olympic Swimming Pool</h3>
            <p>50m pool with diving boards and changing rooms</p>
            <p><strong>₹1,500/hour</strong></p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
