import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CpuChipIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  ServerIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
  BugAntIcon,
  WrenchScrewdriverIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAdminStore, AdminStats, Agent, RecentActivity, SystemHealth } from '../stores/adminStore';
import { useAuthStore } from '../stores/authStore';

interface AdminDashboardProps {
  // Props for customization if needed
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('users');
  
  const { user } = useAuthStore();
  const {
    stats,
    recentActivity,
    agents,
    systemHealth,
    users,
    content,
    analytics,
    isLoading,
    isAgentsLoading,
    error,
    loadAdminData,
    loadAgentData,
    refreshStats,
    handleAgentAction,
    createUser,
    updateUser,
    deleteUser,
    createContent,
    updateContent,
    deleteContent,
    exportData,
    resetError
  } = useAdminStore();

  useEffect(() => {
    loadAdminData();
    loadAgentData();
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshStats]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon, color: 'blue' },
    { id: 'users', name: 'Users', icon: UserGroupIcon, color: 'green' },
    { id: 'content', name: 'Content', icon: DocumentTextIcon, color: 'purple' },
    { id: 'learning', name: 'Learning Analytics', icon: AcademicCapIcon, color: 'orange' },
    { id: 'agents', name: 'AI Agents', icon: CpuChipIcon, color: 'pink' },
    { id: 'system', name: 'System Health', icon: ServerIcon, color: 'indigo' },
    { id: 'reports', name: 'Reports', icon: ArrowTrendingUpIcon, color: 'cyan' },
  ];

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      case 'offline': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours.toFixed(1)}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours.toFixed(1)}h`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: 'Total Users',
            value: stats?.totalUsers || 0,
            change: '+12%',
            changeType: 'increase',
            icon: UserGroupIcon,
            color: 'blue',
            description: 'Registered users'
          },
          {
            name: 'Active Users',
            value: stats?.activeUsers || 0,
            change: '+5%',
            changeType: 'increase',
            icon: BeakerIcon,
            color: 'green',
            description: 'Last 24 hours'
          },
          {
            name: 'Learning Paths',
            value: stats?.totalPaths || 0,
            change: '+3',
            changeType: 'increase',
            icon: AcademicCapIcon,
            color: 'purple',
            description: 'Published paths'
          },
          {
            name: 'Completion Rate',
            value: `${stats?.completionRate || 0}%`,
            change: '+2.1%',
            changeType: 'increase',
            icon: CheckCircleIcon,
            color: 'orange',
            description: 'Average completion'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-0 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                    <p className="text-sm text-gray-500 ml-1">from last month</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                <p className="text-sm text-gray-600">Real-time system monitoring</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${systemHealth?.overall_status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className={`text-sm font-medium ${getHealthStatusColor(systemHealth?.overall_status || 'unknown')}`}>
                  {systemHealth?.overall_status || 'Unknown'}
                </span>
              </div>
            </div>
            
            {systemHealth && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{systemHealth.system_metrics.cpu_usage}%</div>
                  <div className="text-xs text-gray-600">CPU Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{systemHealth.system_metrics.memory_usage}%</div>
                  <div className="text-xs text-gray-600">Memory</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{systemHealth.system_metrics.disk_usage}%</div>
                  <div className="text-xs text-gray-600">Disk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{systemHealth.system_metrics.network_latency}ms</div>
                  <div className="text-xs text-gray-600">Latency</div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Agents</h3>
              <CpuChipIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Running</span>
                <span className="font-semibold text-green-600">{stats?.activeAgents || 0}/{stats?.totalAgents || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasks in Queue</span>
                <span className="font-semibold text-blue-600">{stats?.agentTasks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Response</span>
                <span className="font-semibold text-purple-600">{stats?.responseTime || 0}s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((stats?.activeAgents || 0) / (stats?.totalAgents || 1)) * 100}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="bg-blue-500 h-2 rounded-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 bg-white border-0 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadAdminData()}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800"
              >
                <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-1.5 rounded-full ${getSeverityColor(activity.severity || 'low')}`}>
                    {activity.type === 'user_registration' && <UserGroupIcon className="h-4 w-4" />}
                    {activity.type === 'path_completion' && <AcademicCapIcon className="h-4 w-4" />}
                    {activity.type === 'agent_action' && <CpuChipIcon className="h-4 w-4" />}
                    {activity.type === 'system_alert' && <ExclamationTriangleIcon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    {activity.user && (
                      <p className="text-sm text-gray-600">{activity.user}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-6"
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Learning Path
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <UserGroupIcon className="h-4 w-4 mr-2" />
                Add New User
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CpuChipIcon className="h-4 w-4 mr-2" />
                Deploy Agent
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">High Memory Usage</p>
                    <p className="text-xs text-yellow-700">67.8% usage detected</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">All Agents Healthy</p>
                    <p className="text-xs text-green-700">6/8 agents running</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6">
      {/* Agent Control Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Agents Management</h2>
          <p className="text-sm text-gray-500">Monitor and control the multi-agent system</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => loadAgentData()}
            disabled={isAgentsLoading}
            className="flex items-center space-x-2"
          >
            <ArrowPathIcon className={`h-4 w-4 ${isAgentsLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>Deploy Agent</span>
          </Button>
        </div>
      </div>

      {/* Agent System Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: 'System Health',
            value: `${systemHealth?.health_score || 0}%`,
            subtext: 'Overall score',
            icon: ShieldCheckIcon,
            color: systemHealth?.overall_status === 'healthy' ? 'green' : 'yellow'
          },
          {
            name: 'Active Agents',
            value: `${stats?.activeAgents || 0}`,
            subtext: `of ${stats?.totalAgents || 0} total`,
            icon: CpuChipIcon,
            color: 'blue'
          },
          {
            name: 'Active Tasks',
            value: stats?.agentTasks || 0,
            subtext: 'in queue',
            icon: ClockIcon,
            color: 'purple'
          },
          {
            name: 'Active Sessions',
            value: systemHealth?.active_sessions || 0,
            subtext: 'learning sessions',
            icon: ChatBubbleLeftRightIcon,
            color: 'orange'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white border-0 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{metric.subtext}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                  <metric.icon className={`h-8 w-8 text-${metric.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Agent List and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white border-0 shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Agent Status</h3>
              <p className="text-sm text-gray-500">Real-time agent monitoring and control</p>
            </div>
            <div className="p-6">
              {isAgentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading agent data...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getAgentStatusColor(agent.status)}`}>
                          <CpuChipIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{agent.name}</h4>
                          <p className="text-sm text-gray-600">{agent.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">{agent.tasks} active tasks</span>
                            <span className="text-xs text-gray-500">{agent.uptime}% uptime</span>
                            <span className="text-xs text-gray-500">{agent.responseTime}s response</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={getAgentStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAgentAction('restart', agent.id)}
                            disabled={isAgentsLoading}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <ArrowPathIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAgentAction(agent.status === 'active' ? 'stop' : 'start', agent.id)}
                            disabled={isAgentsLoading}
                            className={`p-1 ${
                              agent.status === 'active'
                                ? 'text-gray-400 hover:text-red-600'
                                : 'text-gray-400 hover:text-green-600'
                            }`}
                          >
                            {agent.status === 'active' ? <StopIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <CogIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border-0 shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Agent events and actions</p>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentActivity
                  .filter(activity => activity.type === 'agent_action')
                  .slice(0, 8)
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-full ${getSeverityColor(activity.severity || 'low')}`}>
                        <CpuChipIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
              <p className="text-sm text-gray-500">Agent performance overview</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {agents.slice(0, 3).map((agent) => (
                  <div key={agent.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-900">{agent.name}</span>
                      <span className="text-gray-600">{agent.performance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.performance}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`h-2 rounded-full ${
                          agent.performance >= 95 ? 'bg-green-500' :
                          agent.performance >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">Manage users, roles, and permissions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export Users</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      <Card className="bg-white border-0 shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Roles</option>
              <option>Students</option>
              <option>Instructors</option>
              <option>Admins</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={`${
                        user.role === 'admin' ? 'bg-red-100 text-red-800 border-red-200' :
                        user.role === 'instructor' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={`${
                        user.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                        user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{user.totalPoints} points</div>
                      <div className="text-xs">Level {user.level}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.completedPaths} paths
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.studyTime}h studied
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderContentManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
          <p className="text-sm text-gray-500">Manage learning paths, modules, and assessments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export Content</span>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>New Content</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Learning Paths</h3>
            <p className="text-sm text-gray-500">Published and draft content</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {content.filter(c => c.type === 'learning_path').map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>{item.modules} modules</span>
                      <span>{item.learners} learners</span>
                      <span>{item.completionRate}% completion</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.completionRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge
                      variant="outline"
                      className={`${
                        item.status === 'published' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      {item.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Updates</h3>
            <p className="text-sm text-gray-500">Content changes and activities</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {content.slice(0, 5).map((item, index) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`p-2 rounded-lg ${
                    item.status === 'published' ? 'bg-green-100' :
                    item.status === 'draft' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <DocumentTextIcon className={`h-4 w-4 ${
                      item.status === 'published' ? 'text-green-600' :
                      item.status === 'draft' ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.status === 'published' ? 'Published' : 'Updated'} {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(item.lastUpdated)} • {item.modules} modules
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderLearningAnalytics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning Analytics</h2>
          <p className="text-sm text-gray-500">Detailed insights into learning patterns and performance</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" className="flex items-center space-x-2">
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Total Enrollments', value: '1,247', change: '+12%', icon: UserGroupIcon, color: 'blue' },
          { name: 'Completion Rate', value: '78.5%', change: '+5.2%', icon: CheckCircleIcon, color: 'green' },
          { name: 'Avg Study Time', value: '4.2h', change: '+0.3h', icon: ClockIcon, color: 'purple' },
          { name: 'Success Rate', value: '92.1%', change: '+2.1%', icon: AcademicCapIcon, color: 'orange' }
        ].map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white border-0 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <p className="text-sm text-green-600 mt-1">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                  <metric.icon className={`h-8 w-8 text-${metric.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Completion Funnel</h3>
            <p className="text-sm text-gray-500">User journey through learning paths</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { stage: 'Started Path', users: 342, percentage: 100 },
                { stage: 'Completed Module 1', users: 298, percentage: 87.1 },
                { stage: 'Completed Module 2', users: 267, percentage: 78.1 },
                { stage: 'Completed Module 3', users: 234, percentage: 68.4 },
                { stage: 'Completed Path', users: 156, percentage: 45.6 }
              ].map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{stage.stage}</span>
                    <span className="text-gray-600">{stage.users} users ({stage.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className="bg-blue-500 h-3 rounded-full"
                    />
                  </div>
                  {index > 0 && (
                    <div className="text-xs text-red-500 mt-1">
                      Drop-off: {Math.round(100 - (stage.percentage))}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Paths</h3>
            <p className="text-sm text-gray-500">Highest completion rates</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'JAC Programming Fundamentals', completion: 89.2, learners: 156, rating: 4.8 },
                { name: 'JAC Web Development', completion: 82.7, learners: 143, rating: 4.6 },
                { name: 'Advanced JAC Concepts', completion: 76.4, learners: 89, rating: 4.7 },
                { name: 'JAC Data Structures', completion: 71.8, learners: 67, rating: 4.5 }
              ].map((path, index) => (
                <div key={path.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{path.name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">{path.learners} learners</span>
                      <div className="flex items-center">
                        <span className="text-sm text-yellow-500">★</span>
                        <span className="text-sm text-gray-600 ml-1">{path.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{path.completion}%</p>
                    <p className="text-xs text-gray-500">completion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Health Monitoring</h2>
          <p className="text-sm text-gray-500">Real-time system performance and resource usage</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refreshStats()}>
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemHealth && [
          {
            name: 'CPU Usage',
            value: `${systemHealth.system_metrics.cpu_usage}%`,
            status: systemHealth.system_metrics.cpu_usage > 80 ? 'warning' : 'healthy',
            icon: ComputerDesktopIcon,
            color: systemHealth.system_metrics.cpu_usage > 80 ? 'red' : 'blue'
          },
          {
            name: 'Memory Usage',
            value: `${systemHealth.system_metrics.memory_usage}%`,
            status: systemHealth.system_metrics.memory_usage > 80 ? 'warning' : 'healthy',
            icon: DevicePhoneMobileIcon,
            color: systemHealth.system_metrics.memory_usage > 80 ? 'red' : 'green'
          },
          {
            name: 'Disk Usage',
            value: `${systemHealth.system_metrics.disk_usage}%`,
            status: systemHealth.system_metrics.disk_usage > 80 ? 'warning' : 'healthy',
            icon: CloudIcon,
            color: systemHealth.system_metrics.disk_usage > 80 ? 'red' : 'purple'
          },
          {
            name: 'Network Latency',
            value: `${systemHealth.system_metrics.network_latency}ms`,
            status: systemHealth.system_metrics.network_latency > 100 ? 'warning' : 'healthy',
            icon: GlobeAltIcon,
            color: systemHealth.system_metrics.network_latency > 100 ? 'red' : 'orange'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white border-0 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      metric.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <p className={`text-sm font-medium ${
                      metric.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.status === 'healthy' ? 'Healthy' : 'Warning'}
                    </p>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                  <metric.icon className={`h-8 w-8 text-${metric.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            <p className="text-sm text-gray-500">Historical performance data</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[
                { name: 'Response Time', value: '1.2s', target: '<2s', status: 'good' },
                { name: 'Throughput', value: '1,247 req/min', target: '>1000', status: 'good' },
                { name: 'Error Rate', value: '0.02%', target: '<0.1%', status: 'excellent' },
                { name: 'Uptime', value: '99.9%', target: '>99.5%', status: 'excellent' }
              ].map((metric, index) => (
                <div key={metric.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{metric.value}</div>
                      <div className="text-xs text-gray-500">Target: {metric.target}</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: metric.status === 'excellent' ? '100%' : metric.status === 'good' ? '85%' : '70%' }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className={`h-2 rounded-full ${
                        metric.status === 'excellent' ? 'bg-green-500' :
                        metric.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
            <p className="text-sm text-gray-500">System alerts and warnings</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">High Memory Usage</p>
                    <p className="text-xs text-yellow-700">Memory usage at 67.8% - Consider scaling</p>
                    <p className="text-xs text-yellow-600 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-800">All Systems Operational</p>
                    <p className="text-xs text-green-700">All critical services are running normally</p>
                    <p className="text-xs text-green-600 mt-1">5 minutes ago</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <BugAntIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Scheduled Maintenance</p>
                    <p className="text-xs text-blue-700">System update scheduled for tonight at 2 AM</p>
                    <p className="text-xs text-blue-600 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500">Generate comprehensive reports and export data</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            <span>Custom Report</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: 'User Activity Report',
            description: 'Detailed user engagement and activity metrics',
            icon: UserGroupIcon,
            color: 'blue',
            lastGenerated: '2 hours ago'
          },
          {
            name: 'Learning Progress Report',
            description: 'Student progress and completion statistics',
            icon: AcademicCapIcon,
            color: 'green',
            lastGenerated: '1 day ago'
          },
          {
            name: 'System Performance Report',
            description: 'System health and performance metrics',
            icon: ServerIcon,
            color: 'purple',
            lastGenerated: '3 hours ago'
          },
          {
            name: 'Content Analytics Report',
            description: 'Content performance and engagement data',
            icon: DocumentTextIcon,
            color: 'orange',
            lastGenerated: '5 hours ago'
          },
          {
            name: 'Agent Performance Report',
            description: 'AI agent metrics and effectiveness analysis',
            icon: CpuChipIcon,
            color: 'pink',
            lastGenerated: '1 hour ago'
          },
          {
            name: 'Revenue Report',
            description: 'Subscription and revenue analytics',
            icon: ArrowTrendingUpIcon,
            color: 'cyan',
            lastGenerated: '1 week ago'
          }
        ].map((report, index) => (
          <motion.div
            key={report.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white border-0 shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-${report.color}-100`}>
                  <report.icon className={`h-6 w-6 text-${report.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  <p className="text-xs text-gray-500 mt-3">Last generated: {report.lastGenerated}</p>
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    Generate Report
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-white border-0 shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
          <p className="text-sm text-gray-500">Download data in various formats</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Users CSV', format: 'CSV', size: '2.4 MB', icon: UserGroupIcon },
              { name: 'Content JSON', format: 'JSON', size: '1.8 MB', icon: DocumentTextIcon },
              { name: 'Analytics PDF', format: 'PDF', size: '5.2 MB', icon: ChartBarIcon },
              { name: 'System Logs', format: 'TXT', size: '12.1 MB', icon: ServerIcon }
            ].map((exportItem) => (
              <div key={exportItem.name} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <exportItem.icon className="h-8 w-8 text-gray-400" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{exportItem.name}</h4>
                    <p className="text-sm text-gray-600">{exportItem.format} • {exportItem.size}</p>
                  </div>
                  <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'content':
        return renderContentManagement();
      case 'learning':
        return renderLearningAnalytics();
      case 'agents':
        return renderAgents();
      case 'system':
        return renderSystemHealth();
      case 'reports':
        return renderReports();
      default:
        return renderOverview();
    }
  };

  // Check if user has admin privileges
  if (!user?.profile?.is_staff && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <ShieldCheckIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to access the admin dashboard. Please contact your administrator.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <span>Admin Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive platform management and monitoring
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center">
                <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={resetError} className="text-red-600 hover:text-red-800">
                  <XCircleIcon className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/70 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white shadow-sm text-blue-600 border border-blue-100'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading admin data...</span>
          </div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 overflow-hidden"
        >
          {!isLoading && renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;