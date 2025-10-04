import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Key, 
  CheckCircle, 
  XCircle, 
  Download, 
  Calendar,
  Filter,
  Search,
  TrendingUp,
  MapPin,
  Users,
  AlertTriangle,
  Eye, 
  EyeOff
} from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('adminAuthenticated') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [adminToken, setAdminToken] = useState<string>(() => {
    try { return sessionStorage.getItem('adminToken') || ''; } catch (e) { return ''; }
  });
  const [useLiveData, setUseLiveData] = useState(false);
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  // Simulated admin data
  const pendingRecords = [
    {
      id: 1,
      image: '/api/placeholder/150/150',
      category: 'Plastic',
      location: 'Downtown Park',
      timestamp: '2024-01-15 14:30',
      contributor: 'EcoWarrior Sarah',
      confidence: 0.89,
      status: 'pending'
    },
    {
      id: 2,
      image: '/api/placeholder/150/150',
      category: 'Metal',
      location: 'Main Street',
      timestamp: '2024-01-15 13:45',
      contributor: 'GreenHero Mike',
      confidence: 0.95,
      status: 'pending'
    },
    {
      id: 3,
      image: '/api/placeholder/150/150',
      category: 'Paper',
      location: 'City Center',
      timestamp: '2024-01-15 12:15',
      contributor: 'CleanCity Anna',
      confidence: 0.76,
      status: 'pending'
    }
  ];

  const hotspotSummary = [
    { location: 'Downtown Park', reports: 45, trend: 'increasing' },
    { location: 'Main Street', reports: 32, trend: 'stable' },
    { location: 'River Walk', reports: 28, trend: 'decreasing' },
    { location: 'Industrial District', reports: 67, trend: 'increasing' }
  ];

  const systemStats = [
    { label: 'Total Records', value: '1,247', icon: Shield },
    { label: 'Validated', value: '1,089', icon: CheckCircle },
    { label: 'Pending', value: '158', icon: AlertTriangle },
    { label: 'Active Users', value: '342', icon: Users }
  ];

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        try { sessionStorage.setItem('adminAuthenticated', 'true'); } catch (e) {}
        if (data.token) {
          setAdminToken(data.token);
          try { sessionStorage.setItem('adminToken', data.token); } catch (e) {}
        }
        toast({
          title: "Authentication successful",
          description: "Welcome to the admin dashboard!",
        });
      } else {
        toast({
          title: "Authentication failed",
          description: data.message || "Incorrect admin details. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to connect to server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setAdminPassword(""); 
    }
  };

  const handleValidateRecord = (recordId: number, isValid: boolean) => {
    // If using live data, call backend to update record
    if (useLiveData && adminToken) {
      fetch(`http://localhost:3000/api/admin/validate/${recordId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ action: isValid ? 'approve' : 'reject', notes: '' }),
      }).then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          toast({ title: isValid ? 'Record validated' : 'Record rejected', description: data.message });
          // refresh pending list
          fetchPending();
        } else {
          toast({ title: 'Error', description: data.message || 'Validation failed', variant: 'destructive' });
        }
      }).catch(() => {
        toast({ title: 'Error', description: 'Unable to reach server', variant: 'destructive' });
      });
    } else {
      toast({
        title: isValid ? "Record validated" : "Record rejected",
        description: `Record #${recordId} has been ${isValid ? 'approved' : 'rejected'}.`,
      });
    }
  };

  const handleExportCSV = () => {
    if (useLiveData && adminToken) {
      // initiate download
      const url = `http://localhost:3000/api/admin/export`;
      fetch(url, { headers: { Authorization: `Bearer ${adminToken}` } }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast({ title: 'Export failed', description: err.message || 'Server error', variant: 'destructive' });
          return;
        }
        const blob = await res.blob();
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = 'cleancity_export.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(href);
        toast({ title: 'Export started', description: 'CSV download should start shortly.' });
      }).catch(() => {
        toast({ title: 'Error', description: 'Unable to connect to server', variant: 'destructive' });
      });
    } else {
      toast({
        title: "Export initiated",
        description: "CSV file will be downloaded shortly (static data).",
      });
    }
  };

  const fetchPending = async () => {
    if (!useLiveData || !adminToken) return;
    try {
      const res = await fetch('http://localhost:3000/api/admin/pending', { headers: { Authorization: `Bearer ${adminToken}` } });
      if (!res.ok) return;
      const data = await res.json();
      setPendingList(data);
    } catch (e) {
      // ignore
    }
  };

  // When authentication state or stored token changes, ensure adminToken is set from sessionStorage
  useEffect(() => {
    if (isAuthenticated && !adminToken) {
      try {
        const stored = sessionStorage.getItem('adminToken') || '';
        if (stored) setAdminToken(stored);
      } catch (e) {}
    }
  }, [isAuthenticated]);

  // Auto-fetch pending records when live data is enabled 
  useEffect(() => {
    if (isAuthenticated && useLiveData && adminToken) {
      fetchPending();
    }
  }, [isAuthenticated, useLiveData, adminToken]);

  const handleGenerateReport = async () => {
    if (!useLiveData || !adminToken) {
      toast({ title: 'Report', description: 'Static report generation not implemented in demo.' });
      return;
    }
    try {
      toast({ title: 'Generating report', description: 'This may take a few seconds.' });
      const res = await fetch('http://localhost:3000/api/admin/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Report failed', description: data.message || 'Server error', variant: 'destructive' });
        return;
      }
      toast({ title: 'Report generated', description: 'Check console for report output.' });
      console.info('AI Report:', data.report || data);
    } catch (e) {
      toast({ title: 'Error', description: 'Unable to generate report', variant: 'destructive' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-clean rounded-full shadow-eco">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle>Admin Authentication</CardTitle>
            <CardDescription>
              Enter your admin password to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 relative">
              <Label htmlFor="admin-password">Admin Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              onClick={handleLogin} 
              className="w-full" 
              variant="admin"
              disabled={!adminPassword.trim()}
            >
              <Key className="mr-2 h-4 w-4" />
              Authenticate
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in relative">
        <div className="absolute right-0 top-0 md:right-4 md:top-0">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-muted-foreground">Static</label>
            <input type="checkbox" checked={useLiveData} onChange={(e) => { setUseLiveData(e.target.checked); if (e.target.checked) fetchPending(); }} />
            <label className="text-sm text-muted-foreground">Live</label>
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-clean rounded-full shadow-eco">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Admin Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Monitor system performance, validate reports, and manage community contributions.
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {systemStats.map((stat, index) => (
          <Card key={index} className="animate-slide-up">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Records Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Record Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-filter">Date Range</Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-filter">Category</Label>
                  <select
                    id="category-filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="all">All Categories</option>
                    <option value="plastic">Plastic</option>
                    <option value="metal">Metal</option>
                    <option value="paper">Paper</option>
                    <option value="organic">Organic</option>
                    <option value="glass">Glass</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button variant="admin" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Records */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Pending Validation</span>
              </CardTitle>
              <CardDescription>
                Review and validate community-submitted waste reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(useLiveData ? pendingList : pendingRecords).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending records to validate
                  </div>
                ) : (
                  (useLiveData ? pendingList : pendingRecords).map((record: any, idx: number) => (
                    <div key={record._id || record.id || idx} className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-gradient-eco rounded-lg">
                      <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={record.image_url || `https://via.placeholder.com/80/22C55E/FFFFFF?text=${(record.category||record.label||'')?.[0]||'W'}`}
                          alt="Waste record"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                          <Badge variant="secondary">{record.category || record.label}</Badge>
                          <Badge variant={(record.confidence || 0) > 0.8 ? "default" : "outline"}>
                            {Math.round((record.confidence || 0) * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {record.contributor || (record.userId || '').toString()}
                        </p>
                        <p className="text-sm text-muted-foreground break-words">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {(record.location || `${record.lat || ''}, ${record.lng || ''}`)}
                        </p>
                        {record.timestamp && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(record.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleValidateRecord(record._id || record.id || idx, true)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleValidateRecord(record._id || record.id || idx, false)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Administrative tools and exports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="admin" className="w-full" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="clean" className="w-full" onClick={handleGenerateReport}>
                <Calendar className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('analytics')}>
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={() => {
                  setIsAuthenticated(false);
                  try { sessionStorage.removeItem('adminAuthenticated'); } catch (e) {}
                  navigate('/admin');
                }}
              >
                <Key className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>

          {/* Hotspot Summary */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Pollution Hotspots</span>
              </CardTitle>
              <CardDescription>Areas requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hotspotSummary.map((hotspot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-eco rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{hotspot.location}</p>
                      <p className="text-sm text-muted-foreground">{hotspot.reports} reports</p>
                    </div>
                    <Badge 
                      variant={
                        hotspot.trend === 'increasing' ? 'destructive' : 
                        hotspot.trend === 'decreasing' ? 'default' : 
                        'secondary'
                      }
                    >
                      {hotspot.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Real-time system metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">API Response Time</span>
                  <span className="font-medium text-foreground">45ms</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Storage Usage</span>
                  <span className="font-medium text-foreground">67%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "67%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Classification Accuracy</span>
                  <span className="font-medium text-foreground">94%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;