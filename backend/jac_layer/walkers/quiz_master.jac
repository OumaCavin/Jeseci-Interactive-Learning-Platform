"""
QuizMaster Jac Walker - Adaptive Quiz Generation Agent

Generates adaptive quizzes and assessments based on learning progress.
Uses @byLLM decorator to dynamically generate questions based on user's
current mastery level from the OSP graph.
"""

import logging
from typing import Dict, Any, List
from jaclang import JacNode, JacWalker, byLLM
import random
import json

logger = logging.getLogger(__name__)

class QuizMaster:
    """
    QuizMaster Agent - Generates adaptive quizzes and assessments
    Uses byLLM to create personalized questions based on user mastery levels
    """
    
    def __init__(self):
        """Initialize the QuizMaster"""
        self.question_bank = self._initialize_question_bank()
        self.adaptive_parameters = {}
        self.quiz_templates = self._initialize_quiz_templates()
        self.difficulty_scaling = {
            'beginner': {'min': 1, 'max': 3},
            'intermediate': {'min': 2, 'max': 5},
            'advanced': {'min': 4, 'max': 7}
        }
    
    @JacWalker
    @byLLM
    def generate_adaptive_quiz(self, user_id: int, topic: str, current_mastery: Dict[str, float] = None) -> Dict[str, Any]:
        """
        Generate an adaptive quiz using byLLM based on user's current mastery
        
        Args:
            user_id: User identifier for personalized quiz
            topic: Topic/concept for quiz generation
            current_mastery: Current mastery levels from OSP graph
            
        Returns:
            Dictionary containing the generated adaptive quiz
        """
        logger.info(f"Generating adaptive quiz for user {user_id}, topic: {topic}")
        
        try:
            # Analyze user's mastery levels for adaptive generation
            mastery_analysis = self._analyze_user_mastery(user_id, topic, current_mastery)
            
            # Determine optimal difficulty and question count
            quiz_parameters = self._calculate_quiz_parameters(mastery_analysis)
            
            # Generate questions using byLLM based on user's learning profile
            generated_questions = self._llm_generate_questions(
                topic, 
                quiz_parameters['difficulty_level'], 
                quiz_parameters['question_count'],
                user_id
            )
            
            # Create adaptive scoring mechanism
            adaptive_scoring = self._create_adaptive_scoring(quiz_parameters, mastery_analysis)
            
            # Generate quiz metadata
            quiz_metadata = self._generate_quiz_metadata(topic, quiz_parameters, user_id)
            
            # Structure the complete adaptive quiz
            adaptive_quiz = {
                'quiz_id': f"adaptive_{topic}_{user_id}_{'2025-12-02T03:08:23Z'.replace(':', '').replace('-', '')}",
                'user_id': user_id,
                'topic': topic,
                'questions': generated_questions,
                'metadata': quiz_metadata,
                'adaptive_scoring': adaptive_scoring,
                'generation_time': '2025-12-02T03:08:23Z',
                'version': '2.0'  # Adaptive version
            }
            
            # Store quiz for progress tracking
            self._store_quiz_for_tracking(adaptive_quiz)
            
            logger.info(f"Adaptive quiz generated successfully for user {user_id}")
            return {
                'status': 'success',
                'quiz': adaptive_quiz,
                'estimated_duration': quiz_parameters['estimated_duration'],
                'difficulty_adaptation': quiz_parameters['difficulty_level']
            }
            
        except Exception as e:
            logger.error(f"Error generating adaptive quiz: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to generate adaptive quiz: {str(e)}',
                'topic': topic,
                'user_id': user_id
            }
    
    @JacWalker
    @byLLM
    def generate_personalized_assessment(self, user_id: int, assessment_type: str) -> Dict[str, Any]:
        """
        Generate a comprehensive personalized assessment
        
        Args:
            user_id: User identifier
            assessment_type: Type of assessment (diagnostic, formative, summative)
            
        Returns:
            Dictionary containing the personalized assessment
        """
        logger.info(f"Generating personalized assessment for user {user_id}, type: {assessment_type}")
        
        try:
            # Get user's learning history and patterns
            learning_history = self._analyze_learning_history(user_id)
            
            # Generate assessment structure based on type and history
            assessment_structure = self._create_assessment_structure(assessment_type, learning_history)
            
            # Generate questions for each section
            assessment_sections = {}
            for section_name, section_config in assessment_structure.items():
                section_questions = self._llm_generate_assessment_section(
                    section_name, 
                    section_config, 
                    user_id,
                    learning_history
                )
                assessment_sections[section_name] = section_questions
            
            # Create time management strategy
            time_strategy = self._create_time_strategy(assessment_structure, learning_history)
            
            # Generate adaptive feedback framework
            feedback_framework = self._create_adaptive_feedback_framework(assessment_structure)
            
            personalized_assessment = {
                'assessment_id': f"personalized_{assessment_type}_{user_id}_{'2025-12-02T03:08:23Z'.replace(':', '').replace('-', '')}",
                'user_id': user_id,
                'assessment_type': assessment_type,
                'sections': assessment_sections,
                'time_strategy': time_strategy,
                'feedback_framework': feedback_framework,
                'adaptive_features': {
                    'difficulty_adjustment': True,
                    'question_skipping': True,
                    'hint_system': True,
                    'progress_tracking': True
                },
                'generation_time': '2025-12-02T03:08:23Z'
            }
            
            logger.info(f"Personalized assessment generated successfully")
            return {
                'status': 'success',
                'assessment': personalized_assessment,
                'estimated_completion_time': time_strategy['total_estimated_time']
            }
            
        except Exception as e:
            logger.error(f"Error generating personalized assessment: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to generate personalized assessment: {str(e)}',
                'assessment_type': assessment_type,
                'user_id': user_id
            }
    
    @JacWalker
    def adapt_quiz_difficulty(self, quiz_id: str, user_performance: Dict[str, Any]) -> Dict[str, Any]:
        """
        Adapt quiz difficulty based on real-time user performance
        
        Args:
            quiz_id: Quiz identifier to adapt
            user_performance: Real-time performance data
            
        Returns:
            Dictionary with adapted quiz modifications
        """
        logger.info(f"Adapting quiz difficulty for {quiz_id}")
        
        try:
            # Analyze current performance patterns
            performance_analysis = self._analyze_performance_patterns(user_performance)
            
            # Determine adaptation strategy
            adaptation_strategy = self._determine_adaptation_strategy(performance_analysis)
            
            # Generate adapted questions if needed
            if adaptation_strategy['needs_question_modification']:
                adapted_questions = self._generate_adapted_questions(quiz_id, adaptation_strategy)
            else:
                adapted_questions = None
            
            # Update scoring parameters
            updated_scoring = self._update_adaptive_scoring(adaptation_strategy, user_performance)
            
            # Create adaptation report
            adaptation_report = {
                'quiz_id': quiz_id,
                'adaptation_reason': adaptation_strategy['reason'],
                'changes_made': adaptation_strategy['changes'],
                'performance_analysis': performance_analysis,
                'adaptation_time': '2025-12-02T03:08:23Z'
            }
            
            result = {
                'status': 'success',
                'adaptation_report': adaptation_report,
                'adapted_questions': adapted_questions,
                'updated_scoring': updated_scoring,
                'next_assessment_recommendation': self._get_next_assessment_recommendation(performance_analysis)
            }
            
            logger.info(f"Quiz difficulty adapted successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error adapting quiz difficulty: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to adapt quiz difficulty: {str(e)}',
                'quiz_id': quiz_id
            }
    
    @JacWalker
    @byLLM
    def generate_bridging_questions(self, user_id: int, current_concept: str, target_concept: str) -> Dict[str, Any]:
        """
        Generate bridging questions to help transition between concepts
        
        Args:
            user_id: User identifier
            current_concept: Current mastered concept
            target_concept: Target concept to learn next
            
        Returns:
            Dictionary with bridging questions and explanations
        """
        logger.info(f"Generating bridging questions from {current_concept} to {target_concept} for user {user_id}")
        
        try:
            # Analyze conceptual bridge between concepts
            conceptual_bridge = self._analyze_conceptual_bridge(current_concept, target_concept)
            
            # Generate bridging questions using byLLM
            bridging_questions = self._llm_generate_bridging_questions(
                conceptual_bridge,
                user_id,
                current_concept,
                target_concept
            )
            
            # Create explanation framework
            explanation_framework = self._create_explanation_framework(conceptual_bridge, user_id)
            
            # Generate practice exercises
            practice_exercises = self._generate_practice_exercises(conceptual_bridge, bridging_questions)
            
            result = {
                'status': 'success',
                'current_concept': current_concept,
                'target_concept': target_concept,
                'bridging_questions': bridging_questions,
                'explanation_framework': explanation_framework,
                'practice_exercises': practice_exercises,
                'transition_difficulty': conceptual_bridge['difficulty'],
                'estimated_learning_time': conceptual_bridge['estimated_transition_time']
            }
            
            logger.info(f"Bridging questions generated successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error generating bridging questions: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to generate bridging questions: {str(e)}',
                'current_concept': current_concept,
                'target_concept': target_concept
            }
    
    def _initialize_question_bank(self) -> Dict[str, Any]:
        """Initialize the question bank with sample questions"""
        return {
            'programming_basics': [
                {
                    'id': 'pb_001',
                    'type': 'multiple_choice',
                    'difficulty': 1,
                    'question': 'What is a variable?',
                    'options': ['A container for data', 'A type of loop', 'A function', 'A class'],
                    'correct': 0,
                    'concepts': ['variables', 'data_types']
                }
            ],
            'control_structures': [
                {
                    'id': 'cs_001',
                    'type': 'code_completion',
                    'difficulty': 2,
                    'question': 'Complete the if statement:',
                    'template': 'if x > 10:\n    print("Large")',
                    'concepts': ['conditionals', 'if_statements']
                }
            ]
        }
    
    def _initialize_quiz_templates(self) -> Dict[str, Any]:
        """Initialize quiz templates for different purposes"""
        return {
            'diagnostic': {
                'question_distribution': {'easy': 0.4, 'medium': 0.4, 'hard': 0.2},
                'question_types': ['multiple_choice', 'true_false', 'code_analysis'],
                'time_multiplier': 1.5
            },
            'formative': {
                'question_distribution': {'easy': 0.3, 'medium': 0.5, 'hard': 0.2},
                'question_types': ['multiple_choice', 'code_completion', 'short_answer'],
                'time_multiplier': 1.2
            },
            'summative': {
                'question_distribution': {'easy': 0.2, 'medium': 0.4, 'hard': 0.4},
                'question_types': ['code_completion', 'essay', 'problem_solving'],
                'time_multiplier': 1.0
            }
        }
    
    def _analyze_user_mastery(self, user_id: int, topic: str, current_mastery: Dict[str, float] = None) -> Dict[str, Any]:
        """Analyze user's mastery for adaptive quiz generation"""
        # Use provided mastery or simulate analysis
        if current_mastery:
            topic_mastery = current_mastery.get(topic, 0.5)
        else:
            # Simulate mastery analysis
            topic_mastery = 0.6  # Would be calculated from actual user data
        
        return {
            'topic_mastery': topic_mastery,
            'confidence_level': min(1.0, topic_mastery + 0.1),  # Confidence slightly higher than mastery
            'recent_performance_trend': 'improving',  # Would be calculated from historical data
            'learning_velocity': 'normal',  # Rate of learning
            'preferred_difficulty': self._determine_preferred_difficulty(topic_mastery)
        }
    
    def _calculate_quiz_parameters(self, mastery_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate optimal quiz parameters based on mastery analysis"""
        mastery = mastery_analysis['topic_mastery']
        preferred_difficulty = mastery_analysis['preferred_difficulty']
        
        # Determine question count based on mastery
        if mastery < 0.3:
            question_count = 8
            difficulty_level = 'beginner'
        elif mastery < 0.7:
            question_count = 10
            difficulty_level = 'intermediate'
        else:
            question_count = 12
            difficulty_level = 'advanced'
        
        # Adjust based on confidence
        confidence = mastery_analysis['confidence_level']
        if confidence > 0.8:
            difficulty_level = 'advanced'
        elif confidence < 0.4:
            difficulty_level = 'beginner'
        
        estimated_duration = question_count * 2  # 2 minutes per question
        
        return {
            'question_count': question_count,
            'difficulty_level': difficulty_level,
            'estimated_duration': estimated_duration,
            'adaptive_features': True
        }
    
    def _llm_generate_questions(self, topic: str, difficulty_level: str, question_count: int, user_id: int) -> List[Dict[str, Any]]:
        """Generate questions using LLM (simulated implementation)"""
        generated_questions = []
        
        question_types = ['multiple_choice', 'code_completion', 'true_false', 'short_answer']
        
        for i in range(question_count):
            question_type = random.choice(question_types)
            
            # Simulate LLM-generated question
            question = {
                'id': f"generated_{topic}_{i+1}",
                'type': question_type,
                'difficulty': difficulty_level,
                'question': f"Generate a {difficulty_level} level {question_type} question about {topic}",
                'personalization': {
                    'based_on_user_history': True,
                    'learning_style_adapted': True,
                    'difficulty_calibrated': True
                },
                'scoring': {
                    'points': self._calculate_question_points(difficulty_level, question_type),
                    'partial_credit': question_type in ['code_completion', 'short_answer']
                }
            }
            
            # Add type-specific properties
            if question_type == 'multiple_choice':
                question['options'] = ['Option A', 'Option B', 'Option C', 'Option D']
                question['correct'] = 0  # Would be determined by LLM
            elif question_type == 'code_completion':
                question['template'] = f"# Complete this {topic} code\ndef example():\n    # TODO: Implement {topic}\n    pass"
                question['expected_pattern'] = f"Should demonstrate {topic} understanding"
            
            generated_questions.append(question)
        
        return generated_questions
    
    def _create_adaptive_scoring(self, quiz_parameters: Dict[str, Any], mastery_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Create adaptive scoring mechanism"""
        mastery = mastery_analysis['topic_mastery']
        confidence = mastery_analysis['confidence_level']
        
        # Adaptive scoring based on mastery and confidence
        base_score_weight = 1.0
        confidence_bonus = confidence * 0.1
        
        return {
            'scoring_method': 'adaptive_weighted',
            'base_score_weight': base_score_weight,
            'confidence_bonus': confidence_bonus,
            'mastery_adjustment': {
                'low_mastery_penalty': -0.1 if mastery < 0.3 else 0,
                'high_mastery_bonus': 0.1 if mastery > 0.8 else 0
            },
            'partial_credit_rules': {
                'code_completion': 0.5,  # 50% credit for partial implementation
                'short_answer': 0.7,     # 70% credit for partial correctness
                'multiple_choice': 1.0   # 100% or 0% credit
            }
        }
    
    def _generate_quiz_metadata(self, topic: str, quiz_parameters: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        """Generate comprehensive quiz metadata"""
        return {
            'title': f"Adaptive {topic.replace('_', ' ').title()} Assessment",
            'description': f"Personalized {quiz_parameters['difficulty_level']} level assessment for {topic}",
            'difficulty_level': quiz_parameters['difficulty_level'],
            'estimated_duration': quiz_parameters['estimated_duration'],
            'adaptive_features': {
                'difficulty_adjustment': True,
                'hint_system': True,
                'progress_feedback': True,
                'real_time_adaptation': True
            },
            'learning_objectives': [
                f"Assess understanding of {topic} concepts",
                "Provide personalized feedback",
                "Identify learning gaps",
                "Adapt to individual learning pace"
            ],
            'prerequisites': self._get_topic_prerequisites(topic),
            'recommended_study_time': quiz_parameters['estimated_duration'] * 2
        }
    
    def _store_quiz_for_tracking(self, quiz: Dict[str, Any]):
        """Store quiz for progress tracking"""
        quiz_id = quiz['quiz_id']
        self.adaptive_parameters[quiz_id] = {
            'user_mastery_at_generation': 0.6,  # Would be actual mastery
            'difficulty_level': quiz['metadata']['difficulty_level'],
            'adaptive_features_enabled': True,
            'generation_context': {
                'time': '2025-12-02T03:08:23Z',
                'user_id': quiz['user_id'],
                'topic': quiz['topic']
            }
        }
    
    def _analyze_learning_history(self, user_id: int) -> Dict[str, Any]:
        """Analyze user's learning history for personalized assessment"""
        # Simulate learning history analysis
        return {
            'recent_performance': 0.75,
            'consistency_score': 0.8,
            'preferred_question_types': ['multiple_choice', 'code_completion'],
            'learning_velocity': 'accelerated',
            'struggle_areas': ['advanced_concepts'],
            'strength_areas': ['basic_programming', 'variables']
        }
    
    def _create_assessment_structure(self, assessment_type: str, learning_history: Dict[str, Any]) -> Dict[str, Any]:
        """Create assessment structure based on type and history"""
        template = self.quiz_templates.get(assessment_type, self.quiz_templates['formative'])
        
        structure = {
            'warmup': {
                'question_count': 3,
                'difficulty': 'easy',
                'purpose': 'Build confidence'
            },
            'core_assessment': {
                'question_count': 10,
                'difficulty': 'mixed',
                'purpose': 'Evaluate learning objectives'
            },
            'challenge': {
                'question_count': 3,
                'difficulty': 'hard',
                'purpose': 'Stretch capabilities'
            }
        }
        
        return structure
    
    def _llm_generate_assessment_section(self, section_name: str, section_config: Dict[str, Any], 
                                       user_id: int, learning_history: Dict[str, Any]) -> Dict[str, Any]:
        """Generate assessment section using LLM"""
        return {
            'section_name': section_name,
            'questions': self._llm_generate_questions(
                f"{section_name}_assessment",
                section_config['difficulty'],
                section_config['question_count'],
                user_id
            ),
            'section_purpose': section_config['purpose'],
            'personalization_applied': True
        }
    
    def _create_time_strategy(self, assessment_structure: Dict[str, Any], learning_history: Dict[str, Any]) -> Dict[str, Any]:
        """Create time management strategy"""
        total_questions = sum(config['question_count'] for config in assessment_structure.values())
        base_time_per_question = 2  # minutes
        learning_velocity_factor = 1.0  # Would be based on actual learning velocity
        
        total_estimated_time = total_questions * base_time_per_question * learning_velocity_factor
        
        return {
            'total_estimated_time': total_estimated_time,
            'time_per_section': {
                section_name: config['question_count'] * base_time_per_question * learning_velocity_factor
                for section_name, config in assessment_structure.items()
            },
            'break_recommendations': total_estimated_time > 30,
            'time_management_tips': [
                "Read questions carefully",
                "Skip difficult questions and return later",
                "Use hints strategically"
            ]
        }
    
    def _create_adaptive_feedback_framework(self, assessment_structure: Dict[str, Any]) -> Dict[str, Any]:
        """Create adaptive feedback framework"""
        return {
            'immediate_feedback': {
                'correct_answers': True,
                'incorrect_answers': True,
                'partial_credit': True
            },
            'post_assessment_feedback': {
                'performance_summary': True,
                'concept_analysis': True,
                'recommendations': True,
                'next_steps': True
            },
            'adaptive_elements': {
                'difficulty_adjustment': True,
                'personalized_recommendations': True,
                'gap_analysis': True
            }
        }
    
    def _analyze_performance_patterns(self, user_performance: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze performance patterns for adaptation"""
        return {
            'accuracy_trend': 'improving',
            'time_spent_pattern': 'normal',
            'difficulty_comfort': 'intermediate',
            'struggle_indicators': user_performance.get('struggle_count', 0) > 2,
            'success_patterns': user_performance.get('correct_answers', [])[:3]
        }
    
    def _determine_adaptation_strategy(self, performance_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Determine adaptation strategy based on performance"""
        if performance_analysis['struggle_indicators']:
            return {
                'reason': 'User showing signs of struggle',
                'changes': ['reduce_difficulty', 'add_hints', 'provide_examples'],
                'needs_question_modification': True
            }
        elif performance_analysis['accuracy_trend'] == 'improving':
            return {
                'reason': 'User performing well - can increase challenge',
                'changes': ['increase_difficulty', 'add_time_pressure'],
                'needs_question_modification': False
            }
        else:
            return {
                'reason': 'Stable performance - maintain current approach',
                'changes': [],
                'needs_question_modification': False
            }
    
    def _generate_adapted_questions(self, quiz_id: str, adaptation_strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate adapted questions based on strategy"""
        # This would modify existing questions or generate new ones
        return []  # Simplified for demonstration
    
    def _update_adaptive_scoring(self, adaptation_strategy: Dict[str, Any], user_performance: Dict[str, Any]) -> Dict[str, Any]:
        """Update adaptive scoring parameters"""
        return {
            'adjusted_weights': {
                'accuracy': 0.7 if 'increase_difficulty' in adaptation_strategy['changes'] else 0.8,
                'completion_time': 0.3 if 'add_time_pressure' in adaptation_strategy['changes'] else 0.2
            },
            'difficulty_adjustment': 'increase' if 'increase_difficulty' in adaptation_strategy['changes'] else 'maintain'
        }
    
    def _get_next_assessment_recommendation(self, performance_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Get recommendation for next assessment"""
        return {
            'recommended_assessment_type': 'formative',
            'focus_areas': ['concept_reinforcement'],
            'difficulty_level': 'adaptive',
            'estimated_timeline': 'within_2_days'
        }
    
    def _analyze_conceptual_bridge(self, current_concept: str, target_concept: str) -> Dict[str, Any]:
        """Analyze the bridge between concepts"""
        # This would analyze conceptual relationships
        return {
            'bridge_type': 'sequential',
            'difficulty': 'moderate',
            'estimated_transition_time': 45,  # minutes
            'key_connections': ['prerequisite_review', 'new_concept_introduction'],
            'potential_struggle_points': ['concept_applications']
        }
    
    def _llm_generate_bridging_questions(self, conceptual_bridge: Dict[str, Any], user_id: int, 
                                       current_concept: str, target_concept: str) -> List[Dict[str, Any]]:
        """Generate bridging questions using LLM"""
        # This would use actual byLLM to generate conceptual bridge questions
        return [
            {
                'type': 'conceptual_connection',
                'question': f"How does {current_concept} relate to {target_concept}?",
                'difficulty': 'bridge_level',
                'purpose': 'build_conceptual_connections'
            }
        ]
    
    def _create_explanation_framework(self, conceptual_bridge: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        """Create explanation framework for concept transition"""
        return {
            'explanation_style': 'step_by_step',
            'examples_count': 3,
            'interactive_elements': True,
            'checkpoints': ['understand_prerequisites', 'grasp_new_concept', 'make_connections']
        }
    
    def _generate_practice_exercises(self, conceptual_bridge: Dict[str, Any], bridging_questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate practice exercises for concept transition"""
        return [
            {
                'type': 'guided_practice',
                'description': 'Practice exercises to reinforce the bridge between concepts',
                'exercise_count': 5
            }
        ]
    
    def _determine_preferred_difficulty(self, mastery_level: float) -> str:
        """Determine preferred difficulty based on mastery"""
        if mastery_level < 0.3:
            return 'beginner'
        elif mastery_level < 0.7:
            return 'intermediate'
        else:
            return 'advanced'
    
    def _calculate_question_points(self, difficulty_level: str, question_type: str) -> int:
        """Calculate points for a question based on difficulty and type"""
        base_points = {'easy': 1, 'medium': 2, 'hard': 3}
        type_multipliers = {'multiple_choice': 1.0, 'code_completion': 1.5, 'essay': 2.0}
        
        base = base_points.get(difficulty_level, 1)
        multiplier = type_multipliers.get(question_type, 1.0)
        
        return int(base * multiplier)
    
    def _get_topic_prerequisites(self, topic: str) -> List[str]:
        """Get prerequisites for a topic"""
        prerequisites_map = {
            'control_structures': ['variables', 'data_types'],
            'functions': ['variables', 'control_structures'],
            'object_oriented': ['functions', 'control_structures']
        }
        return prerequisites_map.get(topic, [])

# Register the walker
WALKERS = [
    {
        'name': 'generate_adaptive_quiz',
        'description': 'Generate adaptive quiz using byLLM based on user mastery',
        'parameters': ['user_id', 'topic', 'current_mastery']
    },
    {
        'name': 'generate_personalized_assessment',
        'description': 'Generate comprehensive personalized assessment',
        'parameters': ['user_id', 'assessment_type']
    },
    {
        'name': 'adapt_quiz_difficulty',
        'description': 'Adapt quiz difficulty based on real-time performance',
        'parameters': ['quiz_id', 'user_performance']
    },
    {
        'name': 'generate_bridging_questions',
        'description': 'Generate bridging questions between concepts using byLLM',
        'parameters': ['user_id', 'current_concept', 'target_concept']
    }
]

# Create quiz master instance
quiz_master = QuizMaster()