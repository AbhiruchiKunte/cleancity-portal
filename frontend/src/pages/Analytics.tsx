import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
        BarChart3,
        TrendingUp,
        Map,
        Users,
        Recycle,
        Target,
        Activity,
        ArrowUp,
        ArrowDown,
        MapPin,
        Calendar,
        Globe
} from 'lucide-react';

// Chart.js imports
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Simulated complex data for charts/tables
const keyMetrics = [
    { label: 'Total Uploads', value: '1,247', change: '+12%', icon: TrendingUp, color: 'text-primary' },
    { label: 'Avg. Validation Time', value: '4.5 hrs', change: '-8%', icon: Activity, color: 'text-accent' },
    { label: 'Active Contributors', value: '342', change: '+5%', icon: Users, color: 'text-primary' },
    { label: 'Top Category', value: 'Plastic', change: '45%', icon: Recycle, color: 'text-accent' },
];

const HotspotTrends: {
    location: string;
    trend: string;
    value: string;
    variant: 'default' | 'destructive' | 'outline' | 'secondary';
}[] = [
    { location: 'Downtown Park', trend: 'Increasing', value: '+15', variant: 'destructive' },
    { location: 'Main Street', trend: 'Decreasing', value: '-5', variant: 'default' },
    { location: 'River Walk', trend: 'Stable', value: '0', variant: 'secondary' },
    { location: 'Industrial Zone', trend: 'Increasing', value: '+22', variant: 'destructive' },
];

const categoryDistributionData = [
        { name: 'Plastic', percentage: 45, color: 'bg-[hsl(200,85%,60%)]' }, // Uses accent color
        { name: 'Paper', percentage: 22, color: 'bg-[hsl(142,76%,36%)]' },  // Uses primary color
        { name: 'Metal', percentage: 18, color: 'bg-gray-500' },
        { name: 'Organic', percentage: 10, color: 'bg-green-600' },
        { name: 'Other', percentage: 5, color: 'bg-red-500' },
];

// Chart datasets (mock data)
const doughnutData = {
    labels: categoryDistributionData.map(d => d.name),
    datasets: [
        {
            data: categoryDistributionData.map(d => d.percentage),
            backgroundColor: ['#60A5FA', '#FDE68A', '#9CA3AF', '#34D399', '#F87171'],
            hoverOffset: 6,
        }
    ]
};

const lineData = {
    labels: Array.from({length: 30}, (_,i) => `Day ${i+1}`),
    datasets: [
        {
            label: 'Uploads',
            data: Array.from({length: 30}, () => Math.floor(Math.random()*50)+20),
            borderColor: '#60A5FA',
            backgroundColor: 'rgba(96,165,250,0.2)',
            tension: 0.3,
            fill: true,
        }
    ]
};

const barData = {
    labels: HotspotTrends.map(h => h.location),
    datasets: [
        {
            label: 'Reports',
            data: HotspotTrends.map((h) => parseInt(h.value.replace('+','')) || 0),
            backgroundColor: ['#EF4444','#60A5FA','#9CA3AF','#F97316'],
        }
    ]
};

const Analytics = () => {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
            {/* Header (Keep the existing header) */}
            <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                    <div className="p-3 bg-gradient-clean rounded-full shadow-eco">
                        <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                    Environmental Analytics
                </h2>
                <p className="text-muted-foreground">
                    Deep dive into contribution metrics and pollution trends.
                </p>
            </div>
            
            {/* Key Metrics Grid (No change needed) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {keyMetrics.map((metric, index) => (
                    <Card key={index} className="transition-all hover:shadow-clean">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-1">
                                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                                <div className="text-xl font-bold text-foreground">{metric.value}</div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                            <Badge variant={metric.change.startsWith('+') ? 'default' : metric.change.startsWith('-') ? 'secondary' : 'outline'}>
                                {metric.change}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Trends and Distribution (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. GRAPHICAL CONTAINER: Category Distribution (Bar Chart Style) */}
                    <Card className="h-auto md:h-96">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Recycle className="h-5 w-5 text-primary" />
                                <span>Waste Type Distribution</span>
                            </CardTitle>
                            <CardDescription>Visual breakdown of submitted waste categories.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-auto md:h-64 space-y-4 pt-6">
                            <div className="w-full h-64">
                                <Doughnut data={doughnutData} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. GRAPHICAL CONTAINER: Upload Volume Over Time (Line Chart Style) */}
                    <Card className="h-auto md:h-96">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span>Daily Upload Trend</span>
                            </CardTitle>
                            <CardDescription>Contribution volume over the last 30 days.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center">
                            <div className="w-full h-full p-2">
                                <Line data={lineData} />
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* 3. GRAPHICAL CONTAINER: Geographical Activity (Map/Density Style) */}
                    <Card className="h-auto md:h-96">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span>Geographical Density</span>
                            </CardTitle>
                            <CardDescription>Visualization of reported locations on a city map.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center">
                            <div className="w-full h-full p-2">
                                <Bar data={barData} />
                            </div>
                        </CardContent>
                    </Card>

                </div> {/* End of lg:col-span-2 */}

                {/* Sidebar Metrics (1/3 width) - No change needed here */}
                <div className="space-y-8">
                    {/* 3. Hotspot Trend List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Map className="h-5 w-5" />
                                <span>Hotspot Activity</span>
                            </CardTitle>
                            <CardDescription>Recent change in reported waste volume.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {HotspotTrends.map((hotspot, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                                    <p className="font-medium text-foreground text-sm">{hotspot.location}</p>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant={hotspot.variant}>
                                            {hotspot.trend}
                                        </Badge>
                                        <span className="text-sm font-semibold">
                                            {hotspot.trend === 'Increasing' ? <ArrowUp className="inline h-4 w-4 text-destructive" /> : hotspot.trend === 'Decreasing' ? <ArrowDown className="inline h-4 w-4 text-primary" /> : null}
                                            {hotspot.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    {/* 4. Top Contributors of the Week */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Target className="h-5 w-5" />
                                <span>Weekly Top Users</span>
                            </CardTitle>
                            <CardDescription>Users with the highest uploads.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Simulated list, similar to leaderboard structure */}
                            {['EcoWarrior Sarah (45)', 'GreenHero Mike (38)', 'CleanCity Anna (32)'].map((user, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border-b border-border last:border-b-0">
                                    <span className="text-foreground">{user.split(' (')[0]}</span>
                                    <Badge variant="outline" className="bg-primary-glow text-white">
                                        {user.split('(')[1].replace(')', '')} uploads
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Analytics;