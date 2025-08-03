function MyBookings() {
  return (
    <div className="min-h-screen">
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Bookings
            </span>
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Manage your current and past venue bookings all in one place.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MyBookings
