"""
Motivator Jac Walker - Learning Motivation and Gamification Agent

Provides encouragement, gamification, and achievement tracking.
Walkers check for milestones, generate encouraging messages, and manage gamification badges.
"""

import logging
from typing import Dict, Any, List
from jaclang import JacNode, JacWalker, byLLM
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class Motivator:
    """
    Motivator Agent - Provides motivation, encouragement, and gamification
    Generates personalized motivational messages and tracks achievements
    """
    
    def __init__(self):
        """Initialize the Motivator"""
        self.achievement_system = self._initialize_achievement_system()
        self.gamification_elements = self._initialize_gamification_elements()
        self.motivational_templates = self._initialize_motivational_templates()
        self.user_motivation_history = {}
        self.badge_registry = self._initialize_badge_registry()
    
    @JacWalker
    @byLLM
    def generate_personalized_encouragement(self, user_id: int, context: str, performance_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate personalized encouragement using byLLM based on user performance
        
        Args:
            user_id: User identifier
            context: Current learning context
            performance_data: Recent performance data
            
        Returns:
            Dictionary with personalized encouragement and motivational elements
        """
        logger.info(f"Generating personalized encouragement for user {user_id} in {context}")
        
        try:
            # Analyze user's motivational profile
            motivation_profile = self._analyze_user_motivation_profile(user_id, performance_data)
            
            # Determine motivational approach based on context and performance
            motivational_strategy = self._determine_motivational_strategy(context, performance_data, motivation_profile)
            
            # Generate personalized message using LLM
            personalized_message = self._llm_generate_personalized_message(
                motivational_strategy, context, performance_data, user_id
            )
            
            # Select appropriate motivational elements
            motivational_elements = self._select_motivational_elements(motivational_strategy, performance_data)
            
            # Create encouragement framework
            encouragement_framework = {
                'message': personalized_message,
                'tone': motivational_strategy['tone'],
                'focus': motivational_strategy['focus_area'],
                'confidence_boost': motivational_elements['confidence_boost'],
                'next_step_guidance': motivational_elements['next_steps'],
                'celebration_elements': motivational_elements['celebrations']
            }
            
            # Generate challenge and goal recommendations
            challenge_recommendations = self._generate_challenge_recommendations(motivational_strategy, performance_data)
            
            # Create motivational action plan
            motivational_action_plan = self._create_motivational_action_plan(
                encouragement_framework, challenge_recommendations, user_id
            )
            
            encouragement_response = {
                'user_id': user_id,
                'context': context,
                'generation_date': '2025-12-02T03:08:23Z',
                'motivational_profile': motivation_profile,
                'motivational_strategy': motivational_strategy,
                'encouragement_framework': encouragement_framework,
                'challenge_recommendations': challenge_recommendations,
                'action_plan': motivational_action_plan,
                'gamification_elements': self._apply_gamification_elements(performance_data),
                'next_motivation_trigger': self._calculate_next_motivation_trigger(motivational_strategy, performance_data)
            }
            
            # Update user motivation history
            self._update_motivation_history(user_id, encouragement_response)
            
            logger.info(f"Personalized encouragement generated successfully for user {user_id}")
            return {
                'status': 'success',
                'encouragement': encouragement_response,
                'primary_message': personalized_message['main_message'],
                'motivation_level': motivational_strategy['intensity'],
                'immediate_action': motivational_elements['immediate_action']
            }
            
        except Exception as e:
            logger.error(f"Error generating personalized encouragement: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to generate personalized encouragement: {str(e)}',
                'user_id': user_id,
                'context': context
            }
    
    @JacWalker
    def check_and_award_achievements(self, user_id: int, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Check for achievements and award appropriate badges
        
        Args:
            user_id: User identifier
            activity_data: Recent learning activity data
            
        Returns:
            Dictionary with achievement results and badge awards
        """
        logger.info(f"Checking achievements for user {user_id}")
        
        try:
            # Retrieve user's current achievement status
            current_achievements = self._get_user_achievements(user_id)
            
            # Check for new achievements
            new_achievements = self._check_new_achievements(user_id, activity_data, current_achievements)
            
            # Generate achievement messages
            achievement_messages = self._generate_achievement_messages(new_achievements, user_id)
            
            # Update user's achievement registry
            updated_achievements = self._update_achievement_registry(user_id, current_achievements, new_achievements)
            
            # Calculate achievement progress
            achievement_progress = self._calculate_achievement_progress(updated_achievements)
            
            # Generate next achievement recommendations
            next_achievements = self._recommend_next_achievements(updated_achievements, user_id)
            
            achievement_response = {
                'user_id': user_id,
                'check_date': '2025-12-02T03:08:23Z',
                'current_achievements': updated_achievements,
                'new_achievements': new_achievements,
                'achievement_messages': achievement_messages,
                'achievement_progress': achievement_progress,
                'next_recommendations': next_achievements,
                'total_badges': len(updated_achievements),
                'achievement_level': self._determine_achievement_level(updated_achievements),
                'milestone_celebration': self._generate_milestone_celebration(updated_achievements, user_id)
            }
            
            logger.info(f"Achievement check completed for user {user_id}, {len(new_achievements)} new achievements")
            return {
                'status': 'success',
                'achievement_response': achievement_response,
                'new_badges_earned': len(new_achievements),
                'celebration_message': achievement_messages['primary_celebration'] if new_achievements else None
            }
            
        except Exception as e:
            logger.error(f"Error checking achievements: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to check achievements: {str(e)}',
                'user_id': user_id
            }
    
    @JacWalker
    def create_gamification_elements(self, user_id: int, learning_context: str) -> Dict[str, Any]:
        """
        Create gamification elements for the current learning context
        
        Args:
            user_id: User identifier
            learning_context: Current learning context
            
        Returns:
            Dictionary with gamification elements and engagement features
        """
        logger.info(f"Creating gamification elements for user {user_id}")
        
        try:
            # Analyze user's gamification preferences
            gamification_profile = self._analyze_gamification_profile(user_id, learning_context)
            
            # Generate personalized challenges
            personalized_challenges = self._generate_personalized_challenges(user_id, learning_context, gamification_profile)
            
            # Create progress visualization elements
            progress_elements = self._create_progress_visualization(user_id, gamification_profile)
            
            # Generate reward system
            reward_system = self._create_reward_system(user_id, gamification_profile)
            
            # Design social engagement features
            social_features = self._design_social_engagement(gamification_profile)
            
            gamification_package = {
                'user_id': user_id,
                'learning_context': learning_context,
                'creation_date': '2025-12-02T03:08:23Z',
                'gamification_profile': gamification_profile,
                'challenges': personalized_challenges,
                'progress_elements': progress_elements,
                'reward_system': reward_system,
                'social_features': social_features,
                'engagement_mechanics': self._define_engagement_mechanics(gamification_profile),
                'motivation_triggers': self._design_motivation_triggers(gamification_profile),
                'progress_tracking': self._setup_progress_tracking(user_id, gamification_profile)
            }
            
            logger.info(f"Gamification elements created successfully for user {user_id}")
            return {
                'status': 'success',
                'gamification_package': gamification_package,
                'primary_challenge': personalized_challenges['main_challenge'],
                'engagement_level': gamification_profile['preferred_engagement_intensity']
            }
            
        except Exception as e:
            logger.error(f"Error creating gamification elements: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to create gamification elements: {str(e)}',
                'user_id': user_id
            }
    
    @JacWalker
    @byLLM
    def provide_challenge_recommendations(self, user_id: int, current_skill_level: str, learning_goals: List[str]) -> Dict[str, Any]:
        """
        Provide personalized challenge recommendations using byLLM
        
        Args:
            user_id: User identifier
            current_skill_level: Current skill level
            learning_goals: List of learning goals
            
        Returns:
            Dictionary with personalized challenge recommendations
        """
        logger.info(f"Providing challenge recommendations for user {user_id}")
        
        try:
            # Analyze user's challenge readiness
            challenge_readiness = self._analyze_challenge_readiness(user_id, current_skill_level)
            
            # Generate challenge recommendations using LLM
            challenge_recommendations = self._llm_generate_challenge_recommendations(
                current_skill_level, learning_goals, challenge_readiness, user_id
            )
            
            # Create challenge progression path
            progression_path = self._create_challenge_progression_path(challenge_recommendations, current_skill_level)
            
            # Design challenge support systems
            support_systems = self._design_challenge_support_systems(challenge_readiness)
            
            challenge_package = {
                'user_id': user_id,
                'current_skill_level': current_skill_level,
                'learning_goals': learning_goals,
                'generation_date': '2025-12-02T03:08:23Z',
                'challenge_readiness': challenge_readiness,
                'recommendations': challenge_recommendations,
                'progression_path': progression_path,
                'support_systems': support_systems,
                'difficulty_scaling': self._design_difficulty_scaling(challenge_recommendations),
                'success_metrics': self._define_success_metrics(challenge_recommendations),
                'encouragement_framework': self._create_challenge_encouragement(challenge_readiness)
            }
            
            logger.info(f"Challenge recommendations provided successfully for user {user_id}")
            return {
                'status': 'success',
                'challenge_package': challenge_package,
                'recommended_challenges': challenge_recommendations['primary_challenges'],
                'confidence_level': challenge_readiness['confidence_level']
            }
            
        except Exception as e:
            logger.error(f"Error providing challenge recommendations: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to provide challenge recommendations: {str(e)}',
                'user_id': user_id
            }
    
    @JacWalker
    def create_motivational_streaks(self, user_id: int, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create and track motivational learning streaks
        
        Args:
            user_id: User identifier
            activity_data: Recent activity data
            
        Returns:
            Dictionary with streak information and motivational elements
        """
        logger.info(f"Managing motivational streaks for user {user_id}")
        
        try:
            # Update user's activity streak
            current_streak = self._update_activity_streak(user_id, activity_data)
            
            # Generate streak-based motivation
            streak_motivation = self._generate_streak_motivation(current_streak, user_id)
            
            # Create streak celebration elements
            celebration_elements = self._create_streak_celebration(current_streak)
            
            # Design streak preservation strategies
            preservation_strategies = self._design_streak_preservation_strategies(current_streak)
            
            # Generate streak milestone rewards
            milestone_rewards = self._generate_streak_milestone_rewards(current_streak)
            
            streak_response = {
                'user_id': user_id,
                'update_date': '2025-12-02T03:08:23Z',
                'current_streak': current_streak,
                'streak_motivation': streak_motivation,
                'celebration_elements': celebration_elements,
                'preservation_strategies': preservation_strategies,
                'milestone_rewards': milestone_rewards,
                'streak_analysis': self._analyze_streak_patterns(user_id),
                'motivation_boost': self._calculate_streak_motivation_boost(current_streak),
                'next_milestone': self._identify_next_streak_milestone(current_streak)
            }
            
            logger.info(f"Motivational streaks managed successfully for user {user_id}")
            return {
                'status': 'success',
                'streak_response': streak_response,
                'current_streak_days': current_streak['current_days'],
                'streak_status': current_streak['status'],
                'motivation_message': streak_motivation['primary_message']
            }
            
        except Exception as e:
            logger.error(f"Error managing motivational streaks: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to manage motivational streaks: {str(e)}',
                'user_id': user_id
            }
    
    def _initialize_achievement_system(self) -> Dict[str, Any]:
        """Initialize the achievement system with badge definitions"""
        return {
            'learning_milestones': {
                'first_lesson': {
                    'name': 'First Steps',
                    'description': 'Completed your first lesson',
                    'icon': '🎯',
                    'rarity': 'common',
                    'points': 10
                },
                'five_lessons': {
                    'name': 'Dedicated Learner',
                    'description': 'Completed 5 lessons',
                    'icon': '📚',
                    'rarity': 'common',
                    'points': 50
                },
                'perfect_score': {
                    'name': 'Perfectionist',
                    'description': 'Achieved perfect score on an assessment',
                    'icon': '⭐',
                    'rarity': 'rare',
                    'points': 100
                },
                'streak_7_days': {
                    'name': 'Week Warrior',
                    'description': 'Maintained 7-day learning streak',
                    'icon': '🔥',
                    'rarity': 'rare',
                    'points': 75
                },
                'concept_mastery': {
                    'name': 'Concept Champion',
                    'description': 'Achieved mastery in 5 concepts',
                    'icon': '🏆',
                    'rarity': 'epic',
                    'points': 200
                }
            },
            'skill_achievements': {
                'problem_solver': {
                    'name': 'Problem Solver',
                    'description': 'Solved 10 complex challenges',
                    'icon': '🧩',
                    'rarity': 'rare',
                    'points': 150
                },
                'speed_learner': {
                    'name': 'Speed Learner',
                    'description': 'Completed lesson in record time',
                    'icon': '⚡',
                    'rarity': 'epic',
                    'points': 250
                }
            },
            'engagement_badges': {
                'early_bird': {
                    'name': 'Early Bird',
                    'description': 'Completed lesson before 8 AM',
                    'icon': '🌅',
                    'rarity': 'uncommon',
                    'points': 25
                },
                'night_owl': {
                    'name': 'Night Owl',
                    'description': 'Completed lesson after 10 PM',
                    'icon': '🦉',
                    'rarity': 'uncommon',
                    'points': 25
                },
                'consistent_learner': {
                    'name': 'Consistent Learner',
                    'description': 'Maintained learning schedule for 30 days',
                    'icon': '📅',
                    'rarity': 'legendary',
                    'points': 500
                }
            }
        }
    
    def _initialize_gamification_elements(self) -> Dict[str, Any]:
        """Initialize gamification elements"""
        return {
            'challenge_types': [
                'daily_challenge',
                'weekly_sprint',
                'concept_mastery_challenge',
                'speed_challenge',
                'consistency_challenge'
            ],
            'reward_types': [
                'points',
                'badges',
                'unlock_features',
                'progress_multipliers',
                'special_content'
            ],
            'progress_indicators': [
                'experience_bar',
                'skill_tree',
                'achievement_showcase',
                'streak_counter',
                'leaderboard_position'
            ]
        }
    
    def _initialize_motivational_templates(self) -> Dict[str, Any]:
        """Initialize motivational message templates"""
        return {
            'achievement_celebration': [
                "🎉 Amazing work, {name}! You've just earned the {badge_name} badge!",
                "🌟 Incredible achievement! {badge_description}",
                "🏆 Outstanding! You've unlocked {badge_name} - this shows real dedication!"
            ],
            'progress_encouragement': [
                "You're making fantastic progress, {name}! Keep up the great work!",
                "I can see your hard work paying off! You're really growing as a learner.",
                "Your dedication is inspiring! Each step forward brings you closer to mastery."
            ],
            'challenge_motivation': [
                "Ready for a new challenge, {name}? I believe you can tackle this!",
                "Every expert was once a beginner. You're on the path to expertise!",
                "Challenge accepted! Let's see what you can accomplish."
            ],
            'streak_celebration': [
                "🔥 Incredible streak, {name}! {streak_days} days of consistent learning!",
                "You're on fire! {streak_days} days of dedication shows real commitment.",
                "Your streak is amazing! {streak_days} days of growth and learning!"
            ]
        }
    
    def _initialize_badge_registry(self) -> Dict[str, Dict[str, Any]]:
        """Initialize user badge registry"""
        return {}
    
    def _analyze_user_motivation_profile(self, user_id: int, performance_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user's motivation profile"""
        # Analyze recent performance patterns
        recent_scores = performance_data.get('recent_scores', [75, 80, 85])
        improvement_trend = recent_scores[-1] > recent_scores[0] if len(recent_scores) >= 2 else False
        
        return {
            'motivation_style': 'achievement_focused' if improvement_trend else 'progress_focused',
            'confidence_level': self._assess_confidence_level(performance_data),
            'preferred_celebration': 'achievements' if performance_data.get('completed_challenges', 0) > 3 else 'progress',
            'challenge_preference': 'moderate' if performance_data.get('average_score', 75) > 70 else 'encouraging',
            'encouragement_frequency': 'high' if performance_data.get('struggle_indicators', False) else 'balanced'
        }
    
    def _determine_motivational_strategy(self, context: str, performance_data: Dict[str, Any], motivation_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Determine appropriate motivational strategy"""
        
        if context == 'struggling':
            return {
                'tone': 'encouraging',
                'focus_area': 'build_confidence',
                'intensity': 'gentle',
                'approach': 'progress_celebration'
            }
        elif context == 'success':
            return {
                'tone': 'celebratory',
                'focus_area': 'achievement_recognition',
                'intensity': 'enthusiastic',
                'approach': 'milestone_celebration'
            }
        else:  # neutral context
            return {
                'tone': 'motivational',
                'focus_area': 'continued_progress',
                'intensity': 'balanced',
                'approach': 'goal_oriented'
            }
    
    def _llm_generate_personalized_message(self, strategy: Dict[str, Any], context: str, performance_data: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        """Generate personalized message using LLM"""
        # Simulate LLM-generated personalized message
        approach = strategy['approach']
        
        if approach == 'progress_celebration':
            message = "I can see the effort you're putting into learning, and it's really paying off! Your progress shows that you're building a strong foundation."
        elif approach == 'milestone_celebration':
            message = "Outstanding work! You've just achieved something significant, and this demonstrates your growing mastery."
        else:  # goal_oriented
            message = "You're making excellent progress on your learning journey. Let's set our sights on the next milestone!"
        
        return {
            'main_message': message,
            'supporting_message': "Remember, every expert was once a beginner. Your dedication is inspiring.",
            'confidence_message': "You have all the skills needed to succeed. Trust in your abilities!",
            'call_to_action': "Let's keep building on this momentum!"
        }
    
    def _select_motivational_elements(self, strategy: Dict[str, Any], performance_data: Dict[str, Any]) -> Dict[str, Any]:
        """Select appropriate motivational elements"""
        return {
            'confidence_boost': strategy['focus_area'] == 'build_confidence',
            'achievement_highlight': strategy['focus_area'] == 'achievement_recognition',
            'progress_celebration': strategy['approach'] == 'progress_celebration',
            'next_steps': [
                'Continue with current concepts',
                'Take on a new challenge',
                'Review recent material'
            ],
            'celebrations': [
                'progress_badges',
                'encouraging_messages',
                'achievement_highlights'
            ],
            'immediate_action': 'keep_learning'
        }
    
    def _generate_challenge_recommendations(self, strategy: Dict[str, Any], performance_data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Generate challenge recommendations"""
        if strategy['intensity'] == 'gentle':
            return {
                'easy_challenges': [
                    'Complete a review session',
                    'Practice basic concepts',
                    'Read additional examples'
                ],
                'moderate_challenges': [
                    'Solve a simple coding challenge',
                    'Explain a concept to someone else',
                    'Create a small project'
                ],
                'difficult_challenges': [
                    'Tackle an advanced problem',
                    'Build a complete application',
                    'Mentor another learner'
                ]
            }
        else:
            return {
                'easy_challenges': [
                    'Master a new concept',
                    'Complete an assessment',
                    'Practice problem-solving'
                ],
                'moderate_challenges': [
                    'Build a functional application',
                    'Participate in a coding challenge',
                    'Create educational content'
                ],
                'difficult_challenges': [
                    'Develop a complex project',
                    'Contribute to open source',
                    'Lead a learning session'
                ]
            }
    
    def _create_motivational_action_plan(self, framework: Dict[str, Any], challenges: Dict[str, List[str]], user_id: int) -> Dict[str, Any]:
        """Create motivational action plan"""
        return {
            'immediate_goals': challenges['easy_challenges'][:2],
            'weekly_objectives': challenges['moderate_challenges'][:2],
            'monthly_aspirations': challenges['difficult_challenges'][:1],
            'success_metrics': [
                'Consistent daily practice',
                'Steady skill improvement',
                'Increased confidence'
            ],
            'support_resources': [
                'Practice exercises',
                'Peer collaboration',
                'Mentor guidance'
            ]
        }
    
    def _apply_gamification_elements(self, performance_data: Dict[str, Any]) -> Dict[str, Any]:
        """Apply gamification elements to motivation"""
        return {
            'points_earned': performance_data.get('score', 75) * 10,
            'experience_multiplier': 1.2 if performance_data.get('streak_days', 0) > 3 else 1.0,
            'badges_nearby': self._identify_nearby_badges(performance_data),
            'leaderboard_potential': 'high' if performance_data.get('average_score', 0) > 80 else 'moderate'
        }
    
    def _calculate_next_motivation_trigger(self, strategy: Dict[str, Any], performance_data: Dict[str, Any]) -> str:
        """Calculate when to trigger next motivation"""
        streak_days = performance_data.get('streak_days', 0)
        
        if streak_days >= 7:
            return 'streak_celebration'
        elif performance_data.get('recent_score', 0) > 85:
            return 'achievement_check'
        else:
            return 'weekly_progress_review'
    
    def _update_motivation_history(self, user_id: int, encouragement_data: Dict[str, Any]):
        """Update user's motivation history"""
        if user_id not in self.user_motivation_history:
            self.user_motivation_history[user_id] = []
        
        self.user_motivation_history[user_id].append({
            'encouragement_data': encouragement_data,
            'timestamp': '2025-12-02T03:08:23Z',
            'context': encouragement_data['context']
        })
        
        # Keep only recent history (last 50 entries)
        if len(self.user_motivation_history[user_id]) > 50:
            self.user_motivation_history[user_id] = self.user_motivation_history[user_id][-50:]
    
    # Achievement system methods
    def _get_user_achievements(self, user_id: int) -> List[Dict[str, Any]]:
        """Get user's current achievements"""
        return self.badge_registry.get(user_id, [])
    
    def _check_new_achievements(self, user_id: int, activity_data: Dict[str, Any], current_achievements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Check for new achievements"""
        new_achievements = []
        
        # Check lesson completion achievements
        lessons_completed = activity_data.get('lessons_completed', 0)
        
        if lessons_completed >= 1 and not self._has_achievement(current_achievements, 'first_lesson'):
            new_achievements.append(self._create_achievement('learning_milestones', 'first_lesson'))
        
        if lessons_completed >= 5 and not self._has_achievement(current_achievements, 'five_lessons'):
            new_achievements.append(self._create_achievement('learning_milestones', 'five_lessons'))
        
        # Check perfect score achievement
        if activity_data.get('perfect_score_achieved', False) and not self._has_achievement(current_achievements, 'perfect_score'):
            new_achievements.append(self._create_achievement('learning_milestones', 'perfect_score'))
        
        # Check streak achievements
        streak_days = activity_data.get('streak_days', 0)
        if streak_days >= 7 and not self._has_achievement(current_achievements, 'streak_7_days'):
            new_achievements.append(self._create_achievement('learning_milestones', 'streak_7_days'))
        
        return new_achievements
    
    def _create_achievement(self, category: str, achievement_id: str) -> Dict[str, Any]:
        """Create achievement object"""
        achievement_def = self.achievement_system[category][achievement_id]
        
        return {
            'category': category,
            'achievement_id': achievement_id,
            'name': achievement_def['name'],
            'description': achievement_def['description'],
            'icon': achievement_def['icon'],
            'rarity': achievement_def['rarity'],
            'points': achievement_def['points'],
            'earned_date': '2025-12-02T03:08:23Z'
        }
    
    def _has_achievement(self, achievements: List[Dict[str, Any]], achievement_id: str) -> bool:
        """Check if user has specific achievement"""
        return any(ach['achievement_id'] == achievement_id for ach in achievements)
    
    def _generate_achievement_messages(self, new_achievements: List[Dict[str, Any]], user_id: int) -> Dict[str, str]:
        """Generate achievement celebration messages"""
        if not new_achievements:
            return {
                'primary_celebration': '',
                'secondary_messages': []
            }
        
        primary_achievement = new_achievements[0]
        message_template = self.motivational_templates['achievement_celebration'][0]
        
        primary_message = message_template.format(
            name='Learner',  # Would use actual user name
            badge_name=primary_achievement['name']
        )
        
        secondary_messages = [
            f"🏆 {achievement['description']} You've earned {achievement['points']} points!"
            for achievement in new_achievements[1:3]  # Limit to 3 total
        ]
        
        return {
            'primary_celebration': primary_message,
            'secondary_messages': secondary_messages,
            'total_points_earned': sum(ach['points'] for ach in new_achievements)
        }
    
    def _update_achievement_registry(self, user_id: int, current_achievements: List[Dict[str, Any]], new_achievements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Update user's achievement registry"""
        updated_achievements = current_achievements + new_achievements
        
        self.badge_registry[user_id] = updated_achievements
        
        return updated_achievements
    
    def _calculate_achievement_progress(self, achievements: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate achievement progress statistics"""
        total_points = sum(ach['points'] for ach in achievements)
        total_badges = len(achievements)
        
        # Count achievements by rarity
        rarity_counts = {}
        for ach in achievements:
            rarity = ach['rarity']
            rarity_counts[rarity] = rarity_counts.get(rarity, 0) + 1
        
        return {
            'total_points': total_points,
            'total_badges': total_badges,
            'rarity_breakdown': rarity_counts,
            'completion_percentage': min(100, (total_points / 1000) * 100),  # Assuming 1000 points for 100%
            'achievement_level': self._calculate_achievement_level(total_points)
        }
    
    def _calculate_achievement_level(self, total_points: int) -> str:
        """Calculate achievement level based on points"""
        if total_points >= 500:
            return 'Legendary'
        elif total_points >= 300:
            return 'Epic'
        elif total_quantity >= 150:
            return 'Rare'
        elif total_points >= 50:
            return 'Uncommon'
        else:
            return 'Common'
    
    def _recommend_next_achievements(self, achievements: List[Dict[str, Any]], user_id: int) -> List[Dict[str, Any]]:
        """Recommend next achievable achievements"""
        earned_ids = {ach['achievement_id'] for ach in achievements}
        
        recommendations = []
        for category, category_achievements in self.achievement_system.items():
            for ach_id, ach_def in category_achievements.items():
                if ach_id not in earned_ids:
                    recommendations.append({
                        'achievement_id': ach_id,
                        'name': ach_def['name'],
                        'description': ach_def['description'],
                        'icon': ach_def['icon'],
                        'progress_needed': self._assess_achievement_progress_needed(ach_id, user_id),
                        'estimated_timeline': self._estimate_achievement_timeline(ach_id)
                    })
        
        return sorted(recommendations, key=lambda x: x['estimated_timeline'])[:3]  # Top 3 recommendations
    
    def _assess_achievement_progress_needed(self, achievement_id: str, user_id: int) -> str:
        """Assess progress needed for achievement"""
        # Simplified progress assessment
        progress_map = {
            'first_lesson': '0%',
            'five_lessons': '60%',
            'perfect_score': '0%',
            'streak_7_days': '50%',
            'concept_mastery': '30%'
        }
        return progress_map.get(achievement_id, 'Unknown')
    
    def _estimate_achievement_timeline(self, achievement_id: str) -> str:
        """Estimate time to achieve achievement"""
        timeline_map = {
            'first_lesson': 'Immediate',
            'five_lessons': '1 week',
            'perfect_score': '2 weeks',
            'streak_7_days': '1 week',
            'concept_mastery': '1 month'
        }
        return timeline_map.get(achievement_id, 'Unknown')
    
    def _generate_milestone_celebration(self, achievements: List[Dict[str, Any]], user_id: int) -> Dict[str, Any]:
        """Generate milestone celebration for significant achievements"""
        milestone_thresholds = [5, 10, 25, 50, 100]  # Number of achievements
        
        current_count = len(achievements)
        milestone_reached = None
        
        for threshold in milestone_thresholds:
            if current_count >= threshold:
                milestone_reached = threshold
        
        if milestone_reached:
            return {
                'milestone_reached': milestone_reached,
                'celebration_type': 'achievement_milestone',
                'special_badge': 'milestone_master',
                'celebration_message': f"🎉 Incredible! You've reached {milestone_reached} achievements!",
                'special_rewards': ['exclusive_badge', 'progress_multiplier', 'special_content_unlock']
            }
        
        return {'milestone_reached': None}
    
    # Gamification methods
    def _analyze_gamification_profile(self, user_id: int, learning_context: str) -> Dict[str, Any]:
        """Analyze user's gamification preferences"""
        return {
            'preferred_engagement_intensity': 'moderate',
            'gamification_style': 'achievement_focused',
            'social_preference': 'individual',
            'challenge_preference': 'progressive',
            'reward_preference': 'badges_and_points',
            'competition_level': 'low'
        }
    
    def _generate_personalized_challenges(self, user_id: int, learning_context: str, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalized challenges"""
        challenge_types = profile['challenge_preference']
        
        main_challenge = {
            'title': 'Master the Fundamentals',
            'description': 'Complete 5 lessons with 80%+ scores',
            'duration': '1 week',
            'difficulty': 'progressive',
            'rewards': ['100 points', 'Fundamentals Master badge']
        }
        
        daily_challenge = {
            'title': 'Daily Code Practice',
            'description': 'Solve 3 coding problems daily',
            'duration': 'daily',
            'difficulty': 'moderate',
            'rewards': ['10 points per problem', 'Practice streak bonus']
        }
        
        return {
            'main_challenge': main_challenge,
            'daily_challenge': daily_challenge,
            'optional_challenges': [
                {
                    'title': 'Speed Learning',
                    'description': 'Complete a lesson in under 20 minutes',
                    'rewards': ['Speed Learner badge', '50 bonus points']
                }
            ]
        }
    
    def _create_progress_visualization(self, user_id: int, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Create progress visualization elements"""
        return {
            'progress_bars': {
                'overall_progress': {
                    'current': 65,
                    'max': 100,
                    'color': 'blue',
                    'label': 'Overall Progress'
                },
                'skill_mastery': {
                    'current': 3,
                    'max': 10,
                    'color': 'green',
                    'label': 'Mastered Concepts'
                }
            },
            'skill_tree': {
                'unlocked_nodes': ['Variables', 'Data Types', 'Basic Operations'],
                'next_nodes': ['Control Structures', 'Functions'],
                'connection_status': 'active'
            },
            'achievement_showcase': {
                'recent_badges': ['First Steps', 'Dedicated Learner'],
                'featured_achievement': 'Perfectionist',
                'progress_indicators': True
            }
        }
    
    def _create_reward_system(self, user_id: int, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Create personalized reward system"""
        return {
            'point_system': {
                'lesson_completion': 50,
                'perfect_score': 100,
                'daily_streak': 25,
                'challenge_completion': 75
            },
            'unlock_criteria': {
                'advanced_content': 500,
                'special_features': 1000,
                'mentor_access': 1500
            },
            'reward_tiers': [
                {'tier': 'Bronze', 'points_needed': 0, 'rewards': ['Basic features']},
                {'tier': 'Silver', 'points_needed': 250, 'rewards': ['Advanced exercises']},
                {'tier': 'Gold', 'points_needed': 500, 'rewards': ['Priority support']},
                {'tier': 'Platinum', 'points_needed': 1000, 'rewards': ['Mentor access']}
            ]
        }
    
    def _design_social_engagement(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Design social engagement features"""
        return {
            'peer_learning': {
                'study_groups': 'available',
                'pair_programming': 'optional',
                'knowledge_sharing': 'encouraged'
            },
            'community_features': {
                'discussion_forums': 'active',
                'progress_sharing': 'optional',
                'achievement_celebration': 'enabled'
            },
            'competition_elements': {
                'leaderboards': 'personal',
                'challenge_competitions': 'monthly',
                'team_challenges': 'quarterly'
            }
        }
    
    def _define_engagement_mechanics(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Define engagement mechanics"""
        return {
            'session_triggers': [
                'daily_reminder',
                'progress_update',
                'achievement_unlock'
            ],
            'retention_strategies': [
                'streak_preservation',
                'progressive_challenges',
                'personalized_content'
            ],
            'motivation_maintenance': [
                'regular_encouragement',
                'milestone_celebration',
                'growth_recognition'
            ]
        }
    
    def _design_motivation_triggers(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Design motivation triggers"""
        return {
            'achievement_triggers': [
                'lesson_completion',
                'score_improvement',
                'streak_milestones'
            ],
            'encouragement_timing': [
                'struggle_detection',
                'progress_stagnation',
                'goal_approach'
            ],
            'celebration_moments': [
                'first_success',
                'breakthrough_moments',
                'mastery_achievement'
            ]
        }
    
    def _setup_progress_tracking(self, user_id: int, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Setup progress tracking system"""
        return {
            'tracking_metrics': [
                'daily_activity',
                'skill_progression',
                'achievement_earning',
                'streak_maintenance'
            ],
            'reporting_frequency': 'daily',
            'progress_visualization': 'real_time',
            'goal_setting': 'dynamic'
        }
    
    # Challenge recommendation methods
    def _analyze_challenge_readiness(self, user_id: int, current_skill_level: str) -> Dict[str, Any]:
        """Analyze user's readiness for challenges"""
        return {
            'confidence_level': 'high',
            'skill_suitability': 'well_prepared',
            'challenge_tolerance': 'moderate',
            'motivation_state': 'engaged',
            'recommended_difficulty': 'intermediate'
        }
    
    def _llm_generate_challenge_recommendations(self, skill_level: str, goals: List[str], readiness: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        """Generate challenge recommendations using LLM"""
        # Simulate LLM-based challenge generation
        return {
            'primary_challenges': [
                {
                    'title': 'Build a Calculator Application',
                    'description': 'Create a functional calculator with basic operations',
                    'difficulty': 'intermediate',
                    'skills_required': ['variables', 'functions', 'user_input'],
                    'estimated_time': '2-3 hours',
                    'rewards': ['150 points', 'Application Builder badge']
                },
                {
                    'title': 'Data Structure Implementation',
                    'description': 'Implement and test a custom list data structure',
                    'difficulty': 'intermediate',
                    'skills_required': ['object_oriented', 'algorithms'],
                    'estimated_time': '3-4 hours',
                    'rewards': ['200 points', 'Data Structure Expert badge']
                }
            ],
            'support_resources': [
                'Step-by-step tutorials',
                'Code examples',
                'Peer consultation'
            ],
            'difficulty_progression': [
                'Start with basic features',
                'Add complexity gradually',
                'Test and debug regularly'
            ]
        }
    
    def _create_challenge_progression_path(self, challenges: Dict[str, Any], skill_level: str) -> Dict[str, Any]:
        """Create challenge progression path"""
        return {
            'pathway': 'skill_building',
            'milestones': [
                {'milestone': 'Basic Application', 'challenge_index': 0},
                {'milestone': 'Enhanced Features', 'challenge_index': 1},
                {'milestone': 'Advanced Implementation', 'challenge_index': 2}
            ],
            'skill_requirements': challenges['primary_challenges'][0]['skills_required'],
            'progression_criteria': [
                'Complete previous challenge',
                'Achieve 80% score on assessments',
                'Demonstrate understanding in practice'
            ]
        }
    
    def _design_challenge_support_systems(self, readiness: Dict[str, Any]) -> Dict[str, Any]:
        """Design support systems for challenges"""
        return {
            'hints_system': {
                'available': True,
                'frequency': 'on_request',
                'types': ['progressive', 'specific', 'conceptual']
            },
            'help_resources': [
                'Documentation links',
                'Video tutorials',
                'Peer support'
            ],
            'progress_feedback': {
                'real_time': True,
                'detailed': True,
                'encouraging': True
            }
        }
    
    def _design_difficulty_scaling(self, challenges: Dict[str, Any]) -> Dict[str, Any]:
        """Design difficulty scaling system"""
        return {
            'scaling_approach': 'adaptive',
            'adjustment_triggers': [
                'struggle_indicators',
                'completion_speed',
                'error_frequency'
            ],
            'scaling_options': [
                'reduce_complexity',
                'add_guidance',
                'break_into_steps'
            ]
        }
    
    def _define_success_metrics(self, challenges: Dict[str, Any]) -> Dict[str, Any]:
        """Define success metrics for challenges"""
        return {
            'completion_criteria': [
                'Functional implementation',
                'Error-free execution',
                'Code quality standards'
            ],
            'quality_indicators': [
                'Clean code structure',
                'Proper documentation',
                'Efficient algorithms'
            ],
            'success_weighting': {
                'functionality': 0.4,
                'quality': 0.3,
                'innovation': 0.2,
                'efficiency': 0.1
            }
        }
    
    def _create_challenge_encouragement(self, readiness: Dict[str, Any]) -> Dict[str, Any]:
        """Create encouragement framework for challenges"""
        return {
            'pre_challenge_motivation': "You're ready for this challenge! Your preparation has been excellent.",
            'during_challenge_support': "Remember, every expert was once a beginner. Take it one step at a time.",
            'post_challenge_celebration': "Regardless of the outcome, your effort and persistence are commendable.",
            'encouragement_flexibility': 'adaptive_based_on_progress'
        }
    
    # Streak management methods
    def _update_activity_streak(self, user_id: int, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user's activity streak"""
        # Simulate streak calculation
        current_streak = activity_data.get('current_streak_days', 3)
        activity_date = '2025-12-02'
        
        if activity_data.get('activity_completed', True):
            current_streak += 1
            status = 'active'
        else:
            current_streak = 0
            status = 'broken'
        
        return {
            'current_days': current_streak,
            'longest_streak': max(current_streak, activity_data.get('longest_streak', 0)),
            'status': status,
            'last_activity_date': activity_date,
            'streak_milestone': self._check_streak_milestone(current_streak)
        }
    
    def _check_streak_milestone(self, current_streak: int) -> str:
        """Check if streak reached a milestone"""
        milestones = [3, 7, 14, 30, 60, 100]
        
        if current_streak in milestones:
            return f"{current_streak}_days"
        elif current_streak > 100:
            return "century_club"
        else:
            return "none"
    
    def _generate_streak_motivation(self, streak_data: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        """Generate streak-based motivation"""
        current_days = streak_data['current_days']
        
        if current_days >= 30:
            message = f"Amazing dedication! {current_days} days of consistent learning shows real commitment!"
            intensity = 'high'
        elif current_days >= 7:
            message = f"Great streak! {current_days} days of learning is impressive. Keep it up!"
            intensity = 'moderate'
        else:
            message = f"You're building momentum! {current_days} days and counting!"
            intensity = 'encouraging'
        
        return {
            'primary_message': message,
            'intensity': intensity,
            'streak_appreciation': f"{current_days} days of growth and learning!",
            'momentum_acknowledgment': "Your consistency is inspiring!"
        }
    
    def _create_streak_celebration(self, streak_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create streak celebration elements"""
        current_days = streak_data['current_days']
        milestone = streak_data.get('streak_milestone', 'none')
        
        celebration = {
            'basic_celebration': '🔥',
            'milestone_emoji': '🏆' if milestone != 'none' else '⭐',
            'celebration_message': f"{current_days} days of awesome learning!",
            'special_effects': 'streak_fire' if current_days >= 7 else 'progress_sparkles'
        }
        
        if milestone != 'none':
            celebration['milestone_celebration'] = f"🎉 {milestone.replace('_', ' ').title()} Achievement Unlocked!"
            celebration['special_rewards'] = ['streak_bonus_points', 'exclusive_badge']
        
        return celebration
    
    def _design_streak_preservation_strategies(self, streak_data: Dict[str, Any]) -> Dict[str, Any]:
        """Design strategies to preserve streak"""
        return {
            'reminder_system': {
                'daily_notification': True,
                'motivational_reminder': True,
                'progress_update': True
            },
            'support_measures': [
                'gentle_nudges',
                'progress_celebration',
                'failure_prevention'
            ],
            'recovery_options': [
                'streak_freeze_token',
                'catch_up_opportunity',
                'grace_period'
            ]
        }
    
    def _generate_streak_milestone_rewards(self, streak_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate streak milestone rewards"""
        current_days = streak_data['current_days']
        
        rewards = {}
        
        if current_days >= 3:
            rewards['3_days'] = {'points': 25, 'badge': 'Getting Started'}
        if current_days >= 7:
            rewards['7_days'] = {'points': 75, 'badge': 'Week Warrior'}
        if current_days >= 30:
            rewards['30_days'] = {'points': 200, 'badge': 'Monthly Master'}
        if current_days >= 100:
            rewards['100_days'] = {'points': 500, 'badge': 'Century Club'}
        
        return rewards
    
    def _analyze_streak_patterns(self, user_id: int) -> Dict[str, Any]:
        """Analyze user's streak patterns"""
        return {
            'pattern_type': 'consistent_daily',
            'strengths': ['regular_schedule', 'high_adherence'],
            'vulnerabilities': ['weekend_drops'],
            'optimization_suggestions': [
                'Weekend reminder system',
                'Backup activity options'
            ]
        }
    
    def _calculate_streak_motivation_boost(self, streak_data: Dict[str, Any]) -> float:
        """Calculate motivation boost from streak"""
        current_days = streak_data['current_days']
        
        # Motivation boost increases with streak length but caps
        boost = min(20, current_days * 2)
        return boost
    
    def _identify_next_streak_milestone(self, streak_data: Dict[str, Any]) -> Dict[str, Any]:
        """Identify next streak milestone"""
        current_days = streak_data['current_days']
        
        milestones = [7, 14, 30, 60, 100]
        next_milestone = None
        
        for milestone in milestones:
            if current_days < milestone:
                next_milestone = milestone
                break
        
        if next_milestone:
            days_to_go = next_milestone - current_days
            return {
                'milestone': next_milestone,
                'days_remaining': days_to_go,
                'encouragement': f"Only {days_to_go} days until your next milestone!"
            }
        
        return {'milestone': None, 'message': "You've reached all current milestones!"}
    
    # Helper methods
    def _assess_confidence_level(self, performance_data: Dict[str, Any]) -> str:
        """Assess user's confidence level"""
        recent_scores = performance_data.get('recent_scores', [75, 80, 85])
        
        if len(recent_scores) >= 2:
            trend = recent_scores[-1] - recent_scores[0]
            if trend > 5:
                return 'high'
            elif trend > 0:
                return 'moderate'
            else:
                return 'building'
        
        return 'developing'
    
    def _identify_nearby_badges(self, performance_data: Dict[str, Any]) -> List[str]:
        """Identify badges near achievement"""
        return [
            'Dedicated Learner (4/5 lessons)',
            'Perfect Score (90% achieved)',
            'Week Warrior (6/7 days)'
        ]
    
    def _determine_achievement_level(self, achievements: List[Dict[str, Any]]) -> str:
        """Determine overall achievement level"""
        total_points = sum(ach['points'] for ach in achievements)
        return self._calculate_achievement_level(total_points)

# Register the walker
WALKERS = [
    {
        'name': 'generate_personalized_encouragement',
        'description': 'Generate personalized encouragement using byLLM',
        'parameters': ['user_id', 'context', 'performance_data']
    },
    {
        'name': 'check_and_award_achievements',
        'description': 'Check for achievements and award badges',
        'parameters': ['user_id', 'activity_data']
    },
    {
        'name': 'create_gamification_elements',
        'description': 'Create gamification elements for learning context',
        'parameters': ['user_id', 'learning_context']
    },
    {
        'name': 'provide_challenge_recommendations',
        'description': 'Provide personalized challenge recommendations using byLLM',
        'parameters': ['user_id', 'current_skill_level', 'learning_goals']
    },
    {
        'name': 'create_motivational_streaks',
        'description': 'Create and manage motivational learning streaks',
        'parameters': ['user_id', 'activity_data']
    }
]

# Create motivator instance
motivator = Motivator()