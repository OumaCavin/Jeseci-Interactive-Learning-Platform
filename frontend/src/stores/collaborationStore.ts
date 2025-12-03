// Collaboration Store - State management for collaborative features
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  members: string[];
  maxMembers: number;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
  tags: string[];
  status: 'active' | 'paused' | 'completed';
  avatar?: string;
  currentProject?: string;
  progress: number;
  nextMeeting?: Date;
  description_long?: string;
  goals?: string[];
  meetingSchedule?: {
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
    day: string;
    time: string;
    timezone: string;
  };
}

export interface CollaborationProject {
  id: string;
  title: string;
  description: string;
  groupId: string;
  createdBy: string;
  assignedMembers: string[];
  status: 'planning' | 'active' | 'review' | 'completed';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  files: ProjectFile[];
  tasks: ProjectTask[];
  progress: number;
  category: string;
  tags: string[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'document' | 'code' | 'image' | 'video' | 'other';
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  replyTo?: string;
  reactions?: { [emoji: string]: string[] };
}

export interface GroupChat {
  id: string;
  groupId: string;
  messages: Message[];
  unreadCount: number;
  lastActivity: Date;
}

export interface CollaborationInvite {
  id: string;
  groupId: string;
  invitedBy: string;
  invitedUser: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  respondedAt?: Date;
}

export interface CollaborationStats {
  totalGroups: number;
  activeGroups: number;
  completedProjects: number;
  totalCollaborations: number;
  averageRating: number;
  topSubjects: string[];
  memberEngagement: {
    veryActive: number;
    active: number;
    moderate: number;
    inactive: number;
  };
}

interface CollaborationState {
  // Study Groups
  studyGroups: StudyGroup[];
  myGroups: StudyGroup[];
  suggestedGroups: StudyGroup[];
  
  // Projects
  projects: CollaborationProject[];
  myProjects: CollaborationProject[];
  
  // Chat
  groupChats: GroupChat[];
  activeChat: string | null;
  
  // Invites
  invites: CollaborationInvite[];
  sentInvites: CollaborationInvite[];
  
  // Stats
  stats: CollaborationStats;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  currentView: 'dashboard' | 'groups' | 'projects' | 'chat' | 'discover';
  selectedGroup: StudyGroup | null;
  selectedProject: CollaborationProject | null;
  
  // Actions
  loadStudyGroups: () => Promise<void>;
  loadMyGroups: () => Promise<void>;
  loadSuggestedGroups: () => Promise<void>;
  createGroup: (groupData: Partial<StudyGroup>) => Promise<void>;
  updateGroup: (groupId: string, updates: Partial<StudyGroup>) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  
  loadProjects: () => Promise<void>;
  loadMyProjects: () => Promise<void>;
  createProject: (projectData: Partial<CollaborationProject>) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<CollaborationProject>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
  loadGroupChat: (groupId: string) => Promise<void>;
  sendMessage: (groupId: string, content: string, type?: 'text' | 'file') => Promise<void>;
  loadInvites: () => Promise<void>;
  sendInvite: (groupId: string, userId: string, message?: string) => Promise<void>;
  respondToInvite: (inviteId: string, status: 'accepted' | 'declined') => Promise<void>;
  
  loadStats: () => Promise<void>;
  setCurrentView: (view: 'dashboard' | 'groups' | 'projects' | 'chat' | 'discover') => void;
  setSelectedGroup: (group: StudyGroup | null) => void;
  setSelectedProject: (project: CollaborationProject | null) => void;
  setActiveChat: (groupId: string | null) => void;
  
