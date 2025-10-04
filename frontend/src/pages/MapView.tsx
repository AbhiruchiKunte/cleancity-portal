// MapView.tsx
import React, { useEffect, useState, useRef } from "react";
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Heatmap as OLHeatmapLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, TrendingUp, Calendar, Users, Target, Globe } from 'lucide-react';

const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const heatSourceRef = useRef<VectorSource | null>(null);
  const heatLayerRef = useRef<OLHeatmapLayer | null>(null);
  const [hotspots, setHotspots] = useState<any[]>([]);

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
    if (mapRef.current) return;

    const raster = new TileLayer({ source: new OSM() });
    const initialHeatSource = new VectorSource();
    heatSourceRef.current = initialHeatSource;

    const heat = new OLHeatmapLayer({
      source: initialHeatSource,
      blur: 3,
      radius: 5,
      weight: (feat: Feature) => {
        const c = feat.get('count') || 1;
        return 1; // Always max weight for visibility
      },
      gradient: [
        'rgba(0,0,0,0)',
        'rgba(139,0,0,0.4)',
        'rgba(178,0,0,0.7)',
        'rgba(220,20,20,0.9)',
        'rgba(255,0,0,1)'
      ] as any,
      opacity: 1,
    });

    heatLayerRef.current = heat;

    const map = new Map({
      target: mapContainerRef.current || undefined,
      layers: [raster, heat],
      view: new View({ center: fromLonLat([79.0882, 21.1458]), zoom: 5 })
    });

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  const populateHeatmap = (hotspotsArr: any[]) => {
    if (!heatSourceRef.current) return;
    const src = heatSourceRef.current;
    src.clear();

    console.log('Populating heatmap with', hotspotsArr.length, 'hotspots');

    hotspotsArr.forEach((h, idx) => {
      try {
        const feature = new Feature({
          geometry: new Point(fromLonLat([h.lng, h.lat])),
          count: h.count || 1
        });
        feature.set('count', h.count || 1);
        src.addFeature(feature);
        console.log(`Added hotspot ${idx + 1}: lat=${h.lat}, lng=${h.lng}, count=${h.count}`);
      } catch (e) {
        console.warn("Skipped malformed point", e);
      }
    });

    console.log('Total features in source:', src.getFeatures().length);
    src.changed();

    // Zoom to show the hotspots if any exist
    if (hotspotsArr.length > 0 && mapRef.current) {
      const firstHotspot = hotspotsArr[0];
      mapRef.current.getView().animate({
        center: fromLonLat([firstHotspot.lng, firstHotspot.lat]),
        zoom: 12,
        duration: 1000
      });
    }
  };

  const fetchHotspots = async () => {
    try {
      // Use full URL if backend is on different port
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const url = `${baseUrl}/api/hotspots?validated=false&precision=3`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        console.warn('Hotspot fetch failed with status:', res.status);
        const text = await res.text();
        console.warn('Response:', text.substring(0, 200));
        return;
      }
      
      const data = await res.json();
      console.log('Fetched hotspots:', data.length, 'records');
      console.log('Hotspot data:', data);
      setHotspots(data || []);
      populateHeatmap(data || []);
    } catch (e) {
      console.error('Failed to fetch hotspots:', e);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    fetchHotspots();
  }, []);

  useEffect(() => {
    const iv = setInterval(() => fetchHotspots(), 10000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-clean rounded-full shadow-eco">
            <Globe className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Pollution Map</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore real-time pollution data and hotspots in your city. See where waste has been reported and track cleanup progress.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="animate-slide-up">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Interactive Map</CardTitle>
                  <CardDescription>Heatmap shows pending and rejected records</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <Button variant="outline" size="sm" onClick={() => fetchHotspots()}>Refresh</Button>
                  <Button variant="outline" size="sm"><Layers className="h-4 w-4 mr-2" />Layers</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={mapContainerRef} className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden" />
            </CardContent>
          </Card>

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
                      <span className="text-white text-xl">{['🥤', '🥫', '📄', '🍎'][index]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {['Plastic bottles found', 'Metal cans reported', 'Paper waste spotted', 'Organic waste detected'][index]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {['Downtown Park', 'Main Street', 'City Center', 'Riverside'][index]} • {index + 1}h ago
                      </p>
                    </div>
                    <Badge variant="secondary">{['High', 'Medium', 'Low', 'Medium'][index]}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Real-time pollution data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pollutionStats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-clean rounded-lg">
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-lg text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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
                    <div className={`${waste.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${(waste.count / 456) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get involved in cleanup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="eco" className="w-full"><MapPin className="mr-2 h-4 w-4" />Report New Waste</Button>
              <Button variant="clean" className="w-full"><Target className="mr-2 h-4 w-4" />Join Cleanup Event</Button>
              <Button variant="outline" className="w-full"><TrendingUp className="mr-2 h-4 w-4" />View Analytics</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;