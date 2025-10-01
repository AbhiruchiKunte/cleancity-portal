import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  Upload as UploadIcon, 
  Camera, 
  MapPin, 
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Trash2,
  Recycle
} from 'lucide-react';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState<{
    category: string;
    confidence: number;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const wasteCategories = {
    plastic: { icon: "🥤", color: "text-blue-600", name: "Plastic Waste" },
    metal: { icon: "🥫", color: "text-gray-600", name: "Metal Waste" },
    paper: { icon: "📄", color: "text-yellow-600", name: "Paper Waste" },
    organic: { icon: "🍎", color: "text-green-600", name: "Organic Waste" },
    glass: { icon: "🍾", color: "text-purple-600", name: "Glass Waste" },
    other: { icon: "🗑️", color: "text-red-600", name: "Other Waste" }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setClassification(null);
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location captured!",
            description: "Your location has been recorded for mapping.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location access denied",
            description: "Please enable location access or pin manually on the map.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  const classifyImage = async () => {
    if (!selectedFile) return;

    setIsClassifying(true);
    try {
      // Simulate AI classification - replace with actual TensorFlow.js model
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const categories = Object.keys(wasteCategories);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
      
      setClassification({
        category: randomCategory,
        confidence: confidence
      });

      toast({
        title: "Classification complete!",
        description: `Identified as ${wasteCategories[randomCategory as keyof typeof wasteCategories].name}`,
      });
    } catch (error) {
      toast({
        title: "Classification failed",
        description: "Failed to classify the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClassifying(false);
    }
  };

  const handleUpload = async () => {
  if (!selectedFile || !classification || !location) {
    toast({
      title: "Missing information",
      description: "Please select a file, classify it, and capture location first.",
      variant: "destructive",
    });
    return;
  }

  setIsUploading(true);
  try {
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());

const response = await fetch("http://localhost:3000/api/upload", {
  method: "POST",
  body: formData,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // 👈 send JWT
  },
});

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const savedRecord = await response.json();

    toast({
      title: "Upload successful!",
      description: `Record stored: ${savedRecord.label} (${(savedRecord.confidence * 100).toFixed(1)}%)`,
    });

    // Reset form
    setSelectedFile(null);
    setPreview(null);
    setClassification(null);
    setLocation(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  } catch (error) {
    console.error("Upload error:", error);
    toast({
      title: "Upload failed",
      description: "Failed to upload the image. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-clean rounded-full shadow-eco">
            <UploadIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Upload Waste Image
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Help us map pollution in your city. Upload an image and our AI will classify the waste type automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Image Upload</span>
            </CardTitle>
            <CardDescription>
              Take a photo or select an image from your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Input */}
            <div className="space-y-4">
              <Label htmlFor="file-upload">Select Image</Label>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="eco"
                  onClick={handleCameraCapture}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
                <Button
                  variant="clean"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label>Location</Label>
              <Button
                variant={location ? "default" : "outline"}
                onClick={getLocation}
                className="w-full"
                disabled={!!location}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {location ? "Location Captured" : "Get Current Location"}
              </Button>
              {location && (
                <p className="text-sm text-muted-foreground">
                  Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                </p>
              )}
            </div>

            {/* Classification */}
            {selectedFile && (
              <div className="space-y-4">
                <Button
                  variant="hero"
                  onClick={classifyImage}
                  disabled={isClassifying}
                  className="w-full"
                >
                  {isClassifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Classifying...
                    </>
                  ) : (
                    <>
                      <Recycle className="mr-2 h-4 w-4" />
                      Classify Image
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !classification || isUploading}
              className="w-full"
              variant="eco"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Contribution
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Preview & Classification</span>
            </CardTitle>
            <CardDescription>
              Preview your image and AI classification results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {preview ? (
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-clean"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      setClassification(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Classification Result */}
                {classification && (
                  <div className="p-4 bg-gradient-eco rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">
                        {wasteCategories[classification.category as keyof typeof wasteCategories]?.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {wasteCategories[classification.category as keyof typeof wasteCategories]?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {(classification.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Select an image to see the preview
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;