  // Utility
  generateMockData: () => void;
}

const generateMockStudyGroups = (): StudyGroup[] => [
  {
    id: '1',
    name: 'React Mastery Squad',
    description: 'Advanced React patterns and best practices for building scalable applications',
    subject: 'React Development',
    level: 'advanced',
    members: ['user1', 'user2', 'user3', 'user4'],
    maxMembers: 8,
    isPrivate: false,
    createdBy: 'user1',
    createdAt: new Date('2024-01-15'),
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
    status: 'active',
    progress: 75,
    nextMeeting: new Date('2024-12-05T14:00:00Z'),
    description_long: 'Join our elite group of React developers as we dive deep into advanced patterns, performance optimization, and modern development practices. Perfect for developers looking to level up their React game.',
    goals: [
      'Master React Suspense and Concurrent Features',
      'Build reusable component libraries',
      'Implement advanced state management',
      'Create performant React applications'
    ],
    meetingSchedule: {
      frequency: 'weekly',
      day: 'Wednesday',
      time: '14:00',
      timezone: 'UTC'
    }
  },
  {
    id: '2',
    name: 'Python Data Science Alliance',
    description: 'Collaborative learning for data science, machine learning, and analytics',
    subject: 'Data Science',
    level: 'intermediate',
    members: ['user5', 'user6', 'user7'],
    maxMembers: 12,
    isPrivate: false,
    createdBy: 'user5',
    createdAt: new Date('2024-02-01'),
    tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas'],
    status: 'active',
    progress: 60,
    nextMeeting: new Date('2024-12-07T16:00:00Z'),
    goals: ['Master pandas and numpy', 'Build ML models', 'Data visualization'],
    meetingSchedule: {
      frequency: 'bi-weekly',
      day: 'Friday',
      time: '16:00',
      timezone: 'UTC'
    }
  },
  {
    id: '3',
    name: 'Full Stack Founders',
    description: 'Building startups together - from idea to MVP',
    subject: 'Entrepreneurship',
    level: 'intermediate',
    members: ['user8', 'user9', 'user10'],
    maxMembers: 6,
    isPrivate: true,
    createdBy: 'user8',
    createdAt: new Date('2024-01-20'),
    tags: ['Startup', 'Full Stack', 'Business', 'MVP'],
    status: 'active',
    progress: 45,
    goals: ['Launch MVP', 'Validate product-market fit', 'Build user base'],
    meetingSchedule: {
      frequency: 'weekly',
      day: 'Monday',
      time: '18:00',
      timezone: 'UTC'
    }
  }
];

const generateMockProjects = (): CollaborationProject[] => [
  {
    id: '1',
    title: 'E-Learning Platform Frontend',
    description: 'Building a modern, responsive frontend for our online learning platform',
    groupId: '1',
    createdBy: 'user1',
    assignedMembers: ['user1', 'user2', 'user3'],
    status: 'active',
    dueDate: new Date('2024-12-31'),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-02'),
    progress: 65,
    category: 'Web Development',
    tags: ['React', 'TypeScript', 'Tailwind'],
    files: [
      {
        id: 'f1',
        name: 'architecture.pdf',
        type: 'document',
        size: 2048576,
        url: '/files/architecture.pdf',
        uploadedBy: 'user1',
        uploadedAt: new Date('2024-11-01'),
        version: 1
      }
    ],
    tasks: [
      {
        id: 't1',
        title: 'Setup project structure',
        description: 'Initialize React project with TypeScript and necessary dependencies',
        assignedTo: 'user1',
        status: 'completed',
        priority: 'high',
        createdAt: new Date('2024-11-01'),
        completedAt: new Date('2024-11-02')
      },
      {
        id: 't2',
        title: 'Design authentication pages',
        description: 'Create login, signup, and password reset pages',
        assignedTo: 'user2',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2024-12-05'),
        createdAt: new Date('2024-11-05')
      }
    ]
  },
  {
    id: '2',
    title: 'Machine Learning Model Analysis',
    description: 'Collaborative analysis of customer behavior prediction models',
    groupId: '2',
    createdBy: 'user5',
    assignedMembers: ['user5', 'user6'],
    status: 'active',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-01'),
    progress: 40,
    category: 'Data Science',
    tags: ['Python', 'scikit-learn', 'Pandas'],
    files: [],
    tasks: []
  }
];

export const useCollaborationStore = create<CollaborationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      studyGroups: [],
      myGroups: [],
      suggestedGroups: [],
      projects: [],
      myProjects: [],
      groupChats: [],
      invites: [],
      sentInvites: [],
      stats: {
        totalGroups: 0,
        activeGroups: 0,
        completedProjects: 0,
        totalCollaborations: 0,
        averageRating: 4.2,
        topSubjects: ['React', 'Python', 'JavaScript', 'Data Science'],
        memberEngagement: {
          veryActive: 12,
          active: 25,
          moderate: 18,
          inactive: 8
        }
      },
      isLoading: false,
      error: null,
      currentView: 'dashboard',
      selectedGroup: null,
      selectedProject: null,

