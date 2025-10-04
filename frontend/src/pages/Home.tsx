import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Map, 
  Trophy, 
  Camera, 
  Globe, 
  Users, 
  TrendingUp,
  Leaf,
  Recycle,
  Shield
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: "AI-Powered Classification",
      description: "Upload waste images and let our advanced AI instantly classify them into categories like plastic, metal, paper, and more."
    },
    {
      icon: Map,
      title: "Interactive Pollution Map",
      description: "Visualize pollution hotspots in your city with real-time data and contribute to cleaner communities."
    },
    {
      icon: Users,
      title: "Community Leaderboard",
      description: "Join fellow eco-warriors and compete for the top spot in making your city cleaner and greener."
    },
    {
      icon: TrendingUp,
      title: "Impact Analytics",
      description: "Track your environmental impact with detailed analytics and see how you're helping create a sustainable future."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Images Classified" },
    { number: "500+", label: "Active Contributors" },
    { number: "50+", label: "Cities Covered" },
    { number: "2,500kg", label: "Waste Recycled" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container relative mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Building Cleaner Cities
                <br />
                Together
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Use AI-powered waste classification to identify pollution, track environmental impact, and join a community of eco-warriors making real change in cities worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/upload">
                  <Button size="lg" variant="clean" className="w-full sm:w-auto">
                    <Upload className="mr-2 h-5 w-5" />
                    Start Contributing
                  </Button>
                </Link>
                <Link to="/map">
                  <Button size="lg" variant="clean" className="w-full sm:w-auto">
                    <Map className="mr-2 h-5 w-5" />
                    Explore Map
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-glow">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        {stat.number}
                      </div>
                      <div className="text-white/80 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-clean rounded-full shadow-eco">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Environmental Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make a meaningful difference in your community's environmental health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-eco transition-all duration-300 animate-slide-up border-0 bg-gradient-eco">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-gradient-clean rounded-full shadow-clean group-hover:shadow-glow transition-all duration-300">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-eco">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                <div className="p-2 bg-gradient-clean rounded-lg shadow-clean">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div className="p-2 bg-gradient-clean rounded-lg shadow-clean">
                  <Recycle className="h-6 w-6 text-white" />
                </div>
                <div className="p-2 bg-gradient-clean rounded-lg shadow-clean">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of environmental champions who are already making their cities cleaner, one photo at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button size="lg" variant="hero" className="w-full sm:w-auto">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Your First Image
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button size="lg" variant="clean" className="w-full sm:w-auto">
                  <Trophy className="mr-2 h-5 w-5" />
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;