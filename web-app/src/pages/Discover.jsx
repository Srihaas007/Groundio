import Hero from '../components/Hero'
import Features from '../components/Features'

function Discover() {
  return (
    <div className="min-h-screen">
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discover Amazing Venues
            </span>
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Explore premium sports facilities in your area. Find the perfect venue for your next game or event.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Discover
