import api from './api';
import { useUserStatsStore } from '../stores/userStatsStore';

interface GamificationEvent {
  type: string;
  data?: Record<string, any>;
}

interface AchievementTrigger {
  event: string;
  condition: (data: any) => boolean;
  reward: {
    points: number;
    badge?: string;
    message: string;
  };
}

class GamificationService {
  private eventQueue: GamificationEvent[] = [];
  private isProcessing = false;

  // Achievement definitions for chat interactions
  private achievements: AchievementTrigger[] = [
    {
      event: 'first_chat_session',
      condition: (data) => data.session_count === 1,
      reward: { points: 50, badge: 'first_chat', message: 'Welcome to AI Chat! 🎉' }
    },
    {
      event: 'chat_streak_3_days',
      condition: (data) => data.consecutive_days >= 3,
      reward: { points: 100, badge: 'consistent_learner', message: '3-day learning streak! 🔥' }
    },
    {
      event: 'chat_streak_7_days',
      condition: (data) => data.consecutive_days >= 7,
      reward: { points: 200, badge: 'weekly_warrior', message: 'Amazing 7-day streak! 💪' }
    },
    {
      event: 'agent_explorer',
      condition: (data) => data.unique_agents_used >= 3,
      reward: { points: 75, badge: 'agent_explorer', message: 'Tried all AI agents! 🤖' }
    },
    {
      event: 'code_helper',
      condition: (data) => data.code_sessions >= 5,
      reward: { points: 150, badge: 'coding_companion', message: '5 coding sessions completed! 💻' }
    },
    {
      event: 'deep_thinker',
      condition: (data) => data.advanced_sessions >= 3,
      reward: { points: 100, badge: 'deep_thinker', message: ' Tackling advanced concepts! 🧠' }
    },
    {
      event: 'creative_spark',
      condition: (data) => data.creative_sessions >= 3,
      reward: { points: 100, badge: 'creative_genius', message: 'Unleashing creativity! 🎨' }
    },
    {
      event: 'session_marathon',
      condition: (data) => data.total_session_time >= 300, // 5 hours
      reward: { points: 250, badge: 'learning_marathon', message: '5 hours of learning! 🏃‍♂️' }
    },
    {
      event: 'helpful_conversations',
      condition: (data) => data.helpful_ratings >= 10,
      reward: { points: 125, badge: 'helpful_learner', message: '10 helpful conversations! 👍' }
    }
  ];

  constructor() {
    this.initializeEventHandlers();
  }

  private initializeEventHandlers() {
    // Process events when user stats are available
    const checkAndProcess = () => {
      const userStatsStore = useUserStatsStore.getState();
      if (userStatsStore.statistics && !this.isProcessing) {
        this.processEventQueue();
      }
    };

    // Check periodically
    setInterval(checkAndProcess, 5000);
  }

  /**
   * Award points for a specific action
   */
  async awardPoints(points: number, eventType: string, data: Record<string, any> = {}): Promise<void> {
    try {
      const event: GamificationEvent = {
        type: eventType,
        data: { points, ...data, timestamp: new Date().toISOString() }
      };

      this.eventQueue.push(event);
      await this.processEvent(event);
    } catch (error) {
      console.warn('Failed to award points:', error);
    }
  }

  /**
   * Check for achievement triggers
   */
  private async checkAchievements(userStats: any, eventData: any): Promise<void> {
    const achievements: string[] = [];
    const earnedPoints: number[] = [];

    for (const achievement of this.achievements) {
      if (achievement.condition({ ...userStats, ...eventData })) {
        achievements.push(achievement.reward.badge || 'unknown');
        earnedPoints.push(achievement.reward.points);
        
        // Show achievement notification
        this.showAchievementNotification(achievement.reward.message);
      }
    }

    if (achievements.length > 0) {
      // Update user stats with new achievements and points
      await this.updateUserStatsWithAchievements(achievements, earnedPoints);
    }
  }

