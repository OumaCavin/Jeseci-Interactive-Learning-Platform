// JAC Learning Platform - Enhanced AdminRoute Component
// Complete Admin Management Platform
// Author: Cavin Otieno
// Enhanced: 2025-12-03

import React, { useState, useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, Button, Tabs, Progress, Avatar, Table, Modal } from '../ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { RootState } from '../../store/store';
import { 
  XCircleIcon, 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  CogIcon,
  BellIcon,
  EyeIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CpuChipIcon,
  ServerIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super_admin' | 'moderator';
  permissions?: string[];
}

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'success' | 'failed' | 'pending';
}

interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'user' | 'system';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
}

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  systemHealth: number;
  totalSessions: number;
  securityThreats: number;
  agentInteractions: number;
  averageResponseTime: number;
  userSatisfaction: number;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isActive: boolean;
}

interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  timestamp: Date;
  ipAddress: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  requiredRole = 'admin',
  permissions = []
}) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'roles' | 'activity' | 'analytics' | 'security'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState<SystemAlert[]>([]);
  const [sessionId] = useState(() => `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Check authentication and authorization
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Enhanced role-based access control
  const hasPermission = useMemo(() => {
    if (requiredRole === 'super_admin') {
      return user.is_superuser === true;
    }
    if (requiredRole === 'admin') {
      return user.is_staff === true || user.is_superuser === true;
    }
    if (requiredRole === 'moderator') {
      return user.is_staff === true || user.is_superuser === true || user.is_moderator === true;
    }
    return user.is_staff === true;
  }, [user, requiredRole]);

  // Mock data for enhanced admin features
  const adminMetrics: AdminMetrics = {
    totalUsers: 2847,
    activeUsers: 1243,
    systemHealth: 98.5,
    totalSessions: 5632,
    securityThreats: 3,
    agentInteractions: 15678,
    averageResponseTime: 1.25,
    userSatisfaction: 94.2
  };

  const recentActivity: UserActivity[] = [
    {
      id: 'act-001',
      userId: 'user-123',
      userName: 'John Doe',
      action: 'Login',
      resource: '/dashboard',
      timestamp: new Date(Date.now() - 300000),
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0.0.0',
      riskLevel: 'low',
      status: 'success'
    },
    {
      id: 'act-002',
      userId: 'user-456',
      userName: 'Jane Smith',
      action: 'Quiz Creation',
      resource: '/quiz-master',
      timestamp: new Date(Date.now() - 600000),
      ipAddress: '192.168.1.101',
      userAgent: 'Firefox 119.0.0.0',
      riskLevel: 'medium',
      status: 'success'
    },
    {
      id: 'act-003',
      userId: 'user-789',
      userName: 'Admin User',
      action: 'User Management',
      resource: '/admin/users',
      timestamp: new Date(Date.now() - 900000),
      ipAddress: '192.168.1.102',
      userAgent: 'Chrome 120.0.0.0',
      riskLevel: 'low',
      status: 'success'
    }
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: 'alert-001',
      type: 'security',
      severity: 'warning',
      title: 'Multiple Failed Login Attempts',
      message: 'User user-999 has failed to login 5 times in the last 10 minutes',
      timestamp: new Date(Date.now() - 1200000),
      isRead: false,
      isResolved: false
    },
    {
      id: 'alert-002',
      type: 'performance',
      severity: 'info',
      title: 'High CPU Usage Detected',
      message: 'System CPU usage has exceeded 80% for the last 5 minutes',
      timestamp: new Date(Date.now() - 1800000),
      isRead: true,
      isResolved: true
    },
    {
      id: 'alert-003',
      type: 'user',
      severity: 'error',
      title: 'Unusual Activity Pattern',
      message: 'User user-123 has accessed 15 different resources in 5 minutes',
      timestamp: new Date(Date.now() - 2400000),
      isRead: false,
      isResolved: false
    }
  ];

  const adminRoles: Role[] = [
    {
      id: 'role-001',
      name: 'Super Administrator',
      description: 'Full system access and control',
      permissions: ['all'],
      userCount: 2,
      isActive: true
    },
    {
      id: 'role-002',
      name: 'Administrator',
      description: 'User and content management',
      permissions: ['user_management', 'content_management', 'analytics'],
      userCount: 5,
      isActive: true
    },
    {
      id: 'role-003',
      name: 'Moderator',
      description: 'Content moderation and user support',
      permissions: ['content_moderation', 'user_support'],
      userCount: 8,
      isActive: true
    },
    {
      id: 'role-004',
      name: 'Analytics Viewer',
      description: 'Read-only access to analytics',
      permissions: ['analytics_view'],
      userCount: 12,
      isActive: true
    }
  ];

  const adminAuditLogs: AdminAuditLog[] = [
    {
      id: 'audit-001',
      adminId: 'admin-001',
      adminName: 'System Admin',
      action: 'User Role Update',
      target: 'user-123',
      details: 'Changed role from User to Moderator',
      timestamp: new Date(Date.now() - 3600000),
      ipAddress: '192.168.1.100'
    },
    {
      id: 'audit-002',
      adminId: 'admin-002',
      adminName: 'Content Admin',
      action: 'Content Deletion',
      target: 'course-456',
      details: 'Deleted course "Advanced JavaScript"',
      timestamp: new Date(Date.now() - 7200000),
      ipAddress: '192.168.1.101'
    }
  ];

  // Performance data for charts
  const performanceData = useMemo(() => [
    { time: '00:00', users: 45, sessions: 67, cpu: 34, memory: 45 },
    { time: '04:00', users: 32, sessions: 45, cpu: 28, memory: 42 },
    { time: '08:00', users: 123, sessions: 189, cpu: 67, memory: 78 },
    { time: '12:00', users: 234, sessions: 345, cpu: 82, memory: 89 },
    { time: '16:00', users: 198, sessions: 287, cpu: 75, memory: 82 },
    { time: '20:00', users: 156, sessions: 234, cpu: 56, memory: 67 }
  ], []);

  const agentUsageData = useMemo(() => [
    { name: 'System Orchestrator', usage: 32, interactions: 2847 },
    { name: 'Content Curator', usage: 28, interactions: 2134 },
    { name: 'Quiz Master', usage: 25, interactions: 1923 },
    { name: 'Motivator', usage: 23, interactions: 1756 },
    { name: 'Evaluator', usage: 22, interactions: 1687 },
    { name: 'Progress Tracker', usage: 20, interactions: 1534 },
    { name: 'Multi Agent', usage: 18, interactions: 1378 },
    { name: 'Base Agent', usage: 15, interactions: 1145 }
  ], []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'error': return 'bg-red-400';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircleIcon className="h-4 w-4 text-red-400" />;
      case 'pending': return <ClockIcon className="h-4 w-4 text-yellow-400" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const AdminDashboardView = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">{adminMetrics.totalUsers.toLocaleString()}</div>
          <div className="text-white/70 text-sm">Total Users</div>
          <div className="text-xs text-green-400 mt-1">+12% this month</div>
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{adminMetrics.activeUsers.toLocaleString()}</div>
          <div className="text-white/70 text-sm">Active Users</div>
          <div className="text-xs text-green-400 mt-1">+8% this week</div>
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{adminMetrics.systemHealth}%</div>
          <div className="text-white/70 text-sm">System Health</div>
          <div className="text-xs text-green-400 mt-1">Excellent</div>
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{adminMetrics.agentInteractions.toLocaleString()}</div>
          <div className="text-white/70 text-sm">Agent Interactions</div>
          <div className="text-xs text-green-400 mt-1">+25% today</div>
        </Card>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="md">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CpuChipIcon className="h-5 w-5" />
            <span>System Performance</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} name="Memory %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        <Card variant="glass" padding="md">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5" />
            <span>Agent Usage Distribution</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={agentUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="usage" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="md">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <EyeIcon className="h-5 w-5" />
            <span>Recent User Activity</span>
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(activity.status)}
                  <div>
                    <div className="text-white font-medium">{activity.userName}</div>
                    <div className="text-white/70 text-sm">{activity.action} - {activity.resource}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${getRiskColor(activity.riskLevel)}`}>
                    {activity.riskLevel} risk
                  </div>
                  <div className="text-white/60 text-xs">
                    {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card variant="glass" padding="md">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <BellIcon className="h-5 w-5" />
            <span>System Alerts</span>
            <Badge variant="error" size="sm">{systemAlerts.filter(a => !a.isResolved).length}</Badge>
          </h3>
          <div className="space-y-3">
            {systemAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className={`p-3 rounded border-l-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium">{alert.title}</div>
                    <div className="text-white/70 text-sm mt-1">{alert.message}</div>
                  </div>
                  <Badge variant={alert.isResolved ? 'success' : 'error'} size="sm">
                    {alert.isResolved ? 'Resolved' : 'Active'}
                  </Badge>
                </div>
                <div className="text-white/60 text-xs mt-2">
                  {alert.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const UserManagementView = () => (
    <div className="space-y-6">
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <UserGroupIcon className="h-5 w-5" />
            <span>User Management</span>
          </h3>
          <div className="flex space-x-2">
            <Button variant="primary" size="sm">Add User</Button>
            <Button variant="secondary" size="sm">Bulk Actions</Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/70 text-sm font-medium py-3">User</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Email</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Role</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Last Active</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Status</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">
                  <div className="flex items-center space-x-3">
                    <Avatar src="/api/placeholder/32/32" alt="User" size="sm" />
                    <div>
                      <div className="text-white font-medium">John Doe</div>
                      <div className="text-white/70 text-sm">ID: user-123</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-white">john.doe@example.com</td>
                <td className="py-3">
                  <Badge variant="info" size="sm">Student</Badge>
                </td>
                <td className="py-3 text-white/70">2 hours ago</td>
                <td className="py-3">
                  <Badge variant="success" size="sm">Active</Badge>
                </td>
                <td className="py-3">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowUserModal(true)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">Suspend</Button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">
                  <div className="flex items-center space-x-3">
                    <Avatar src="/api/placeholder/32/32" alt="User" size="sm" />
                    <div>
                      <div className="text-white font-medium">Jane Smith</div>
                      <div className="text-white/70 text-sm">ID: user-456</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-white">jane.smith@example.com</td>
                <td className="py-3">
                  <Badge variant="warning" size="sm">Instructor</Badge>
                </td>
                <td className="py-3 text-white/70">1 day ago</td>
                <td className="py-3">
                  <Badge variant="warning" size="sm">Away</Badge>
                </td>
                <td className="py-3">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowUserModal(true)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">Suspend</Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const RoleControlView = () => (
    <div className="space-y-6">
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <ShieldCheckIcon className="h-5 w-5" />
          <span>Role & Permission Management</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminRoles.map((role) => (
            <div key={role.id} className="p-4 bg-white/5 rounded">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">{role.name}</h4>
                  <p className="text-white/70 text-sm mt-1">{role.description}</p>
                </div>
                <Badge variant={role.isActive ? 'success' : 'error'} size="sm">
                  {role.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-white/70 text-sm">
                  Users: <span className="text-white">{role.userCount}</span>
                </div>
                <div className="text-white/70 text-sm">Permissions:</div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <Badge key={permission} variant="info" size="sm">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant="default" size="sm">
                      +{role.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button variant="ghost" size="sm">Edit Role</Button>
                <Button variant="ghost" size="sm">Manage Users</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const ActivityMonitoringView = () => (
    <div className="space-y-6">
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <EyeIcon className="h-5 w-5" />
          <span>Real-time Activity Monitoring</span>
        </h3>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-4 bg-white/5 rounded border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(activity.status)}
                  <div>
                    <div className="text-white font-medium">{activity.userName}</div>
                    <div className="text-white/70 text-sm">{activity.action} on {activity.resource}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={activity.riskLevel === 'high' ? 'error' : activity.riskLevel === 'medium' ? 'warning' : 'success'} size="sm">
                    {activity.riskLevel} risk
                  </Badge>
                  <div className="text-white/60 text-xs mt-1">
                    {activity.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-white/70">IP Address:</span>
                  <span className="text-white ml-2">{activity.ipAddress}</span>
                </div>
                <div>
                  <span className="text-white/70">User Agent:</span>
                  <span className="text-white ml-2">{activity.userAgent}</span>
                </div>
                <div>
                  <span className="text-white/70">Session ID:</span>
                  <span className="text-white ml-2">{activity.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const SystemAnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card variant="glass" padding="md" className="text-center">
          <ServerIcon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{adminMetrics.systemHealth}%</div>
          <div className="text-white/70 text-sm">System Health</div>
          <Progress value={adminMetrics.systemHealth} className="h-2 mt-2" />
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <ClockIcon className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{adminMetrics.averageResponseTime}s</div>
          <div className="text-white/70 text-sm">Avg Response Time</div>
          <Progress value={Math.max(0, 100 - (adminMetrics.averageResponseTime - 1) * 20)} className="h-2 mt-2" />
        </Card>
        
        <Card variant="glass" padding="md" className="text-center">
          <ChartBarIcon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{adminMetrics.userSatisfaction}%</div>
          <div className="text-white/70 text-sm">User Satisfaction</div>
          <Progress value={adminMetrics.userSatisfaction} className="h-2 mt-2" />
        </Card>
      </div>

      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <DocumentTextIcon className="h-5 w-5" />
          <span>Admin Audit Logs</span>
        </h3>
        
        <div className="space-y-3">
          {adminAuditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-white/5 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-medium">{log.action}</div>
                <div className="text-white/60 text-sm">{log.timestamp.toLocaleString()}</div>
              </div>
              <div className="text-white/70 text-sm">
                <span className="font-medium">{log.adminName}</span> performed {log.action.toLowerCase()} on {log.target}
              </div>
              <div className="text-white/60 text-xs mt-1">
                Details: {log.details} | IP: {log.ipAddress}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const SecurityCenterView = () => (
    <div className="space-y-6">
      <Card variant="glass" padding="md">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <LockClosedIcon className="h-5 w-5" />
          <span>Security Center</span>
          <Badge variant="error" size="sm">{securityAlerts.length} Active</Badge>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <span className="text-white font-medium">Security Threats</span>
              </div>
              <div className="text-2xl font-bold text-red-400 mb-1">{adminMetrics.securityThreats}</div>
              <div className="text-white/70 text-sm">Active threats detected</div>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">Security Status</span>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">Secure</div>
              <div className="text-white/70 text-sm">All systems protected</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium">2FA Compliance</span>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">94%</div>
              <div className="text-white/70 text-sm">Users with 2FA enabled</div>
            </div>
            
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <CogIcon className="h-5 w-5 text-purple-400" />
                <span className="text-white font-medium">Access Control</span>
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">Active</div>
              <div className="text-white/70 text-sm">RBAC policies enforced</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard': return <AdminDashboardView />;
      case 'users': return <UserManagementView />;
      case 'roles': return <RoleControlView />;
      case 'activity': return <ActivityMonitoringView />;
      case 'analytics': return <SystemAnalyticsView />;
      case 'security': return <SecurityCenterView />;
      default: return <AdminDashboardView />;
    }
  };

  // Enhanced access denied with admin features
  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl text-center">
          <XCircleIcon className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You need <strong>{requiredRole}</strong> privileges to access this page.
          </p>
          
          {/* Enhanced Admin Features Overview */}
          <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
              <span>Enterprise Admin Features</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🛡️ Security & Access Control</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Role-based access control (RBAC)</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Security threat monitoring</li>
                  <li>• Audit trail management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📊 Analytics & Monitoring</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time user activity tracking</li>
                  <li>• System performance analytics</li>
                  <li>• AI agent interaction metrics</li>
                  <li>• Comprehensive reporting dashboard</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">👥 User & Content Management</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Advanced user management</li>
                  <li>• Content creation and moderation</li>
                  <li>• Learning path administration</li>
                  <li>• Bulk operations support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🤖 AI Agent Integration</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Multi-agent orchestration</li>
                  <li>• Workflow automation</li>
                  <li>• Performance optimization</li>
                  <li>• Intelligent recommendations</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Admin Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
            <span>Enterprise Admin Control Center</span>
          </h1>
          <p className="text-white/80 max-w-3xl mx-auto">
            Comprehensive administration platform with advanced security, monitoring, and management capabilities
          </p>
          
          {/* Admin Status Bar */}
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/70">System Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white/70">{adminMetrics.activeUsers} Active Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-white/70">{adminMetrics.agentInteractions.toLocaleString()} Agent Interactions</span>
            </div>
          </div>
        </motion.div>

        {/* Admin Navigation */}
        <Card variant="glass" padding="none" className="mb-6">
          <Tabs 
            value={activeView} 
            onValueChange={(value) => setActiveView(value as any)}
            className="w-full"
          >
            <div className="flex flex-wrap border-b border-white/20">
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeView === 'dashboard' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="mr-2">🏠</span>
                Dashboard
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeView === 'users' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="mr-2">👥</span>
                User Management
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeView === 'roles' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="mr-2">🛡️</span>
                Role Control
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeView === 'activity' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="mr-2">👁️</span>
                Activity Monitor
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeView === 'analytics' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="mr-2">📊</span>
                Analytics
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeView === 'security' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="mr-2">🔒</span>
                Security Center
              </button>
            </div>
          </Tabs>
        </Card>

        {/* Main Admin Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>

        {/* Admin Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card variant="glass" padding="md">
            <div className="text-center">
              <h4 className="text-sm font-medium text-white mb-3">Enterprise Admin Platform</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-white/70">
                <div>
                  <span className="font-medium">🛡️ Security First</span><br/>
                  Advanced RBAC and threat monitoring
                </div>
                <div>
                  <span className="font-medium">📊 Real-time Analytics</span><br/>
                  Live monitoring and performance tracking
                </div>
                <div>
                  <span className="font-medium">🤖 AI Integration</span><br/>
                  Complete agent ecosystem management
                </div>
                <div>
                  <span className="font-medium">👥 User Management</span><br/>
                  Comprehensive user lifecycle management
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRoute;