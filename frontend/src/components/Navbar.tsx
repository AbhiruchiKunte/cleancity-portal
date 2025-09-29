// src/components/Navbar.tsx

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Home,
  Upload,
  Map,
  Trophy,
  Menu,
  X,
  Leaf,
  LogOut
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth(); // Use auth context

  // Conditional navigation based on user state
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Map', href: '/map', icon: Map },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Function to get initials for the avatar
  const getInitials = (firstName: string, lastName: string) => 
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-clean">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-clean rounded-lg shadow-clean group-hover:shadow-eco transition-all duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">
              Clean<span className="text-primary">City</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "eco" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}

            {/* User Profile / Logout Dropdown */}
            {user && (
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-10 w-10 hover:bg-primary/10"
                        >
                          <Avatar className="h-8 w-8 bg-primary text-primary-foreground text-sm font-semibold">
                            <AvatarFallback>
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-primary text-primary-foreground">
                      <p>{user.firstName} {user.lastName}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent align="end" className="w-56 bg-card text-card-foreground shadow-eco">
                  <div className="p-2 border-b border-border">
                    <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground leading-none mt-1">{user.email}</p>
                  </div>
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="flex items-center space-x-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={isActive(item.href) ? "eco" : "ghost"}
                      className="w-full justify-start flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
              {user && (
                <Button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  variant="destructive"
                  className="w-full justify-start flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;