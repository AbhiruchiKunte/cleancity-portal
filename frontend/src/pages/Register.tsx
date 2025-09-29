// src/pages/Register.tsx 

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, Leaf, Mail, Key, User, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const initialState = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const handleClearForm = () => {
    setFormData(initialState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Passwords do not match.",
      });
      handleClearForm();
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(formData);

      if (success) {
        toast({
          title: "Registration Successful! 🌍",
          description: "Welcome! You're logged in and ready to contribute.",
        });
        navigate('/');
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "User with this email or username already exists.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
      handleClearForm();
    }
  };

  const PasswordToggle = ({ isVisible, toggleVisibility, disabled }: { isVisible: boolean, toggleVisibility: () => void, disabled: boolean }) => (
    <button
      type="button"
      onClick={toggleVisibility}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
      disabled={disabled}
    >
      {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 bg-secondary/30">
      <Card className="w-full max-w-lg shadow-eco border-primary/20 bg-card/90 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-clean rounded-full shadow-clean">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Join the Eco-Movement</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your account to get on the leaderboard and make an impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="firstName" placeholder="First Name" required className="pl-10" value={formData.firstName} onChange={handleChange} disabled={isLoading} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="lastName" placeholder="Last Name" required className="pl-10" value={formData.lastName} onChange={handleChange} disabled={isLoading} />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Unique Leaderboard Username</Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="username" placeholder="EcoWarrior24" required className="pl-10" value={formData.username} onChange={handleChange} disabled={isLoading} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="name@example.com" required className="pl-10" value={formData.email} onChange={handleChange} disabled={isLoading} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} required className="pl-10 pr-10" value={formData.password} onChange={handleChange} disabled={isLoading} />
                <PasswordToggle isVisible={showPassword} toggleVisibility={() => setShowPassword(!showPassword)} disabled={isLoading} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required className="pl-10 pr-10" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} />
                <PasswordToggle isVisible={showConfirmPassword} toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading} />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary-glow shadow-clean" disabled={isLoading}>
              {isLoading ? 'Registering...' : <><UserPlus className="mr-2 h-4 w-4" /> Create Account</>}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline text-primary hover:text-primary-glow">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;