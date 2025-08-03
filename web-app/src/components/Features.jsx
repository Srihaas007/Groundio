import { MapPin, Zap, Shield, Smartphone, Clock, Users, Trophy, CreditCard } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Zap style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />,
      title: "Instant Booking",
      description: "Reserve your ideal sports venue in seconds with real-time availability and instant confirmation"
    },
    {
      icon: <Trophy style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />,
      title: "Premium Facilities",
      description: "Access world-class stadiums, courts, and sports complexes with professional-grade equipment"
    },
    {
      icon: <CreditCard style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />,
      title: "Secure Payments",
      description: "Safe and encrypted payment processing with multiple payment options for your convenience"
    },
    {
      icon: <Smartphone style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />,
      title: "Mobile Ready",
      description: "Book anywhere, anytime with our responsive platform optimized for all devices"
    },
    {
      icon: <MapPin style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />,
      title: "Prime Locations",
      description: "Find venues in the best locations across the city, easily accessible and well-connected"
    },
    {
      icon: <Clock style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />,
      title: "Flexible Timing",
      description: "Book venues for any duration with flexible time slots that fit your schedule perfectly"
    },
    {
      icon: <Users style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />,
      title: "Team Management",
      description: "Organize your team, manage players, and coordinate matches all in one platform"
    },
    {
      icon: <Shield style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />,
      title: "Verified Venues",
      description: "All venues are verified and quality-checked to ensure the best sports experience"
    }
  ];

  return (
    <section className="py-20" style={{ background: '#ffffff' }}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-8" style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Why Choose Groundio?
            </span>
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            maxWidth: '32rem',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Experience the future of sports venue booking with our comprehensive platform designed for athletes and sports enthusiasts.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card"
              style={{
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  transition: 'background-color 0.3s ease'
                }}>
                  {feature.icon}
                </div>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '0.75rem',
                transition: 'color 0.3s ease'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6',
                fontSize: '0.875rem'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center" style={{ marginTop: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#3b82f6'
          }}>
            <span>🚀 Ready to get started?</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