  /**
   * Show achievement notification
   */
  private showAchievementNotification(message: string): void {
    // Create a toast notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          🏆
        </div>
        <div>
          <p class="font-semibold">Achievement Unlocked!</p>
          <p class="text-sm">${message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
      notification.remove();
    }, 4000);
  }

  /**
   * Update user stats with new achievements
   */
  private async updateUserStatsWithAchievements(achievements: string[], points: number[]): Promise<void> {
    try {
      const userStatsStore = useUserStatsStore.getState();
      const currentStats = userStatsStore.statistics;
      
      if (currentStats) {
        const totalNewPoints = points.reduce((sum, p) => sum + p, 0);
        const newStats = {
          ...currentStats,
          total_points: currentStats.total_points + totalNewPoints,
          achievements_unlocked: currentStats.achievements_unlocked + achievements.length
        };

        // Update local state
        userStatsStore.statistics = newStats;

        // Sync with backend (if needed)
        await api.post('/user/gamification/', {
          achievements,
          points_earned: totalNewPoints,
          event_type: 'chat_achievements'
        });
      }
    } catch (error) {
      console.warn('Failed to update user stats:', error);
    }
  }

  /**
   * Process a single event
   */
  private async processEvent(event: GamificationEvent): Promise<void> {
    try {
      const userStatsStore = useUserStatsStore.getState();
      const currentStats = userStatsStore.statistics;

      if (currentStats) {
        // Track the event
        await this.trackEvent(event);
        
        // Check for achievements
        await this.checkAchievements(currentStats, event.data);
        
        // Update points immediately for some events
        const immediatePointEvents = ['message_sent', 'response_received', 'agent_switch'];
        if (immediatePointEvents.includes(event.type)) {
          const newTotalPoints = currentStats.total_points + (event.data?.points || 0);
          userStatsStore.statistics = {
            ...currentStats,
            total_points: newTotalPoints
          };
        }
      }
    } catch (error) {
      console.warn('Failed to process event:', error);
    }
  }

  /**
   * Track event for analytics
   */
  private async trackEvent(event: GamificationEvent): Promise<void> {
    try {
      await api.post('/analytics/events/', {
        event_type: event.type,
        event_data: event.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Non-critical error, continue
      console.warn('Failed to track event:', error);
    }
  }

  /**
   * Process queued events
   */
  private async processEventQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift();
        if (event) {
          await this.processEvent(event);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Get user's current streak
   */
  getCurrentStreak(): number {
    const userStatsStore = useUserStatsStore.getState();
    return userStatsStore.statistics?.current_streak || 0;
  }

  /**
   * Get next achievement threshold
   */
  getNextAchievement(): { name: string; requirement: string; points: number } | null {
    const userStatsStore = useUserStatsStore.getState();
    const currentStats = userStatsStore.statistics;

    if (!currentStats) return null;

    // Find next achievement to unlock
    for (const achievement of this.achievements) {
      if (!achievement.condition(currentStats)) {
        return {
          name: achievement.reward.badge || 'Unknown',
          requirement: this.getAchievementRequirement(achievement.event),
          points: achievement.reward.points
        };
      }
    }

    return null;
  }

  private getAchievementRequirement(event: string): string {
    const requirements: Record<string, string> = {
      'first_chat_session': 'Complete your first chat session',
      'chat_streak_3_days': 'Chat for 3 consecutive days',
      'chat_streak_7_days': 'Chat for 7 consecutive days',
      'agent_explorer': 'Use all 4 different AI agents',
      'code_helper': 'Complete 5 coding sessions',
      'deep_thinker': 'Complete 3 advanced sessions',
      'creative_spark': 'Complete 3 creative sessions',
      'session_marathon': 'Accumulate 5 hours of chat time',
      'helpful_conversations': 'Get 10 positive ratings'
    };

    return requirements[event] || 'Keep learning!';
  }

  /**
   * Reset daily counters (called at midnight)
   */
  resetDailyCounters(): void {
    const userStatsStore = useUserStatsStore.getState();
    const currentStats = userStatsStore.statistics;

    if (currentStats) {
      // This would typically be handled by the backend
      console.log('Daily counters reset');
    }
  }
}

// Export singleton instance
const gamificationService = new GamificationService();
export default gamificationService;