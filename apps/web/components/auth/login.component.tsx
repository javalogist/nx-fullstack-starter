'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  Label,
  CardContent,
  CardTitle,
  Input,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
  Checkbox,
  apiClient,
} from '@kodevy-core-2.0/frontend/client';
import { toast } from 'sonner';
import { IconBrandApple } from '@tabler/icons-react';

// Official Next.js logo SVG
const NextLogo = () => (
  <svg height="32" viewBox="0 0 75 65" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M37.5 0C16.789 0 0 14.326 0 32.5c0 18.174 16.789 32.5 37.5 32.5S75 50.674 75 32.5C75 14.326 58.211 0 37.5 0zm0 60C20.112 60 6 47.464 6 32.5S20.112 5 37.5 5 69 17.536 69 32.5 54.888 60 37.5 60z" fill="#fff" />
    <path d="M55.5 44.5l-16-24v24" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Official Google logo SVG
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format';

export const LoginComponent = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const healthCheck = async () => {
      try {
        const res = apiClient.get('health');
      } catch (e) {
        console.log('health check failed');
        console.error(e);
      }
    }
    healthCheck().then(() => {
      console.log('health check completed');
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Login successful!');
        router.push('/app-shell');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      toast.error('You must agree to the Terms & Conditions');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Registration successful! Please check your email for verification.');
        setActiveTab('login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };
  const handleAppleLogin = () => {
    toast.info('Apple login coming soon!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181824] to-[#23233a] px-2 py-8">
      <div className="flex w-full max-w-4xl h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-[#23233a]">
        {/* Left: Image & Caption */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-black/60 relative h-full">
          <img
            src={PLACEHOLDER_IMAGE}
            alt="Auth visual"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="relative z-10 p-6 flex flex-col h-full justify-between">
            <div className="flex items-center gap-2">
              <NextLogo />
              <span className="text-white text-lg font-bold tracking-wide">Next.js</span>
            </div>
            <div className="flex-1 flex flex-col justify-end pb-8">
              <div className="bg-black/60 rounded-lg p-4 text-white text-lg font-semibold shadow-lg">
                Capturing Moments, Creating Memories
              </div>
            </div>
          </div>
        </div>
        {/* Right: Auth Form */}
        <div className="w-full md:w-1/2 bg-[#23233a] p-8 flex flex-col justify-center h-full">
          <Card className="w-full bg-transparent border-none shadow-none">
            <CardHeader className="text-left mb-2">
              <CardTitle className="text-2xl font-bold text-white">
                {activeTab === 'login' ? 'Sign in to your account' : 'Create an account'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'login' ? (
                  <>Don't have an account?{' '}
                    <button
                      className="text-indigo-400 hover:underline"
                      type="button"
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <button
                      className="text-indigo-400 hover:underline"
                      type="button"
                      onClick={() => setActiveTab('login')}
                    >
                      Login
                    </button>
                  </>
                )}
              </p>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email" className="text-white">Email</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-[#181824] border border-[#35354d] text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="bg-[#181824] border border-[#35354d] text-white pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                    <div className="relative my-4">
                      <Separator />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#23233a] px-2 text-sm text-muted-foreground">
                        Or register with
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-1/2 flex items-center justify-center border border-[#35354d] bg-[#181824] text-white hover:bg-[#23233a]"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                      >
                        <GoogleIcon />
                        Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-1/2 flex items-center justify-center border border-[#35354d] bg-[#181824] text-white hover:bg-[#23233a]"
                        onClick={handleAppleLogin}
                        disabled={loading}
                      >
                        <IconBrandApple className="mr-2 h-5 w-5" />
                        Apple
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                {/* Signup Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="bg-[#181824] border border-[#35354d] text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="bg-[#181824] border border-[#35354d] text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-[#181824] border border-[#35354d] text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="bg-[#181824] border border-[#35354d] text-white pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agree"
                        name="agree"
                        checked={formData.agree}
                        onCheckedChange={(checked) => handleInputChange({
                          target: { name: 'agree', type: 'checkbox', checked },
                        } as any)}
                        required
                      />
                      <Label htmlFor="agree" className="text-white text-sm">
                        I agree to the{' '}
                        <a href="#" className="text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">
                          Terms & Conditions
                        </a>
                      </Label>
                    </div>
                    <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600" disabled={loading}>
                      {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                    <div className="relative my-4">
                      <Separator />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#23233a] px-2 text-sm text-muted-foreground">
                        Or register with
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-1/2 flex items-center justify-center border border-[#35354d] bg-[#181824] text-white hover:bg-[#23233a]"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                      >
                        <GoogleIcon />
                        Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-1/2 flex items-center justify-center border border-[#35354d] bg-[#181824] text-white hover:bg-[#23233a]"
                        onClick={handleAppleLogin}
                        disabled={loading}
                      >
                        <IconBrandApple className="mr-2 h-5 w-5" />
                        Apple
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default LoginComponent;
