import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WashingMachine, ShieldCheck, User, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';


export default function Login() {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { loginStudent, loginAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        const { authService } = await import('../services/api');
        await authService.registerStudent(name, rollNumber, phone, password);
        toast.success('Registration successful! Please login.');
        setIsRegistering(false);
      } else {
        await loginStudent(rollNumber, password);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Authentication failed');
      } else {
        setError('Network Error: Make sure backend is running');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(adminUser, adminPass);
      navigate('/admin');
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Invalid admin credentials');
      } else {
        setError('Network Error: Make sure backend is running (port 5000)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="login-bg-gradient" />
        <div className="login-bg-pattern" />
        {/* Floating Bubbles */}
        <div className="login-bubble login-bubble-1" />
        <div className="login-bubble login-bubble-2" />
        <div className="login-bubble login-bubble-3" />
        <div className="login-bubble login-bubble-4" />
        <div className="login-bubble login-bubble-5" />
      </div>

      <div className={`login-content ${mounted ? 'login-content-visible' : ''}`}>
        {/* Brand Header */}
        <div className="login-brand">
          <div className="login-logo-wrap">
            <div className="login-logo">
              <WashingMachine className="login-logo-icon" />
            </div>
            <div className="login-logo-ring" />
          </div>
          <h1 className="login-title">ZIPPWASH</h1>
          <p className="login-subtitle">
            <Sparkles className="inline h-3.5 w-3.5 mr-1 opacity-60" />
            Smart Campus Laundry Management
          </p>
        </div>

        {/* Login Card */}
        <div className="login-card-wrapper">
          <Card className="login-card">
            <Tabs defaultValue="student" className="w-full" onValueChange={() => { setError(''); setIsRegistering(false); }}>
              <TabsList className="login-tabs-list">
                <TabsTrigger value="student" className="login-tab-trigger">
                  <User className="h-4 w-4 mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="admin" className="login-tab-trigger">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <div className="login-form-area">
                {/* Error Banner */}
                {error && (
                  <div className="login-error animate-fade-up">
                    <div className="login-error-dot" />
                    {error}
                  </div>
                )}

                {/* Student Tab */}
                <TabsContent value="student" className="mt-0 space-y-5">
                  <div className="login-heading-group">
                    <h2 className="login-heading">
                      {isRegistering ? 'Create Account' : 'Welcome back'}
                    </h2>
                    <p className="login-heading-sub">
                      {isRegistering ? 'Register your student account to get started' : 'Sign in to manage your laundry'}
                    </p>
                  </div>

                  <form onSubmit={handleStudentSubmit} className="login-form">
                    {isRegistering && (
                      <>
                        <div className="login-field animate-fade-up" style={{ animationDelay: '0.05s' }}>
                          <Label htmlFor="name" className="login-label">Full Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your full name"
                            className="login-input"
                            required
                          />
                        </div>
                        <div className="login-field animate-fade-up" style={{ animationDelay: '0.1s' }}>
                          <Label htmlFor="phone" className="login-label">Phone Number</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="10-digit mobile number"
                            className="login-input"
                            required
                          />
                        </div>
                      </>
                    )}
                    <div className="login-field">
                      <Label htmlFor="roll_number" className="login-label">Roll Number</Label>
                      <Input
                        id="roll_number"
                        value={rollNumber}
                        onChange={e => setRollNumber(e.target.value)}
                        placeholder="e.g. 22BCS123"
                        className="login-input"
                        required
                      />
                    </div>
                    <div className="login-field">
                      <Label htmlFor="password" className="login-label">Password</Label>
                      <div className="login-password-wrap">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="login-input login-input-password"
                          required
                        />
                        <button
                          type="button"
                          className="login-eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="login-submit-btn login-submit-student" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Please wait...
                        </>
                      ) : (
                        <>
                          {isRegistering ? 'Create Account' : 'Sign In'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="login-switch-row">
                    <div className="login-divider">
                      <div className="login-divider-line" />
                      <span className="login-divider-text">or</span>
                      <div className="login-divider-line" />
                    </div>
                    <Button
                      variant="ghost"
                      className="login-switch-btn"
                      onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                    >
                      {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                    </Button>
                  </div>
                </TabsContent>

                {/* Admin Tab */}
                <TabsContent value="admin" className="mt-0 space-y-5">
                  <div className="login-heading-group">
                    <h2 className="login-heading">Admin Portal</h2>
                    <p className="login-heading-sub">Restricted access — admin credentials required</p>
                  </div>

                  <form onSubmit={handleAdminSubmit} className="login-form">
                    <div className="login-field">
                      <Label htmlFor="admin_user" className="login-label">Username</Label>
                      <Input
                        id="admin_user"
                        value={adminUser}
                        onChange={e => setAdminUser(e.target.value)}
                        placeholder="admin"
                        className="login-input"
                        required
                      />
                    </div>
                    <div className="login-field">
                      <Label htmlFor="admin_pass" className="login-label">Password</Label>
                      <div className="login-password-wrap">
                        <Input
                          id="admin_pass"
                          type={showAdminPassword ? 'text' : 'password'}
                          value={adminPass}
                          onChange={e => setAdminPass(e.target.value)}
                          placeholder="••••••••"
                          className="login-input login-input-password"
                          required
                        />
                        <button
                          type="button"
                          className="login-eye-btn"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          tabIndex={-1}
                        >
                          {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="login-demo-hint">
                      <span className="login-demo-icon">🔐</span>
                      <span>Demo credentials: <code className="login-demo-code">admin / admin123</code></span>
                    </div>

                    <Button type="submit" className="login-submit-btn login-submit-admin" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Sign In as Admin
                          <ShieldCheck className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>

        {/* Footer */}
        <p className="login-footer">
          © 2026 ZIPPWASH · Built for campus life
        </p>
      </div>
    </div>
  );
}
