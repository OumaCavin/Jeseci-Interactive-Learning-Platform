/**
 * Enterprise Proxy Analytics Dashboard
 * Jeseci Interactive Learning Platform
 * 
 * Real-time analytics dashboard for monitoring and analyzing
 * educational proxy performance, user engagement, and system health
 * 
 * @author Cavin Otieno
 * @version 2.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
    TrendingUp, TrendingDown, Users, Clock, AlertTriangle, 
    CheckCircle, XCircle, Wifi, Shield, Zap, Brain, 
    Activity, BarChart3, PieChart as PieChartIcon, Settings
} from 'lucide-react';

// Real-time data hook
const useRealTimeData = (endpoint, interval = 5000) => {
    const [data, setData] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket(`ws://${window.location.host}/ws/analytics`);
            
            ws.onopen = () => {
                setIsConnected(true);
                ws.send(JSON.stringify({ type: 'subscribe', endpoint }));
            };
            
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === endpoint) {
                    setData(prevData => {
                        const newData = [...prevData, message.payload];
                        // Keep only last 100 data points
                        return newData.slice(-100);
                    });
                }
            };
            
            ws.onclose = () => {
                setIsConnected(false);
                // Reconnect after 5 seconds
                setTimeout(connectWebSocket, 5000);
            };
            
            return ws;
        };

        const ws = connectWebSocket();
        return () => ws && ws.close();
    }, [endpoint, interval]);

    return { data, isConnected };
};

// Performance Metrics Card
const PerformanceCard = ({ title, value, change, trend, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        red: 'bg-red-50 text-red-600 border-red-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };

    const trendIcon = trend === 'up' ? TrendingUp : TrendingDown;
    const TrendIcon = trendIcon;

    return (
        <div className={`p-6 rounded-lg border ${colorClasses[color]} bg-white shadow-sm`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Icon className="w-8 h-8" />
                    <TrendIcon className={`w-5 h-5 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last hour</span>
            </div>
        </div>
    );
};

// Educational Context Distribution Chart
const EducationalContextChart = ({ data }) => {
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Context Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// Performance Timeline Chart
const PerformanceTimelineChart = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="responseTime" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Response Time (ms)"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="throughput" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Throughput (req/min)"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="errorRate" 
                        stroke="#EF4444" 
                        strokeWidth={2}
                        name="Error Rate (%)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// Learning Analytics Radar Chart
const LearningAnalyticsRadar = ({ data }) => {
    const radarData = [
        { subject: 'Engagement', A: data.engagement, fullMark: 100 },
        { subject: 'Completion', A: data.completion, fullMark: 100 },
        { subject: 'Retention', A: data.retention, fullMark: 100 },
        { subject: 'Performance', A: data.performance, fullMark: 100 },
        { subject: 'Satisfaction', A: data.satisfaction, fullMark: 100 },
        { subject: 'Accessibility', A: data.accessibility, fullMark: 100 }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Analytics Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                        name="Score" 
                        dataKey="A" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.3}
                    />
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Real-time Activity Monitor
const ActivityMonitor = ({ activities }) => {
    const getActivityColor = (type) => {
        const colors = {
            'api_request': 'bg-blue-100 text-blue-800',
            'auth_success': 'bg-green-100 text-green-800',
            'auth_failure': 'bg-red-100 text-red-800',
            'content_access': 'bg-purple-100 text-purple-800',
            'analytics_update': 'bg-yellow-100 text-yellow-800',
            'security_alert': 'bg-orange-100 text-orange-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Activity Monitor</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${getActivityColor(activity.type)}`}>
                                {activity.type.replace('_', ' ').toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-900">{activity.description}</span>
                        </div>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// System Health Monitor
const SystemHealthMonitor = ({ healthData }) => {
    const getStatusColor = (status) => {
        const colors = {
            'healthy': 'text-green-600',
            'warning': 'text-yellow-600',
            'critical': 'text-red-600'
        };
        return colors[status] || 'text-gray-600';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'healthy': CheckCircle,
            'warning': AlertTriangle,
            'critical': XCircle
        };
        return icons[status] || AlertTriangle;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Monitor</h3>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(healthData).map(([service, data]) => {
                    const StatusIcon = getStatusIcon(data.status);
                    return (
                        <div key={service} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900 capitalize">{service}</h4>
                                <StatusIcon className={`w-5 h-5 ${getStatusColor(data.status)}`} />
                            </div>
                            <div className="mt-2 space-y-1">
                                <div className="text-sm text-gray-600">
                                    Uptime: {data.uptime}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Response Time: {data.responseTime}ms
                                </div>
                                <div className="text-sm text-gray-600">
                                    Error Rate: {data.errorRate}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Educational Insights Panel
const EducationalInsightsPanel = ({ insights }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Educational Insights</h3>
            <div className="space-y-4">
                {insights.map((insight, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <Brain className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <h4 className="font-medium text-blue-900">{insight.title}</h4>
                                <p className="text-sm text-blue-700 mt-1">{insight.description}</p>
                                <div className="mt-2 flex items-center space-x-2">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {insight.category}
                                    </span>
                                    <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">
                                        Confidence: {insight.confidence}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Dashboard Component
const ProxyAnalyticsDashboard = () => {
    const [timeRange, setTimeRange] = useState('1h');
    const [selectedService, setSelectedService] = useState('all');
    
    // Real-time data hooks
    const { data: performanceData, isConnected: performanceConnected } = useRealTimeData('performance');
    const { data: educationalData, isConnected: educationalConnected } = useRealTimeData('educational');
    const { data: activityData, isConnected: activityConnected } = useRealTimeData('activities');

    // Mock data for demonstration
    const mockPerformanceMetrics = {
        totalRequests: 45231,
        responseTime: 245,
        throughput: 89,
        errorRate: 2.1,
        activeUsers: 1247,
        uptime: '99.9%'
    };

    const mockEducationalContext = [
        { name: 'K-12 Students', value: 35 },
        { name: 'University', value: 28 },
        { name: 'Professional', value: 22 },
        { name: 'Special Needs', value: 15 }
    ];

    const mockLearningAnalytics = {
        engagement: 87,
        completion: 76,
        retention: 84,
        performance: 91,
        satisfaction: 89,
        accessibility: 93
    };

    const mockHealthData = {
        api: { status: 'healthy', uptime: '99.9%', responseTime: 245, errorRate: 2.1 },
        auth: { status: 'healthy', uptime: '99.8%', responseTime: 156, errorRate: 0.8 },
        content: { status: 'warning', uptime: '99.5%', responseTime: 567, errorRate: 5.2 },
        analytics: { status: 'healthy', uptime: '99.7%', responseTime: 234, errorRate: 1.2 },
        websocket: { status: 'healthy', uptime: '99.6%', responseTime: 89, errorRate: 0.5 }
    };

    const mockInsights = [
        {
            title: 'Optimal Learning Time Detected',
            description: 'Students show 23% higher engagement between 10 AM - 12 PM. Consider scheduling important content during this window.',
            category: 'Engagement Pattern',
            confidence: 87
        },
        {
            title: 'Content Difficulty Adjustment Needed',
            description: 'Mathematics content showing 15% lower completion rate. AI suggests reducing complexity for middle school level.',
            category: 'Content Optimization',
            confidence: 92
        },
        {
            title: 'Accessibility Enhancement Opportunity',
            description: '12% of users could benefit from enhanced accessibility features. Implementing audio descriptions recommended.',
            category: 'Accessibility',
            confidence: 78
        }
    ];

    const mockActivities = [
        { type: 'api_request', description: 'Learning content request from User #1234', timestamp: '2s ago' },
        { type: 'auth_success', description: 'Student login - University context detected', timestamp: '5s ago' },
        { type: 'content_access', description: 'Math quiz opened by Grade 8 student', timestamp: '8s ago' },
        { type: 'analytics_update', description: 'Performance metrics updated', timestamp: '12s ago' },
        { type: 'security_alert', description: 'Unusual access pattern detected - IP 192.168.1.100', timestamp: '15s ago' }
    ];

    const getConnectionStatus = () => {
        const connected = performanceConnected && educationalConnected && activityConnected;
        return {
            status: connected ? 'connected' : 'disconnected',
            message: connected ? 'Real-time data active' : 'Connection issues detected'
        };
    };

    const connectionStatus = getConnectionStatus();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Enterprise Proxy Analytics Dashboard
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Real-time monitoring and insights for educational proxy intelligence platform
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                            connectionStatus.status === 'connected' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            <Wifi className="w-4 h-4" />
                            <span>{connectionStatus.message}</span>
                        </div>
                        <select 
                            value={timeRange} 
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="1h">Last Hour</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <PerformanceCard
                    title="Total Requests"
                    value={mockPerformanceMetrics.totalRequests.toLocaleString()}
                    change={12.5}
                    trend="up"
                    icon={Activity}
                    color="blue"
                />
                <PerformanceCard
                    title="Avg Response Time"
                    value={`${mockPerformanceMetrics.responseTime}ms`}
                    change={-8.3}
                    trend="down"
                    icon={Clock}
                    color="green"
                />
                <PerformanceCard
                    title="Active Users"
                    value={mockPerformanceMetrics.activeUsers.toLocaleString()}
                    change={23.1}
                    trend="up"
                    icon={Users}
                    color="purple"
                />
                <PerformanceCard
                    title="Error Rate"
                    value={`${mockPerformanceMetrics.errorRate}%`}
                    change={-15.2}
                    trend="down"
                    icon={XCircle}
                    color="red"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <PerformanceTimelineChart data={performanceData} />
                <EducationalContextChart data={mockEducationalContext} />
            </div>

            {/* Learning Analytics and System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <LearningAnalyticsRadar data={mockLearningAnalytics} />
                <SystemHealthMonitor healthData={mockHealthData} />
            </div>

            {/* Activity Monitor and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ActivityMonitor activities={mockActivities} />
                <EducationalInsightsPanel insights={mockInsights} />
            </div>

            {/* Export and Settings */}
            <div className="mt-8 flex justify-end space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <BarChart3 className="w-4 h-4" />
                    <span>Export Report</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                    <Settings className="w-4 h-4" />
                    <span>Configure</span>
                </button>
            </div>
        </div>
    );
};

export default ProxyAnalyticsDashboard;