import { Leaf, Heart, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gradient-eco border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-clean rounded-lg shadow-clean">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">
                Clean<span className="text-primary">City</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering communities to create cleaner, greener cities through AI-powered waste classification and collaborative environmental action.
            </p>    
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              {['Home', 'Upload Waste', 'View Map', 'Leaderboard', 'Admin Panel'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Our Impact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Reduce pollution</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Promote recycling</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Community awareness</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Cleaner environment</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">admin@cleancity.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">+91 88444 45546</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Global Community</span>
              </div>
            </div>
            <Button variant="eco" size="sm" className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              Join the Movement
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 CleanCity. All rights reserved. Building a sustainable future together.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Carbon Neutral
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;