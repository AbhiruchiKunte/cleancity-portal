// src/pages/Login.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, Leaf, Mail, Key, Eye, EyeOff } from 'lucide-react'; 
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleClearForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        toast({
          title: "Login Successful! 🌱",
          description: "Welcome back, eco-warrior!",
        });
        navigate('/');
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during login.",
      });
    } finally {
      setIsLoading(false);
      handleClearForm(); // Clear form regardless of outcome
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 bg-secondary/30">
      <Card className="w-full max-w-md shadow-eco border-primary/20 bg-card/90 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-clean rounded-full shadow-clean">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Login to CleanCity</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to start classifying waste and tracking your impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="pl-10 focus-visible:ring-ring"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="ml-auto inline-block text-sm underline text-primary hover:text-primary-glow">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10 focus-visible:ring-ring"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                {/* Updated Password Toggle for better visibility and consistent style */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full mt-2 bg-primary hover:bg-primary-glow shadow-clean" disabled={isLoading}>
              {isLoading ? 'Logging In...' : <><LogIn className="mr-2 h-4 w-4" /> Log In</>}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="underline text-primary hover:text-primary-glow">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;