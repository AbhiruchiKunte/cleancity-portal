import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map as MapIcon, 
  MapPin, 
  Filter, 
  Layers, 
  TrendingUp,
  Calendar,
  Users,
  Target
} from 'lucide-react';

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Simulated pollution data
  const pollutionStats = [
    { label: "Total Reports", value: "1,247", icon: MapPin, color: "text-blue-600" },
    { label: "This Week", value: "89", icon: Calendar, color: "text-green-600" },
    { label: "Contributors", value: "342", icon: Users, color: "text-purple-600" },
    { label: "Hotspots", value: "23", icon: Target, color: "text-red-600" },
  ];

  const wasteTypes = [
    { type: "Plastic", count: 456, color: "bg-blue-500" },
    { type: "Metal", count: 234, color: "bg-gray-500" },
    { type: "Paper", count: 189, color: "bg-yellow-500" },
    { type: "Organic", count: 167, color: "bg-green-500" },
    { type: "Glass", count: 123, color: "bg-purple-500" },
    { type: "Other", count: 78, color: "bg-red-500" },
  ];

  useEffect(() => {
    // Initialize Leaflet map when component mounts
    // This is a placeholder - actual Leaflet integration will be added later
    if (mapRef.current) {
      // Leaflet map initialization will go here
      console.log('Map container ready for Leaflet integration');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-clean rounded-full shadow-eco">
            <MapIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Pollution Map
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore real-time pollution data and hotspots in your city. See where waste has been reported and track cleanup progress.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Map Controls */}
          <Card className="animate-slide-up">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Interactive Map</CardTitle>
                  <CardDescription>Click markers to view detailed waste information</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4 mr-2" />
                    Layers
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Map Container - Leaflet will be integrated here */}
              <div 
                ref={mapRef}
                className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden"
              >
                {/* Placeholder map content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <MapIcon className="h-16 w-16 text-primary mx-auto opacity-50" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Interactive Map Loading...
                      </h3>
                      <p className="text-muted-foreground">
                        Leaflet map integration will display pollution markers,<br />
                        heatmap overlays, and marker clustering here.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulated map markers */}
                <div className="absolute top-20 left-20 w-4 h-4 bg-red-500 rounded-full animate-eco-pulse"></div>
                <div className="absolute top-32 right-24 w-4 h-4 bg-blue-500 rounded-full animate-eco-pulse"></div>
                <div className="absolute bottom-24 left-32 w-4 h-4 bg-yellow-500 rounded-full animate-eco-pulse"></div>
                <div className="absolute bottom-32 right-20 w-4 h-4 bg-green-500 rounded-full animate-eco-pulse"></div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent Reports</span>
              </CardTitle>
              <CardDescription>Latest waste reports from the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gradient-eco rounded-lg">
                    <div className="w-12 h-12 bg-gradient-clean rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">
                        {['🥤', '🥫', '📄', '🍎'][index]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {['Plastic bottles found', 'Metal cans reported', 'Paper waste spotted', 'Organic waste detected'][index]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {['Downtown Park', 'Main Street', 'City Center', 'Riverside'][index]} • {index + 1}h ago
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {['High', 'Medium', 'Low', 'Medium'][index]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Real-time pollution data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pollutionStats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-clean rounded-lg">
                    <stat.icon className={`h-4 w-4 text-white`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-lg text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Waste Distribution */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Waste Distribution</CardTitle>
              <CardDescription>Types of waste reported</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {wasteTypes.map((waste, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{waste.type}</span>
                    <span className="text-sm text-muted-foreground">{waste.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${waste.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${(waste.count / 456) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get involved in cleanup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="eco" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Report New Waste
              </Button>
              <Button variant="clean" className="w-full">
                <Target className="mr-2 h-4 w-4" />
                Join Cleanup Event
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;