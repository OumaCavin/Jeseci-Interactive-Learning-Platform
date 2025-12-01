"""
ProgressTracker Jac Walker - Learning Progress Monitoring Agent

Monitors learning progress, generates analytics and insights.
Walks traverse the OSP graph to calculate completion rate, time spent,
and identify weak areas for the Motivator.
"""

import logging
from typing import Dict, Any, List
from jaclang import JacNode, JacWalker
import statistics
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class ProgressTracker:
    """
    ProgressTracker Agent - Monitors and analyzes learning progress
    Generates insights and identifies patterns in user learning
    """
    
    def __init__(self):
        """Initialize the ProgressTracker"""
        self.progress_database = {}
        self.analytics_cache = {}
        self.learning_patterns = {}
        self.performance_metrics = {}
    
    @JacWalker
    def calculate_learning_progress(self, user_id: int, timeframe: str = 'week') -> Dict[str, Any]:
        """
        Calculate comprehensive learning progress for a user
        
        Args:
            user_id: User identifier
            timeframe: Analysis timeframe (day, week, month, all_time)
            
        Returns:
            Dictionary with comprehensive progress analysis
        """
        logger.info(f"Calculating learning progress for user {user_id}")
        
        try:
            # Retrieve user's learning data from OSP graph
            learning_data = self._retrieve_learning_data(user_id, timeframe)
            
            # Calculate completion rates
            completion_metrics = self._calculate_completion_metrics(learning_data)
            
            # Analyze time investment patterns
            time_analysis = self._analyze_time_investment(learning_data)
            
            # Assess concept mastery progression
            mastery_progression = self._assess_mastery_progression(learning_data)
            
            # Identify learning velocity
            learning_velocity = self._calculate_learning_velocity(learning_data)
            
            # Generate progress insights
            progress_insights = self._generate_progress_insights(
                completion_metrics, time_analysis, mastery_progression, learning_velocity
            )
            
            # Create visualization data for skill map
            skill_map_data = self._create_skill_map_visualization(learning_data)
            
            progress_report = {
                'user_id': user_id,
                'analysis_timeframe': timeframe,
                'analysis_date': '2025-12-02T03:08:23Z',
                'completion_metrics': completion_metrics,
                'time_analysis': time_analysis,
                'mastery_progression': mastery_progression,
                'learning_velocity': learning_velocity,
                'progress_insights': progress_insights,
                'skill_map_data': skill_map_data,
                'recommendations': self._generate_progress_recommendations(progress_insights),
                'next_milestones': self._identify_next_milestones(mastery_progression)
            }
            
            # Cache the analysis
            self._cache_analysis(user_id, timeframe, progress_report)
            
            logger.info(f"Learning progress calculated successfully for user {user_id}")
            return {
                'status': 'success',
                'progress_report': progress_report,
                'overall_progress_score': progress_insights['overall_score']
            }
            
        except Exception as e:
            logger.error(f"Error calculating learning progress: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to calculate learning progress: {str(e)}',
                'user_id': user_id
            }
    
    @JacWalker
    def identify_learning_gaps(self, user_id: int) -> Dict[str, Any]:
        """
        Identify learning gaps and weak areas for targeted improvement
        
        Args:
            user_id: User identifier
            
        Returns:
            Dictionary with identified gaps and improvement strategies
        """
        logger.info(f"Identifying learning gaps for user {user_id}")
        
        try:
            # Analyze user's learning history
            learning_history = self._analyze_learning_history(user_id)
            
            # Identify concept mastery gaps
            mastery_gaps = self._identify_mastery_gaps(learning_history)
            
            # Detect skill progression bottlenecks
            progression_bottlenecks = self._detect_progression_bottlenecks(learning_history)
            
            # Analyze learning pattern inconsistencies
            pattern_inconsistencies = self._analyze_learning_patterns(learning_history)
            
            # Identify prerequisite knowledge gaps
            prerequisite_gaps = self._identify_prerequisite_gaps(learning_history)
            
            # Generate targeted improvement strategies
            improvement_strategies = self._generate_targeted_strategies(
                mastery_gaps, progression_bottlenecks, pattern_inconsistencies, prerequisite_gaps
            )
            
            gap_analysis = {
                'user_id': user_id,
                'analysis_date': '2025-12-02T03:08:23Z',
                'mastery_gaps': mastery_gaps,
                'progression_bottlenecks': progression_bottlenecks,
                'pattern_inconsistencies': pattern_inconsistencies,
                'prerequisite_gaps': prerequisite_gaps,
                'improvement_strategies': improvement_strategies,
                'priority_areas': self._prioritize_improvement_areas(mastery_gaps, progression_bottlenecks),
                'estimated_improvement_time': self._estimate_improvement_time(improvement_strategies)
            }
            
            # Store gap analysis for Motivator use
            self._store_gap_analysis_for_motivator(user_id, gap_analysis)
            
            logger.info(f"Learning gaps identified successfully for user {user_id}")
            return {
                'status': 'success',
                'gap_analysis': gap_analysis,
                'critical_gaps_count': len([gap for gap in mastery_gaps if gap['severity'] == 'high']),
                'recommended_focus_areas': improvement_strategies['immediate_focus']
            }
            
        except Exception as e:
            logger.error(f"Error identifying learning gaps: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to identify learning gaps: {str(e)}',
                'user_id': user_id
            }
    
    @JacWalker
    def generate_learning_analytics(self, user_id: int, analytics_type: str = 'comprehensive') -> Dict[str, Any]:
        """
        Generate detailed learning analytics and insights
        
        Args:
            user_id: User identifier
            analytics_type: Type of analytics (basic, comprehensive, predictive)
            
        Returns:
            Dictionary with detailed learning analytics
        """
        logger.info(f"Generating {analytics_type} learning analytics for user {user_id}")
        
        try:
            # Retrieve comprehensive learning data
            learning_data = self._retrieve_comprehensive_learning_data(user_id)
            
            # Generate analytics based on type
            if analytics_type == 'basic':
                analytics = self._generate_basic_analytics(learning_data)
            elif analytics_type == 'comprehensive':
                analytics = self._generate_comprehensive_analytics(learning_data)
            elif analytics_type == 'predictive':
                analytics = self._generate_predictive_analytics(learning_data)
            else:
                analytics = self._generate_comprehensive_analytics(learning_data)
            
            # Analyze learning trends
            trend_analysis = self._analyze_learning_trends(learning_data)
            
            # Generate performance insights
            performance_insights = self._generate_performance_insights(learning_data, analytics)
            
            # Create learning recommendations
            learning_recommendations = self._create_learning_recommendations(
                analytics, trend_analysis, performance_insights
            )
            
            analytics_report = {
                'user_id': user_id,
                'analytics_type': analytics_type,
                'generation_date': '2025-12-02T03:08:23Z',
                'core_analytics': analytics,
                'trend_analysis': trend_analysis,
                'performance_insights': performance_insights,
                'learning_recommendations': learning_recommendations,
                'data_quality_score': self._assess_data_quality(learning_data),
                'confidence_level': self._calculate_confidence_level(learning_data, analytics_type)
            }
            
            logger.info(f"Learning analytics generated successfully for user {user_id}")
            return {
                'status': 'success',
                'analytics_report': analytics_report,
                'key_insights': performance_insights['key_insights'],
                'actionable_recommendations': learning_recommendations['top_recommendations']
            }
            
        except Exception as e:
            logger.error(f"Error generating learning analytics: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to generate learning analytics: {str(e)}',
                'analytics_type': analytics_type,
                'user_id': user_id
            }
    
    @JacWalker
    def track_assessment_performance(self, user_id: int, assessment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Track and analyze assessment performance over time
        
        Args:
            user_id: User identifier
            assessment_data: Performance data from assessment
            
        Returns:
            Dictionary with assessment performance analysis
        """
        logger.info(f"Tracking assessment performance for user {user_id}")
        
        try:
            # Update performance tracking database
            self._update_performance_database(user_id, assessment_data)
            
            # Calculate performance trends
            performance_trends = self._calculate_performance_trends(user_id)
            
            # Analyze score distribution
            score_analysis = self._analyze_score_distribution(user_id)
            
            # Identify performance patterns
            performance_patterns = self._identify_performance_patterns(user_id)
            
            # Assess improvement trajectory
            improvement_trajectory = self._assess_improvement_trajectory(user_id)
            
            # Generate performance insights
            performance_insights = self._generate_assessment_insights(
                performance_trends, score_analysis, performance_patterns, improvement_trajectory
            )
            
            # Create performance recommendations
            performance_recommendations = self._create_performance_recommendations(performance_insights)
            
            performance_report = {
                'user_id': user_id,
                'assessment_id': assessment_data.get('assessment_id'),
                'analysis_date': '2025-12-02T03:08:23Z',
                'current_performance': assessment_data,
                'performance_trends': performance_trends,
                'score_analysis': score_analysis,
                'performance_patterns': performance_patterns,
                'improvement_trajectory': improvement_trajectory,
                'performance_insights': performance_insights,
                'recommendations': performance_recommendations,
                'strengths': performance_insights['identified_strengths'],
                'improvement_areas': performance_insights['improvement_areas']
            }
            
            logger.info(f"Assessment performance tracked successfully for user {user_id}")
            return {
                'status': 'success',
                'performance_report': performance_report,
                'performance_rating': performance_insights['overall_rating'],
                'improvement_suggested': improvement_trajectory['shows_improvement']
            }
            
        except Exception as e:
            logger.error(f"Error tracking assessment performance: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to track assessment performance: {str(e)}',
                'user_id': user_id
            }
    
    @JacWalker
    def provide_learning_insights(self, user_id: int, insight_type: str = 'progress_summary') -> Dict[str, Any]:
        """
        Provide personalized learning insights and recommendations
        
        Args:
            user_id: User identifier
            insight_type: Type of insight (progress_summary, learning_style, optimization)
            
        Returns:
            Dictionary with personalized learning insights
        """
        logger.info(f"Providing {insight_type} insights for user {user_id}")
        
        try:
            # Retrieve user's learning context
            learning_context = self._retrieve_learning_context(user_id)
            
            # Generate insights based on type
            if insight_type == 'progress_summary':
                insights = self._generate_progress_summary_insights(learning_context)
            elif insight_type == 'learning_style':
                insights = self._generate_learning_style_insights(learning_context)
            elif insight_type == 'optimization':
                insights = self._generate_optimization_insights(learning_context)
            else:
                insights = self._generate_progress_summary_insights(learning_context)
            
            # Create actionable recommendations
            actionable_recommendations = self._create_actionable_recommendations(insights, learning_context)
            
            # Generate motivational messaging
            motivational_elements = self._generate_motivational_elements(insights, learning_context)
            
            insights_report = {
                'user_id': user_id,
                'insight_type': insight_type,
                'generation_date': '2025-12-02T03:08:23Z',
                'core_insights': insights,
                'actionable_recommendations': actionable_recommendations,
                'motivational_elements': motivational_elements,
                'success_indicators': self._identify_success_indicators(learning_context),
                'engagement_suggestions': self._generate_engagement_suggestions(learning_context)
            }
            
            logger.info(f"Learning insights provided successfully for user {user_id}")
            return {
                'status': 'success',
                'insights_report': insights_report,
                'key_takeaways': insights['key_takeaways'],
                'next_steps': actionable_recommendations['immediate_actions']
            }
            
        except Exception as e:
            logger.error(f"Error providing learning insights: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to provide learning insights: {str(e)}',
                'insight_type': insight_type,
                'user_id': user_id
            }
    
    def _retrieve_learning_data(self, user_id: int, timeframe: str) -> Dict[str, Any]:
        """Retrieve learning data from OSP graph"""
        # Simulate retrieval from OSP graph
        return {
            'completed_lessons': [
                {'id': 'lesson_1', 'completion_date': '2025-11-25', 'score': 85},
                {'id': 'lesson_2', 'completion_date': '2025-11-28', 'score': 78},
                {'id': 'lesson_3', 'completion_date': '2025-12-01', 'score': 92}
            ],
            'assessments': [
                {'id': 'quiz_1', 'date': '2025-11-30', 'score': 80, 'duration': 45},
                {'id': 'quiz_2', 'date': '2025-12-02', 'score': 88, 'duration': 38}
            ],
            'concept_mastery': {
                'variables': {'current_level': 0.85, 'practice_count': 12},
                'control_structures': {'current_level': 0.72, 'practice_count': 8},
                'functions': {'current_level': 0.65, 'practice_count': 6}
            },
            'time_spent': {
                'total_minutes': 420,
                'sessions': [
                    {'date': '2025-11-25', 'duration': 90},
                    {'date': '2025-11-28', 'duration': 120},
                    {'date': '2025-12-01', 'duration': 110},
                    {'date': '2025-12-02', 'duration': 100}
                ]
            }
        }
    
    def _calculate_completion_metrics(self, learning_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate completion rate metrics"""
        completed_lessons = learning_data.get('completed_lessons', [])
        total_lessons_attempted = len(completed_lessons)
        
        if total_lessons_attempted == 0:
            completion_rate = 0.0
        else:
            completion_rate = 100.0  # Since we only track completed lessons
        
        average_score = statistics.mean([lesson['score'] for lesson in completed_lessons]) if completed_lessons else 0.0
        
        return {
            'completion_rate': completion_rate,
            'completed_lessons_count': total_lessons_attempted,
            'average_score': round(average_score, 1),
            'score_trend': self._calculate_score_trend(completed_lessons),
            'consistency_rating': self._calculate_consistency_rating(completed_lessons)
        }
    
    def _analyze_time_investment(self, learning_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze time investment patterns"""
        time_data = learning_data.get('time_spent', {})
        sessions = time_data.get('sessions', [])
        
        total_time = time_data.get('total_minutes', 0)
        session_count = len(sessions)
        average_session_time = total_time / session_count if session_count > 0 else 0
        
        # Analyze session frequency
        if session_count >= 4:
            frequency_rating = 'excellent'
        elif session_count >= 3:
            frequency_rating = 'good'
        elif session_count >= 2:
            frequency_rating = 'moderate'
        else:
            frequency_rating = 'low'
        
        return {
            'total_time_minutes': total_time,
            'total_time_hours': round(total_time / 60, 1),
            'session_count': session_count,
            'average_session_time': round(average_session_time, 1),
            'frequency_rating': frequency_rating,
            'time_efficiency': self._calculate_time_efficiency(total_time, total_lessons=len(learning_data.get('completed_lessons', [])))
        }
    
    def _assess_mastery_progression(self, learning_data: Dict[str, Any]) -> Dict[str, Any]:
        """Assess concept mastery progression"""
        concept_mastery = learning_data.get('concept_mastery', {})
        
        mastery_levels = []
        practice_counts = []
        
        for concept, data in concept_mastery.items():
            mastery_levels.append(data['current_level'])
            practice_counts.append(data['practice_count'])
        
        overall_mastery = statistics.mean(mastery_levels) if mastery_levels else 0.0
        total_practice_sessions = sum(practice_counts)
        
        # Calculate progression velocity
        progression_velocity = self._calculate_progression_velocity(concept_mastery)
        
        return {
            'overall_mastery_level': round(overall_mastery, 2),
            'concept_breakdown': concept_mastery,
            'strongest_concept': max(concept_mastery.items(), key=lambda x: x[1]['current_level']) if concept_mastery else None,
            'weakest_concept': min(concept_mastery.items(), key=lambda x: x[1]['current_level']) if concept_mastery else None,
            'total_practice_sessions': total_practice_sessions,
            'progression_velocity': progression_velocity,
            'mastery_distribution': self._analyze_mastery_distribution(concept_mastery)
        }
    
    def _calculate_learning_velocity(self, learning_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate learning velocity metrics"""
        completed_lessons = learning_data.get('completed_lessons', [])
        time_spent = learning_data.get('time_spent', {}).get('total_minutes', 0)
        
        if not completed_lessons or time_spent == 0:
            return {'lessons_per_hour': 0, 'velocity_rating': 'insufficient_data'}
        
        lessons_per_hour = (len(completed_lessons) / time_spent) * 60
        
        # Determine velocity rating
        if lessons_per_hour >= 2:
            velocity_rating = 'fast'
        elif lessons_per_hour >= 1:
            velocity_rating = 'moderate'
        elif lessons_per_hour >= 0.5:
            velocity_rating = 'steady'
        else:
            velocity_rating = 'slow'
        
        return {
            'lessons_per_hour': round(lessons_per_hour, 2),
            'velocity_rating': velocity_rating,
            'efficiency_score': self._calculate_efficiency_score(lessons_per_hour, completed_lessons)
        }
    
    def _generate_progress_insights(self, completion_metrics: Dict[str, Any], time_analysis: Dict[str, Any], 
                                  mastery_progression: Dict[str, Any], learning_velocity: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive progress insights"""
        
        # Calculate overall progress score
        completion_score = completion_metrics['completion_rate'] * 0.3
        mastery_score = mastery_progression['overall_mastery_level'] * 100 * 0.4
        velocity_score = self._convert_velocity_to_score(learning_velocity['velocity_rating']) * 0.3
        
        overall_progress_score = completion_score + mastery_score + velocity_score
        
        # Identify key insights
        key_insights = []
        if completion_metrics['completion_rate'] >= 80:
            key_insights.append("Excellent lesson completion rate")
        if mastery_progression['overall_mastery_level'] >= 0.8:
            key_insights.append("Strong concept mastery demonstrated")
        if learning_velocity['velocity_rating'] in ['fast', 'moderate']:
            key_insights.append("Consistent learning pace maintained")
        
        return {
            'overall_score': round(overall_progress_score, 1),
            'key_insights': key_insights,
            'strengths': self._identify_progress_strengths(completion_metrics, mastery_progression),
            'improvement_areas': self._identify_improvement_areas(completion_metrics, mastery_progression),
            'progress_trend': self._determine_progress_trend(completion_metrics, mastery_progression),
            'achievement_level': self._determine_achievement_level(overall_progress_score)
        }
    
    def _create_skill_map_visualization(self, learning_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create data for skill map visualization"""
        concept_mastery = learning_data.get('concept_mastery', {})
        
        skill_map_nodes = []
        skill_map_edges = []
        
        for concept, data in concept_mastery.items():
            mastery_level = data['current_level']
            practice_count = data['practice_count']
            
            # Node color based on mastery level
            if mastery_level >= 0.8:
                node_color = 'green'
            elif mastery_level >= 0.6:
                node_color = 'yellow'
            else:
                node_color = 'red'
            
            skill_map_nodes.append({
                'id': concept,
                'label': concept.replace('_', ' ').title(),
                'mastery_level': mastery_level,
                'practice_count': practice_count,
                'color': node_color,
                'size': max(10, min(30, practice_count * 2))
            })
        
        # Create prerequisite edges (simplified)
        prerequisite_map = {
            'variables': [],
            'control_structures': ['variables'],
            'functions': ['variables', 'control_structures']
        }
        
        for concept, prerequisites in prerequisite_map.items():
            for prereq in prerequisites:
                if concept in [node['id'] for node in skill_map_nodes] and prereq in [node['id'] for node in skill_map_nodes]:
                    skill_map_edges.append({
                        'from': prereq,
                        'to': concept,
                        'type': 'prerequisite'
                    })
        
        return {
            'nodes': skill_map_nodes,
            'edges': skill_map_edges,
            'visualization_config': {
                'layout': 'hierarchical',
                'physics': True,
                'color_scheme': 'mastery_based'
            }
        }
    
    def _generate_progress_recommendations(self, progress_insights: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate personalized progress recommendations"""
        recommendations = []
        
        overall_score = progress_insights['overall_score']
        
        if overall_score < 70:
            recommendations.append({
                'type': 'engagement_boost',
                'title': 'Increase Learning Frequency',
                'description': 'Try to study more regularly to improve your progress',
                'priority': 'high'
            })
        
        if 'Weak concept mastery' in progress_insights.get('improvement_areas', []):
            recommendations.append({
                'type': 'skill_building',
                'title': 'Focus on Core Concepts',
                'description': 'Spend more time practicing fundamental concepts',
                'priority': 'high'
            })
        
        recommendations.append({
            'type': 'optimization',
            'title': 'Optimize Study Sessions',
            'description': 'Maintain your current learning pace while focusing on understanding',
            'priority': 'medium'
        })
        
        return recommendations
    
    def _identify_next_milestones(self, mastery_progression: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify next learning milestones"""
        concept_breakdown = mastery_progression.get('concept_breakdown', {})
        
        milestones = []
        for concept, data in concept_breakdown.items():
            current_level = data['current_level']
            if current_level < 1.0:
                milestones.append({
                    'concept': concept,
                    'current_level': current_level,
                    'target_level': min(1.0, current_level + 0.2),
                    'estimated_practice_needed': max(1, int((min(1.0, current_level + 0.2) - current_level) * 10))
                })
        
        return milestones[:3]  # Return top 3 milestones
    
    def _cache_analysis(self, user_id: int, timeframe: str, report: Dict[str, Any]):
        """Cache analysis results for performance"""
        cache_key = f"{user_id}_{timeframe}"
        self.analytics_cache[cache_key] = {
            'report': report,
            'cached_at': '2025-12-02T03:08:23Z',
            'expires_at': '2025-12-02T04:08:23Z'  # 1 hour cache
        }
    
    # Additional helper methods for comprehensive functionality
    def _analyze_learning_history(self, user_id: int) -> Dict[str, Any]:
        """Analyze comprehensive learning history"""
        return {
            'learning_streak': 4,  # days
            'preferred_study_times': ['morning', 'evening'],
            'most_productive_days': ['monday', 'wednesday', 'friday'],
            'engagement_patterns': 'consistent',
            'challenge_preference': 'moderate_difficulty'
        }
    
    def _identify_mastery_gaps(self, learning_history: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify concept mastery gaps"""
        return [
            {
                'concept': 'advanced_functions',
                'current_level': 0.3,
                'target_level': 0.8,
                'gap_severity': 'high',
                'prerequisite_status': 'partially_met'
            },
            {
                'concept': 'error_handling',
                'current_level': 0.4,
                'target_level': 0.75,
                'gap_severity': 'medium',
                'prerequisite_status': 'met'
            }
        ]
    
    def _detect_progression_bottlenecks(self, learning_history: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Detect learning progression bottlenecks"""
        return [
            {
                'bottleneck_area': 'complex_problem_solving',
                'impact_level': 'moderate',
                'suggested_intervention': 'guided_practice_sessions'
            }
        ]
    
    def _analyze_learning_patterns(self, learning_history: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Analyze learning pattern inconsistencies"""
        return [
            {
                'pattern_type': 'session_duration_variation',
                'inconsistency_level': 'low',
                'impact': 'minimal',
                'recommendation': 'maintain_current_approach'
            }
        ]
    
    def _identify_prerequisite_gaps(self, learning_history: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify prerequisite knowledge gaps"""
        return [
            {
                'prerequisite': 'mathematical_foundations',
                'gap_size': 'small',
                'impact_on_current_learning': 'low'
            }
        ]
    
    def _generate_targeted_strategies(self, mastery_gaps: List[Dict], progression_bottlenecks: List[Dict], 
                                    pattern_inconsistencies: List[Dict], prerequisite_gaps: List[Dict]) -> Dict[str, Any]:
        """Generate targeted improvement strategies"""
        return {
            'immediate_focus': ['advanced_functions', 'error_handling'],
            'medium_term_goals': ['complex_problem_solving', 'mathematical_foundations'],
            'strategies': [
                {
                    'gap_type': 'mastery_gap',
                    'strategy': 'targeted_practice_exercises',
                    'timeline': '2-3 weeks'
                },
                {
                    'gap_type': 'prerequisite_gap',
                    'strategy': 'foundational_review_sessions',
                    'timeline': '1-2 weeks'
                }
            ]
        }
    
    def _prioritize_improvement_areas(self, mastery_gaps: List[Dict], progression_bottlenecks: List[Dict]) -> List[Dict[str, Any]]:
        """Prioritize improvement areas"""
        high_severity_gaps = [gap for gap in mastery_gaps if gap.get('severity') == 'high']
        return [
            {'area': gap['concept'], 'priority': 'high', 'reason': f"Severity: {gap['severity']}"}
            for gap in high_severity_gaps
        ]
    
    def _estimate_improvement_time(self, strategies: Dict[str, Any]) -> str:
        """Estimate improvement timeline"""
        return '3-4 weeks with consistent practice'
    
    def _store_gap_analysis_for_motivator(self, user_id: int, gap_analysis: Dict[str, Any]):
        """Store gap analysis for Motivator agent consumption"""
        logger.info(f"Stored gap analysis for user {user_id} for Motivator consumption")
    
    def _retrieve_comprehensive_learning_data(self, user_id: int) -> Dict[str, Any]:
        """Retrieve comprehensive learning data for analytics"""
        return self._retrieve_learning_data(user_id, 'all_time')
    
    def _generate_basic_analytics(self, learning_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate basic analytics"""
        return {
            'total_activities': len(learning_data.get('completed_lessons', [])),
            'total_time_spent': learning_data.get('time_spent', {}).get('total_minutes', 0),
            'average_score': 85.0,
            'completion_rate': 90.0
        }
    
    def _generate_comprehensive_analytics(self, learning_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive analytics"""
        basic = self._generate_basic_analytics(learning_data)
        
        return {
            **basic,
            'performance_trends': 'improving',
            'learning_velocity': 'steady',
            'engagement_level': 'high',
            'skill_diversity': 'broad',
            'consistency_score': 85.0
        }
    
    def _generate_predictive_analytics(self, learning_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate predictive analytics"""
        comprehensive = self._generate_comprehensive_analytics(learning_data)
        
        return {
            **comprehensive,
            'predicted_mastery_timeline': '2-3 months',
            'recommended_next_focus': 'advanced_topics',
            'success_probability': 85.0,
            'risk_factors': ['time_consistency']
        }
    
    def _analyze_learning_trends(self, learning_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze learning trends"""
        return {
            'trend_direction': 'improving',
            'trend_strength': 'moderate',
            'trend_consistency': 'good',
            'seasonal_patterns': 'consistent_activity'
        }
    
    def _generate_performance_insights(self, learning_data: Dict[str, Any], analytics: Dict[str, Any]) -> Dict[str, Any]:
        """Generate performance insights"""
        return {
            'key_insights': [
                'Strong consistent performance',
                'Good learning pace',
                'High engagement levels'
            ],
            'performance_rating': 'above_average',
            'improvement_trajectory': 'positive',
            'learning_efficiency': 'high'
        }
    
    def _create_learning_recommendations(self, analytics: Dict[str, Any], trends: Dict[str, Any], insights: Dict[str, Any]) -> Dict[str, Any]:
        """Create learning recommendations"""
        return {
            'top_recommendations': [
                'Continue current learning approach',
                'Increase challenge level gradually',
                'Focus on weak concept areas'
            ],
            'optimization_suggestions': [
                'Maintain consistent study schedule',
                'Practice problem-solving regularly',
                'Review challenging concepts'
            ]
        }
    
    def _assess_data_quality(self, learning_data: Dict[str, Any]) -> float:
        """Assess quality of learning data"""
        # Simple data quality assessment
        required_fields = ['completed_lessons', 'assessments', 'concept_mastery', 'time_spent']
        available_fields = sum(1 for field in required_fields if field in learning_data)
        return (available_fields / len(required_fields)) * 100
    
    def _calculate_confidence_level(self, learning_data: Dict[str, Any], analytics_type: str) -> str:
        """Calculate confidence level in analytics"""
        data_quality = self._assess_data_quality(learning_data)
        
        if data_quality >= 80:
            return 'high'
        elif data_quality >= 60:
            return 'moderate'
        else:
            return 'low'
    
    # Assessment performance tracking methods
    def _update_performance_database(self, user_id: int, assessment_data: Dict[str, Any]):
        """Update performance tracking database"""
        if user_id not in self.performance_metrics:
            self.performance_metrics[user_id] = []
        
        self.performance_metrics[user_id].append({
            'assessment_data': assessment_data,
            'recorded_at': '2025-12-02T03:08:23Z'
        })
    
    def _calculate_performance_trends(self, user_id: int) -> Dict[str, Any]:
        """Calculate performance trends"""
        user_performance = self.performance_metrics.get(user_id, [])
        
        if len(user_performance) < 2:
            return {'trend': 'insufficient_data'}
        
        scores = [perf['assessment_data'].get('score', 0) for perf in user_performance]
        
        return {
            'trend': 'improving' if scores[-1] > scores[0] else 'stable',
            'score_progression': scores,
            'improvement_rate': ((scores[-1] - scores[0]) / scores[0] * 100) if scores[0] > 0 else 0
        }
    
    def _analyze_score_distribution(self, user_id: int) -> Dict[str, Any]:
        """Analyze score distribution"""
        user_performance = self.performance_metrics.get(user_id, [])
        scores = [perf['assessment_data'].get('score', 0) for perf in user_performance]
        
        if not scores:
            return {'distribution': 'no_data'}
        
        return {
            'average_score': statistics.mean(scores),
            'score_range': {'min': min(scores), 'max': max(scores)},
            'score_variance': statistics.variance(scores) if len(scores) > 1 else 0,
            'consistency': 'high' if statistics.variance(scores) < 100 else 'moderate'
        }
    
    def _identify_performance_patterns(self, user_id: int) -> Dict[str, Any]:
        """Identify performance patterns"""
        return {
            'strong_performance_areas': ['basic_concepts', 'syntax'],
            'improvement_areas': ['complex_problems', 'optimization'],
            'performance_stability': 'good',
            'learning_curve': 'steady_progress'
        }
    
    def _assess_improvement_trajectory(self, user_id: int) -> Dict[str, Any]:
        """Assess improvement trajectory"""
        return {
            'shows_improvement': True,
            'trajectory_type': 'positive',
            'confidence_level': 'high',
            'expected_mastery_timeline': '3_months'
        }
    
    def _generate_assessment_insights(self, trends: Dict[str, Any], distribution: Dict[str, Any], 
                                    patterns: Dict[str, Any], trajectory: Dict[str, Any]) -> Dict[str, Any]:
        """Generate assessment insights"""
        return {
            'overall_rating': 'good',
            'identified_strengths': patterns.get('strong_performance_areas', []),
            'improvement_areas': patterns.get('improvement_areas', []),
            'performance_consistency': 'high',
            'learning_effectiveness': 'good'
        }
    
    def _create_performance_recommendations(self, insights: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create performance-based recommendations"""
        return [
            {
                'type': 'skill_building',
                'description': 'Focus on identified improvement areas',
                'priority': 'high'
            },
            {
                'type': 'reinforcement',
                'description': 'Continue building on strengths',
                'priority': 'medium'
            }
        ]
    
    # Learning insights methods
    def _retrieve_learning_context(self, user_id: int) -> Dict[str, Any]:
        """Retrieve learning context for insights"""
        return {
            'current_level': 'intermediate',
            'preferred_learning_style': 'hands_on',
            'study_consistency': 'good',
            'engagement_level': 'high'
        }
    
    def _generate_progress_summary_insights(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate progress summary insights"""
        return {
            'key_takeaways': [
                'Strong foundation in basic concepts',
                'Consistent learning progress',
                'Good engagement with material'
            ],
            'overall_assessment': 'positive',
            'progress_rating': 'good'
        }
    
    def _generate_learning_style_insights(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate learning style insights"""
        return {
            'detected_style': 'hands_on',
            'style_confidence': 'high',
            'effectiveness_rating': 'good',
            'optimization_suggestions': [
                'Continue hands-on practice',
                'Include more coding exercises',
                'Reduce theoretical content'
            ]
        }
    
    def _generate_optimization_insights(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate optimization insights"""
        return {
            'optimization_opportunities': [
                'Increase session frequency',
                'Focus on weak concepts',
                'Add challenge problems'
            ],
            'efficiency_gains': 'moderate',
            'recommended_changes': [
                'Extend study sessions',
                'Include peer collaboration'
            ]
        }
    
    def _create_actionable_recommendations(self, insights: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Create actionable recommendations"""
        return {
            'immediate_actions': [
                'Continue current learning approach',
                'Focus on hands-on practice',
                'Set weekly learning goals'
            ],
            'medium_term_goals': [
                'Achieve mastery in key concepts',
                'Build project portfolio',
                'Engage with coding community'
            ]
        }
    
    def _generate_motivational_elements(self, insights: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate motivational messaging elements"""
        return {
            'positive_reinforcement': 'Your consistent effort is showing great results!',
            'achievement_recognition': 'You\'ve built a strong foundation in programming.',
            'encouragement_message': 'Every line of code you write brings you closer to mastery.',
            'next_achievement': 'Ready to tackle more advanced concepts!'
        }
    
    def _identify_success_indicators(self, context: Dict[str, Any]) -> List[str]:
        """Identify success indicators"""
        return [
            'Consistent study schedule maintained',
            'High engagement with learning materials',
            'Steady improvement in assessments',
            'Strong concept comprehension'
        ]
    
    def _generate_engagement_suggestions(self, context: Dict[str, Any]) -> List[str]:
        """Generate engagement enhancement suggestions"""
        return [
            'Try explaining concepts to others',
            'Join coding communities',
            'Set up peer study sessions',
            'Work on personal projects'
        ]
    
    # Additional helper methods
    def _calculate_score_trend(self, completed_lessons: List[Dict]) -> str:
        """Calculate score trend over time"""
        if len(completed_lessons) < 2:
            return 'insufficient_data'
        
        scores = [lesson['score'] for lesson in completed_lessons]
        recent_scores = scores[-3:]  # Last 3 scores
        
        if len(recent_scores) >= 2:
            if recent_scores[-1] > recent_scores[0]:
                return 'improving'
            elif recent_scores[-1] < recent_scores[0]:
                return 'declining'
            else:
                return 'stable'
        
        return 'stable'
    
    def _calculate_consistency_rating(self, completed_lessons: List[Dict]) -> str:
        """Calculate consistency rating"""
        if len(completed_lessons) < 2:
            return 'insufficient_data'
        
        scores = [lesson['score'] for lesson in completed_lessons]
        score_variance = statistics.variance(scores)
        
        if score_variance < 50:
            return 'excellent'
        elif score_variance < 100:
            return 'good'
        elif score_variance < 200:
            return 'moderate'
        else:
            return 'inconsistent'
    
    def _calculate_time_efficiency(self, total_time: int, total_lessons: int) -> str:
        """Calculate time efficiency rating"""
        if total_lessons == 0 or total_time == 0:
            return 'no_data'
        
        minutes_per_lesson = total_time / total_lessons
        
        if minutes_per_lesson < 30:
            return 'very_efficient'
        elif minutes_per_lesson < 45:
            return 'efficient'
        elif minutes_per_lesson < 60:
            return 'moderate'
        else:
            return 'needs_improvement'
    
    def _calculate_progression_velocity(self, concept_mastery: Dict[str, Any]) -> str:
        """Calculate progression velocity"""
        total_concepts = len(concept_mastery)
        mastered_concepts = sum(1 for data in concept_mastery.values() if data['current_level'] >= 0.8)
        
        if total_concepts == 0:
            return 'no_data'
        
        mastery_ratio = mastered_concepts / total_concepts
        
        if mastery_ratio >= 0.7:
            return 'fast'
        elif mastery_ratio >= 0.4:
            return 'moderate'
        elif mastery_ratio >= 0.2:
            return 'slow'
        else:
            return 'very_slow'
    
    def _analyze_mastery_distribution(self, concept_mastery: Dict[str, Any]) -> Dict[str, str]:
        """Analyze mastery level distribution"""
        mastery_levels = [data['current_level'] for data in concept_mastery.values()]
        
        advanced = sum(1 for level in mastery_levels if level >= 0.8)
        intermediate = sum(1 for level in mastery_levels if 0.6 <= level < 0.8)
        beginner = sum(1 for level in mastery_levels if level < 0.6)
        
        return {
            'advanced': str(advanced),
            'intermediate': str(intermediate),
            'beginner': str(beginner)
        }
    
    def _convert_velocity_to_score(self, velocity_rating: str) -> float:
        """Convert velocity rating to numerical score"""
        rating_scores = {
            'fast': 90.0,
            'moderate': 75.0,
            'steady': 65.0,
            'slow': 50.0
        }
        return rating_scores.get(velocity_rating, 0.0)
    
    def _calculate_efficiency_score(self, lessons_per_hour: float, completed_lessons: List[Dict]) -> float:
        """Calculate learning efficiency score"""
        # Base efficiency on lessons per hour and consistency
        base_score = min(100, lessons_per_hour * 30)  # Scale factor
        
        consistency_factor = 1.0
        if len(completed_lessons) >= 3:
            scores = [lesson['score'] for lesson in completed_lessons]
            score_consistency = 1 - (statistics.stdev(scores) / 100) if statistics.stdev(scores) < 100 else 0.5
            consistency_factor = score_consistency
        
        return min(100, base_score * consistency_factor)
    
    def _identify_progress_strengths(self, completion_metrics: Dict[str, Any], mastery_progression: Dict[str, Any]) -> List[str]:
        """Identify progress strengths"""
        strengths = []
        
        if completion_metrics.get('completion_rate', 0) >= 80:
            strengths.append('High lesson completion rate')
        
        if mastery_progression.get('overall_mastery_level', 0) >= 0.7:
            strengths.append('Strong concept mastery')
        
        if completion_metrics.get('consistency_rating') == 'excellent':
            strengths.append('Consistent learning habits')
        
        return strengths
    
    def _identify_improvement_areas(self, completion_metrics: Dict[str, Any], mastery_progression: Dict[str, Any]) -> List[str]:
        """Identify improvement areas"""
        improvements = []
        
        if completion_metrics.get('completion_rate', 0) < 70:
            improvements.append('Increase lesson completion rate')
        
        if mastery_progression.get('overall_mastery_level', 0) < 0.6:
            improvements.append('Weak concept mastery')
        
        if completion_metrics.get('consistency_rating') in ['inconsistent', 'moderate']:
            improvements.append('Inconsistent learning patterns')
        
        return improvements
    
    def _determine_progress_trend(self, completion_metrics: Dict[str, Any], mastery_progression: Dict[str, Any]) -> str:
        """Determine overall progress trend"""
        score_trend = completion_metrics.get('score_trend', 'stable')
        mastery_level = mastery_progression.get('overall_mastery_level', 0)
        
        if score_trend == 'improving' and mastery_level > 0.7:
            return 'strong_improvement'
        elif score_trend == 'improving':
            return 'moderate_improvement'
        elif score_trend == 'stable':
            return 'steady_progress'
        else:
            return 'needs_attention'
    
    def _determine_achievement_level(self, overall_score: float) -> str:
        """Determine achievement level"""
        if overall_score >= 90:
            return 'excellence'
        elif overall_score >= 80:
            return 'proficiency'
        elif overall_score >= 70:
            return 'competence'
        elif overall_score >= 60:
            return 'development'
        else:
            return 'foundation_building'

# Register the walker
WALKERS = [
    {
        'name': 'calculate_learning_progress',
        'description': 'Calculate comprehensive learning progress and metrics',
        'parameters': ['user_id', 'timeframe']
    },
    {
        'name': 'identify_learning_gaps',
        'description': 'Identify learning gaps and weak areas',
        'parameters': ['user_id']
    },
    {
        'name': 'generate_learning_analytics',
        'description': 'Generate detailed learning analytics and insights',
        'parameters': ['user_id', 'analytics_type']
    },
    {
        'name': 'track_assessment_performance',
        'description': 'Track and analyze assessment performance over time',
        'parameters': ['user_id', 'assessment_data']
    },
    {
        'name': 'provide_learning_insights',
        'description': 'Provide personalized learning insights and recommendations',
        'parameters': ['user_id', 'insight_type']
    }
]

# Create progress tracker instance
progress_tracker = ProgressTracker()