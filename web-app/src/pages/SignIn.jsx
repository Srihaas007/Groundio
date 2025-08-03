import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.");
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, #ffffff 50%, rgba(16, 185, 129, 0.05) 100%)',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            textDecoration: 'none'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: 'white',
                fontWeight: '700',
                fontSize: '1.25rem'
              }}>G</span>
            </div>
            <span style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Groundio
            </span>
          </Link>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '0.5rem'
          }}>Welcome Back</h1>
          <p style={{ color: '#64748b' }}>Sign in to your account to continue</p>
        </div>

        {/* Sign In Form */}
        <div className="card" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>Sign In</h2>
            <p style={{
              color: '#64748b',
              fontSize: '0.875rem'
            }}>
              Enter your credentials to access your account
            </p>
          </div>
          
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#0f172a',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  width: '1rem',
                  height: '1rem'
                }} />
                <input
                  className="input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    paddingLeft: '2.5rem',
                    height: '3rem'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#0f172a',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  width: '1rem',
                  height: '1rem'
                }} />
                <input
                  className="input"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    height: '3rem'
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    borderRadius: '0.25rem'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: '1rem', height: '1rem', color: '#64748b' }} />
                  ) : (
                    <Eye style={{ width: '1rem', height: '1rem', color: '#64748b' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right' }}>
              <Link 
                to="/forgot-password" 
                style={{
                  fontSize: '0.875rem',
                  color: '#3b82f6',
                  textDecoration: 'none'
                }}
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '3rem',
                fontSize: '1rem',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b'
            }}>
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                style={{
                  fontWeight: '500',
                  color: '#3b82f6',
                  textDecoration: 'none'
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