      // Actions
      generateMockData: () => {
        const mockGroups = generateMockStudyGroups();
        const mockProjects = generateMockProjects();
        set({
          studyGroups: mockGroups,
          myGroups: mockGroups.filter(g => g.members.includes('currentUser')),
          suggestedGroups: mockGroups.filter(g => !g.members.includes('currentUser')),
          projects: mockProjects,
          myProjects: mockProjects.filter(p => p.assignedMembers.includes('currentUser')),
          stats: {
            ...get().stats,
            totalGroups: mockGroups.length,
            activeGroups: mockGroups.filter(g => g.status === 'active').length,
            completedProjects: mockProjects.filter(p => p.status === 'completed').length,
            totalCollaborations: mockGroups.length + mockProjects.length
          }
        });
      },

      loadStudyGroups: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { generateMockData } = get();
          generateMockData();
        } catch (error) {
          set({ error: 'Failed to load study groups', isLoading: false });
        }
      },

      loadMyGroups: async () => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockGroups = generateMockStudyGroups();
          set({
            myGroups: mockGroups.filter(g => g.members.includes('currentUser')),
            isLoading: false
          });
        } catch (error) {
          set({ error: 'Failed to load my groups', isLoading: false });
        }
      },

      loadSuggestedGroups: async () => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockGroups = generateMockStudyGroups();
          set({
            suggestedGroups: mockGroups.filter(g => !g.members.includes('currentUser')),
            isLoading: false
          });
        } catch (error) {
          set({ error: 'Failed to load suggested groups', isLoading: false });
        }
      },

      createGroup: async (groupData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const newGroup: StudyGroup = {
            id: Date.now().toString(),
            name: groupData.name || 'New Study Group',
            description: groupData.description || '',
            subject: groupData.subject || 'General',
            level: groupData.level || 'beginner',
            members: ['currentUser'],
            maxMembers: groupData.maxMembers || 10,
            isPrivate: groupData.isPrivate || false,
            createdBy: 'currentUser',
            createdAt: new Date(),
            tags: groupData.tags || [],
            status: 'active',
            progress: 0
          };
          
          set(state => ({
            studyGroups: [...state.studyGroups, newGroup],
            myGroups: [...state.myGroups, newGroup],
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to create group', isLoading: false });
        }
      },

      updateGroup: async (groupId, updates) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          set(state => ({
            studyGroups: state.studyGroups.map(g => 
              g.id === groupId ? { ...g, ...updates } : g
            ),
            myGroups: state.myGroups.map(g => 
              g.id === groupId ? { ...g, ...updates } : g
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to update group', isLoading: false });
        }
      },

      joinGroup: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 700));
          set(state => ({
            studyGroups: state.studyGroups.map(g => 
              g.id === groupId 
                ? { ...g, members: [...g.members, 'currentUser'] }
                : g
            ),
            myGroups: [...state.myGroups, ...state.studyGroups.filter(g => g.id === groupId)],
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to join group', isLoading: false });
        }
      },

      leaveGroup: async (groupId) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set(state => ({
            studyGroups: state.studyGroups.map(g => 
              g.id === groupId 
                ? { ...g, members: g.members.filter(m => m !== 'currentUser') }
                : g
            ),
            myGroups: state.myGroups.filter(g => g.id !== groupId),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to leave group', isLoading: false });
        }
      },

      loadProjects: async () => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          const mockProjects = generateMockProjects();
          set({
            projects: mockProjects,
            isLoading: false
          });
        } catch (error) {
          set({ error: 'Failed to load projects', isLoading: false });
        }
      },

      loadMyProjects: async () => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockProjects = generateMockProjects();
          set({
            myProjects: mockProjects.filter(p => p.assignedMembers.includes('currentUser')),
            isLoading: false
          });
        } catch (error) {
          set({ error: 'Failed to load my projects', isLoading: false });
        }
      },

      createProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const newProject: CollaborationProject = {
            id: Date.now().toString(),
            title: projectData.title || 'New Project',
            description: projectData.description || '',
            groupId: projectData.groupId || '',
            createdBy: 'currentUser',
            assignedMembers: projectData.assignedMembers || ['currentUser'],
            status: 'planning',
            createdAt: new Date(),
            updatedAt: new Date(),
            progress: 0,
            category: projectData.category || 'General',
            tags: projectData.tags || [],
            files: [],
            tasks: []
          };
          
          set(state => ({
            projects: [...state.projects, newProject],
            myProjects: [...state.myProjects, newProject],
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to create project', isLoading: false });
        }
      },

      updateProject: async (projectId, updates) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          set(state => ({
            projects: state.projects.map(p => 
              p.id === projectId ? { ...p, ...updates, updatedAt: new Date() } : p
            ),
            myProjects: state.myProjects.map(p => 
              p.id === projectId ? { ...p, ...updates, updatedAt: new Date() } : p
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to update project', isLoading: false });
        }
      },

      deleteProject: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set(state => ({
            projects: state.projects.filter(p => p.id !== projectId),
            myProjects: state.myProjects.filter(p => p.id !== projectId),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to delete project', isLoading: false });
        }
      },

      loadGroupChat: async (groupId) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 400));
          // Mock messages
          const mockMessages: Message[] = [
            {
              id: '1',
              senderId: 'user1',
              senderName: 'Alice Johnson',
              content: 'Hey everyone! Ready for our React session today?',
              timestamp: new Date(Date.now() - 3600000),
              type: 'text',
              reactions: { '👍': ['user2', 'user3'] }
            },
            {
              id: '2',
              senderId: 'user2',
              senderName: 'Bob Smith',
              content: 'Absolutely! I have been working on the custom hooks we discussed.',
              timestamp: new Date(Date.now() - 1800000),
              type: 'text'
            }
          ];
          
          const existingChat = get().groupChats.find(chat => chat.groupId === groupId);
          if (!existingChat) {
            set(state => ({
              groupChats: [...state.groupChats, {
                id: groupId,
                groupId,
                messages: mockMessages,
                unreadCount: 0,
                lastActivity: new Date()
              }],
              isLoading: false
            }));
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to load group chat', isLoading: false });
        }
      },

      sendMessage: async (groupId, content, type = 'text') => {
        try {
          const newMessage: Message = {
            id: Date.now().toString(),
            senderId: 'currentUser',
            senderName: 'Current User',
            content,
            timestamp: new Date(),
            type
          };
          
          set(state => ({
            groupChats: state.groupChats.map(chat => 
              chat.groupId === groupId 
                ? { 
                    ...chat, 
                    messages: [...chat.messages, newMessage],
                    lastActivity: new Date()
                  }
                : chat
            )
          }));
        } catch (error) {
          set({ error: 'Failed to send message' });
        }
      },

      loadInvites: async () => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 400));
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to load invites', isLoading: false });
        }
      },

      sendInvite: async (groupId, userId, message) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 600));
          const newInvite: CollaborationInvite = {
            id: Date.now().toString(),
            groupId,
            invitedBy: 'currentUser',
            invitedUser: userId,
            message,
            status: 'pending',
            createdAt: new Date()
          };
          
          set(state => ({
            sentInvites: [...state.sentInvites, newInvite],
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to send invite', isLoading: false });
        }
      },

      respondToInvite: async (inviteId, status) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set(state => ({
            invites: state.invites.map(invite => 
              invite.id === inviteId 
                ? { ...invite, status, respondedAt: new Date() }
                : invite
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to respond to invite', isLoading: false });
        }
      },

      loadStats: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const { studyGroups, projects } = get();
          set(state => ({
            stats: {
              ...state.stats,
              totalGroups: studyGroups.length,
              activeGroups: studyGroups.filter(g => g.status === 'active').length,
              completedProjects: projects.filter(p => p.status === 'completed').length,
              totalCollaborations: studyGroups.length + projects.length
            }
          }));
        } catch (error) {
          set({ error: 'Failed to load stats' });
        }
      },

      setCurrentView: (view) => set({ currentView: view }),
      setSelectedGroup: (group) => set({ selectedGroup: group }),
      setSelectedProject: (project) => set({ selectedProject: project }),
      setActiveChat: (groupId) => set({ activeChat: groupId })
    }),
    {
      name: 'collaboration-store',
    }
  )
);