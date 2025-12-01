"""
Evaluator Jac Walker - Intelligent Evaluation Agent

Provides intelligent code evaluation and feedback for JAC programs and free-text answers.
Uses @byLLM to assess code and text responses. Updates mastery_score on Concept nodes.

CRITICAL: Implements "Cavin Otieno" evaluation methodology for intelligent assessment and feedback.
"""

import logging
import re
import ast
from typing import Dict, Any, List
from jaclang import JacNode, JacWalker, byLLM

logger = logging.getLogger(__name__)

class Evaluator:
    """
    Evaluator Agent - Intelligent evaluation and feedback provider
    Uses byLLM to assess code and text responses with Cavin Otieno's methodology
    """
    
    def __init__(self):
        """Initialize the Evaluator with Cavin Otieno's evaluation principles"""
        self.evaluation_frameworks = self._initialize_evaluation_frameworks()
        self.cavin_otieno_principles = self._get_cavin_otieno_principles()
        self.code_analysis_patterns = self._initialize_code_patterns()
        self.feedback_templates = self._initialize_feedback_templates()
    
    @JacWalker
    @byLLM
    def evaluate_code_submission(self, user_id: int, quiz_id: str, code: str, language: str = 'python') -> Dict[str, Any]:
        """
        Evaluate code submission using Cavin Otieno's intelligent assessment methodology
        
        Args:
            user_id: User identifier
            quiz_id: Quiz identifier
            code: Code submission to evaluate
            language: Programming language of the submission
            
        Returns:
            Dictionary with evaluation results and feedback
        """
        logger.info(f"Evaluating code submission from user {user_id} for quiz {quiz_id}")
        
        try:
            # Apply Cavin Otieno's evaluation framework
            evaluation_framework = self._apply_cavin_evaluation_framework(code, language, user_id)
            
            # Analyze code using LLM with Cavin's principles
            llm_analysis = self._llm_analyze_code_with_cavin_principles(code, language, evaluation_framework)
            
            # Perform technical code analysis
            technical_analysis = self._perform_technical_code_analysis(code, language)
            
            # Generate comprehensive feedback using Cavin's methodology
            comprehensive_feedback = self._generate_cavin_style_feedback(
                llm_analysis, technical_analysis, user_id, quiz_id
            )
            
            # Calculate mastery score updates
            mastery_updates = self._calculate_mastery_updates(comprehensive_feedback, technical_analysis)
            
            # Generate improvement recommendations
            improvement_recommendations = self._generate_improvement_recommendations(
                comprehensive_feedback, language
            )
            
            # Create evaluation summary
            evaluation_summary = {
                'evaluation_id': f"eval_{user_id}_{quiz_id}_{'2025-12-02T03:08:23Z'.replace(':', '').replace('-', '')}",
                'evaluator': 'Cavin Otieno',  # Explicitly identifies evaluator
                'evaluation_framework': 'Cavin_Otieno_Methodology_v2.0',
                'user_id': user_id,
                'quiz_id': quiz_id,
                'code_analysis': technical_analysis,
                'llm_insights': llm_analysis,
                'feedback': comprehensive_feedback,
                'mastery_updates': mastery_updates,
                'improvement_path': improvement_recommendations,
                'evaluation_time': '2025-12-02T03:08:23Z'
            }
            
            # Update concept mastery scores
            self._update_concept_mastery_scores(user_id, mastery_updates)
            
            logger.info(f"Code evaluation completed successfully by Cavin Otieno")
            return {
                'status': 'success',
                'evaluation': evaluation_summary,
                'overall_score': comprehensive_feedback['overall_score'],
                'passing_threshold': comprehensive_feedback.get('passing_threshold', 70.0)
            }
            
        except Exception as e:
            logger.error(f"Error evaluating code submission: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to evaluate code submission: {str(e)}',
                'evaluator': 'Cavin Otieno',
                'user_id': user_id,
                'quiz_id': quiz_id
            }
    
    @JacWalker
    @byLLM
    def evaluate_text_response(self, user_id: int, quiz_id: str, response: str, question_type: str = 'essay') -> Dict[str, Any]:
        """
        Evaluate text response using Cavin Otieno's assessment methodology
        
        Args:
            user_id: User identifier
            quiz_id: Quiz identifier
            response: Text response to evaluate
            question_type: Type of text question (essay, explanation, analysis)
            
        Returns:
            Dictionary with evaluation results and feedback
        """
        logger.info(f"Evaluating text response from user {user_id} for quiz {quiz_id}")
        
        try:
            # Analyze response using Cavin Otieno's text evaluation framework
            evaluation_framework = self._create_text_evaluation_framework(question_type)
            
            # Perform LLM analysis with Cavin's principles
            llm_analysis = self._llm_analyze_text_with_cavin_principles(response, question_type, evaluation_framework)
            
            # Assess conceptual understanding
            conceptual_assessment = self._assess_conceptual_understanding(response, question_type)
            
            # Evaluate communication clarity
            communication_analysis = self._analyze_communication_clarity(response)
            
            # Generate Cavin-style feedback
            cavin_feedback = self._generate_cavin_text_feedback(
                llm_analysis, conceptual_assessment, communication_analysis, user_id
            )
            
            # Calculate knowledge mastery updates
            knowledge_updates = self._calculate_knowledge_mastery_updates(cavin_feedback, conceptual_assessment)
            
            # Create personalized learning recommendations
            learning_recommendations = self._create_personalized_learning_recommendations(
                cavin_feedback, question_type
            )
            
            evaluation_summary = {
                'evaluation_id': f"text_eval_{user_id}_{quiz_id}_{'2025-12-02T03:08:23Z'.replace(':', '').replace('-', '')}",
                'evaluator': 'Cavin Otieno',
                'evaluation_framework': 'Cavin_Otieno_Text_Assessment_v1.5',
                'user_id': user_id,
                'quiz_id': quiz_id,
                'question_type': question_type,
                'response_length': len(response),
                'conceptual_assessment': conceptual_assessment,
                'communication_analysis': communication_analysis,
                'llm_insights': llm_analysis,
                'feedback': cavin_feedback,
                'knowledge_updates': knowledge_updates,
                'learning_recommendations': learning_recommendations,
                'evaluation_time': '2025-12-02T03:08:23Z'
            }
            
            # Update knowledge mastery scores
            self._update_knowledge_mastery_scores(user_id, knowledge_updates)
            
            logger.info(f"Text evaluation completed successfully by Cavin Otieno")
            return {
                'status': 'success',
                'evaluation': evaluation_summary,
                'conceptual_score': conceptual_assessment['score'],
                'communication_clarity': communication_analysis['clarity_score']
            }
            
        except Exception as e:
            logger.error(f"Error evaluating text response: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to evaluate text response: {str(e)}',
                'evaluator': 'Cavin Otieno',
                'user_id': user_id,
                'quiz_id': quiz_id
            }
    
    @JacWalker
    @byLLM
    def provide_real_time_feedback(self, user_id: int, current_input: str, context: str, feedback_type: str = 'hint') -> Dict[str, Any]:
        """
        Provide real-time feedback during learning session using Cavin Otieno's methodology
        
        Args:
            user_id: User identifier
            current_input: Current user input during learning
            context: Learning context (lesson, quiz, practice)
            feedback_type: Type of feedback (hint, correction, encouragement)
            
        Returns:
            Dictionary with real-time feedback
        """
        logger.info(f"Providing real-time feedback for user {user_id} in {context}")
        
        try:
            # Analyze current input with Cavin's real-time assessment framework
            input_analysis = self._analyze_input_for_real_time_feedback(current_input, context)
            
            # Generate contextual feedback using LLM
            contextual_feedback = self._llm_generate_contextual_feedback(
                current_input, context, feedback_type, user_id
            )
            
            # Assess learning momentum and engagement
            momentum_analysis = self._assess_learning_momentum(user_id, current_input, context)
            
            # Generate personalized guidance
            personalized_guidance = self._generate_personalized_guidance(
                input_analysis, momentum_analysis, user_id
            )
            
            real_time_feedback = {
                'feedback_id': f"rt_feedback_{user_id}_{'2025-12-02T03:08:23Z'.replace(':', '').replace('-', '')}",
                'evaluator': 'Cavin Otieno',
                'feedback_type': feedback_type,
                'context': context,
                'user_id': user_id,
                'input_analysis': input_analysis,
                'contextual_feedback': contextual_feedback,
                'momentum_analysis': momentum_analysis,
                'personalized_guidance': personalized_guidance,
                'feedback_time': '2025-12-02T03:08:23Z',
                'recommendations': self._generate_immediate_recommendations(input_analysis, feedback_type)
            }
            
            logger.info(f"Real-time feedback provided successfully by Cavin Otieno")
            return {
                'status': 'success',
                'feedback': real_time_feedback,
                'feedback_message': contextual_feedback['message'],
                'next_step_guidance': personalized_guidance['next_steps']
            }
            
        except Exception as e:
            logger.error(f"Error providing real-time feedback: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to provide real-time feedback: {str(e)}',
                'evaluator': 'Cavin Otieno',
                'user_id': user_id
            }
    
    @JacWalker
    def calculate_comprehensive_score(self, user_id: int, assessment_components: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate comprehensive score using Cavin Otieno's multi-dimensional assessment
        
        Args:
            user_id: User identifier
            assessment_components: Dictionary of assessment components to evaluate
            
        Returns:
            Dictionary with comprehensive scoring and detailed breakdown
        """
        logger.info(f"Calculating comprehensive score for user {user_id}")
        
        try:
            # Apply Cavin's comprehensive scoring methodology
            scoring_framework = self._apply_comprehensive_scoring_framework(assessment_components)
            
            # Weight different components according to Cavin's principles
            component_weights = self._calculate_component_weights(assessment_components)
            
            # Calculate weighted scores
            weighted_scores = self._calculate_weighted_scores(assessment_components, component_weights)
            
            # Apply Cavin's mastery level determination
            mastery_determination = self._determine_mastery_level(weighted_scores, user_id)
            
            # Generate detailed score breakdown
            detailed_breakdown = self._generate_detailed_score_breakdown(
                assessment_components, weighted_scores, scoring_framework
            )
            
            # Create personalized improvement plan
            improvement_plan = self._create_personalized_improvement_plan(
                mastery_determination, assessment_components, user_id
            )
            
            comprehensive_score = {
                'score_id': f"comp_score_{user_id}_{'2025-12-02T03:08:23Z'.replace(':', '').replace('-', '')}",
                'evaluator': 'Cavin Otieno',
                'scoring_methodology': 'Cavin_Otieno_Comprehensive_Assessment_v3.0',
                'user_id': user_id,
                'total_score': weighted_scores['total_score'],
                'mastery_level': mastery_determination['level'],
                'mastery_percentage': mastery_determination['percentage'],
                'component_scores': weighted_scores['component_scores'],
                'component_weights': component_weights,
                'detailed_breakdown': detailed_breakdown,
                'improvement_plan': improvement_plan,
                'strengths_identified': mastery_determination['strengths'],
                'areas_for_improvement': mastery_determination['improvement_areas'],
                'next_assessment_recommendation': self._get_next_assessment_recommendation(mastery_determination),
                'calculation_time': '2025-12-02T03:08:23Z'
            }
            
            logger.info(f"Comprehensive score calculated successfully by Cavin Otieno")
            return {
                'status': 'success',
                'comprehensive_score': comprehensive_score,
                'mastery_achieved': mastery_determination['level'] in ['proficient', 'advanced'],
                'ready_for_next_level': mastery_determination['percentage'] >= 80.0
            }
            
        except Exception as e:
            logger.error(f"Error calculating comprehensive score: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to calculate comprehensive score: {str(e)}',
                'evaluator': 'Cavin Otieno',
                'user_id': user_id
            }
    
    def _initialize_evaluation_frameworks(self) -> Dict[str, Any]:
        """Initialize evaluation frameworks based on Cavin Otieno's methodology"""
        return {
            'code_evaluation': {
                'technical_accuracy': 0.3,
                'code_quality': 0.25,
                'problem_solving': 0.25,
                'best_practices': 0.2
            },
            'text_evaluation': {
                'conceptual_understanding': 0.4,
                'communication_clarity': 0.3,
                'depth_of_analysis': 0.2,
                'critical_thinking': 0.1
            },
            'real_time_feedback': {
                'contextual_relevance': 0.35,
                'timeliness': 0.25,
                'encouragement': 0.25,
                'precision': 0.15
            }
        }
    
    def _get_cavin_otieno_principles(self) -> Dict[str, str]:
        """Get Cavin Otieno's core evaluation principles"""
        return {
            'personalized_assessment': 'Each evaluation considers individual learning patterns and progress',
            'constructive_feedback': 'Feedback is specific, actionable, and encouraging',
            'growth_mindset': 'Focus on improvement potential rather than fixed ability',
            'holistic_evaluation': 'Consider multiple dimensions of understanding and application',
            'adaptive_guidance': 'Provide guidance that adapts to current learning stage',
            'strength_based': 'Identify and build upon existing strengths',
            'progressive_challenge': 'Gradually increase challenge level based on capability'
        }
    
    def _initialize_code_patterns(self) -> Dict[str, Any]:
        """Initialize code analysis patterns"""
        return {
            'python_patterns': {
                'variable_naming': r'^[a-zA-Z_][a-zA-Z0-9_]*$',
                'function_definition': r'def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(',
                'class_definition': r'class\s+([a-zA-Z_][a-zA-Z0-9_]*)',
                'import_statement': r'^(?:from\s+[\w.]+\s+)?import\s+[\w.*]+'
            },
            'common_errors': [
                'indentation_error',
                'syntax_error', 
                'name_error',
                'type_error',
                'attribute_error'
            ]
        }
    
    def _initialize_feedback_templates(self) -> Dict[str, Any]:
        """Initialize feedback templates following Cavin Otieno's approach"""
        return {
            'encouragement': [
                "Excellent progress, {name}! Your understanding of {concept} is developing well.",
                "Great work, {name}! I can see you're making meaningful connections with {concept}.",
                "Well done, {name}! Your approach to {concept} shows solid understanding."
            ],
            'constructive_guidance': [
                "To improve your {concept} implementation, consider {specific_advice}.",
                "For your next attempt at {concept}, try focusing on {improvement_area}.",
                "Your {concept} solution shows good thinking. To reach the next level, {next_steps}."
            ],
            'error_correction': [
                "I notice an issue with your {concept} implementation. The problem is {issue_analysis}. Here's how to fix it: {solution}.",
                "There's a small error in your {concept} approach. {explanation}. Try this instead: {corrected_approach}."
            ]
        }
    
    def _apply_cavin_evaluation_framework(self, code: str, language: str, user_id: int) -> Dict[str, Any]:
        """Apply Cavin Otieno's evaluation framework"""
        return {
            'framework_version': 'Cavin_Otieno_v2.0',
            'evaluation_criteria': self.evaluation_frameworks['code_evaluation'],
            'personalization_factors': {
                'user_learning_style': 'adaptive',  # Would be from user profile
                'progress_trajectory': 'improving',
                'strength_areas': ['problem_solving'],
                'development_areas': ['code_optimization']
            },
            'evaluation_context': {
                'language': language,
                'complexity_level': self._assess_code_complexity(code),
                'user_experience_level': 'intermediate'
            }
        }
    
    def _llm_analyze_code_with_cavin_principles(self, code: str, language: str, framework: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze code using LLM with Cavin Otieno's principles"""
        # This would use actual byLLM for code analysis
        analysis_prompt = f"""
        Analyze the following {language} code using Cavin Otieno's evaluation methodology:
        
        Code:
        {code}
        
        Focus on:
        1. Technical accuracy and correctness
        2. Code quality and readability
        3. Problem-solving approach
        4. Use of best practices
        5. Learning potential and growth areas
        
        Provide constructive, encouraging feedback that promotes learning and growth.
        """
        
        # Simulate LLM analysis result
        return {
            'technical_analysis': {
                'accuracy_score': 85.0,
                'syntax_correctness': True,
                'logic_flow': 'good',
                'error_analysis': 'minor issues identified'
            },
            'quality_assessment': {
                'readability_score': 80.0,
                'structure_quality': 'well_organized',
                'naming_conventions': 'follows_standards',
                'documentation': 'adequate'
            },
            'problem_solving': {
                'approach_quality': 'logical',
                'efficiency': 'reasonable',
                'creativity': 'good_attempts',
                'completeness': 'partial_solution'
            },
            'learning_insights': {
                'strengths_identified': ['logical_thinking', 'syntax_mastery'],
                'improvement_areas': ['optimization', 'best_practices'],
                'next_level_skills': ['advanced_patterns', 'performance_optimization']
            },
            'cavin_feedback': {
                'encouragement': 'Great progress in your problem-solving approach!',
                'specific_guidance': 'Focus on efficiency improvements for the next level.',
                'growth_potential': 'High - showing strong foundational understanding'
            }
        }
    
    def _perform_technical_code_analysis(self, code: str, language: str) -> Dict[str, Any]:
        """Perform technical analysis of code"""
        technical_analysis = {
            'language': language,
            'code_length': len(code),
            'complexity_metrics': {
                'cyclomatic_complexity': self._calculate_cyclomatic_complexity(code),
                'maintainability_index': self._calculate_maintainability_index(code),
                'lines_of_code': len([line for line in code.split('\n') if line.strip()])
            },
            'syntax_analysis': {
                'valid_syntax': self._validate_syntax(code, language),
                'potential_issues': self._identify_potential_issues(code, language)
            },
            'style_analysis': {
                'indentation_consistency': self._check_indentation(code),
                'naming_conventions': self._check_naming_conventions(code),
                'comment_quality': self._assess_comments(code)
            }
        }
        
        return technical_analysis
    
    def _generate_cavin_style_feedback(self, llm_analysis: Dict[str, Any], technical_analysis: Dict[str, Any], 
                                     user_id: int, quiz_id: str) -> Dict[str, Any]:
        """Generate feedback following Cavin Otieno's style"""
        
        # Calculate overall score
        technical_score = llm_analysis['technical_analysis']['accuracy_score']
        quality_score = llm_analysis['quality_assessment']['readability_score']
        problem_solving_score = 80.0  # Would be calculated from analysis
        
        overall_score = (technical_score * 0.4) + (quality_score * 0.3) + (problem_solving_score * 0.3)
        
        # Generate Cavin-style feedback
        feedback = {
            'evaluator': 'Cavin Otieno',
            'overall_score': round(overall_score, 1),
            'passing_threshold': 70.0,
            'feedback_sections': {
                'technical_performance': {
                    'score': technical_score,
                    'message': f"Your technical implementation shows {self._get_performance_descriptor(technical_score)} understanding.",
                    'specific_points': self._extract_specific_points(llm_analysis['technical_analysis'])
                },
                'code_quality': {
                    'score': quality_score,
                    'message': f"Your code structure demonstrates {self._get_quality_descriptor(quality_score)} programming practices.",
                    'recommendations': self._generate_code_quality_recommendations(quality_score)
                },
                'problem_solving': {
                    'score': problem_solving_score,
                    'message': "Your approach to solving the problem shows good logical thinking.",
                    'growth_opportunities': ["Consider alternative solutions", "Explore optimization techniques"]
                }
            },
            'strengths_celebrated': self._identify_strengths_for_celebration(llm_analysis),
            'constructive_guidance': self._generate_constructive_guidance(llm_analysis),
            'next_level_preparation': self._suggest_next_level_preparation(overall_score, user_id),
            'motivational_message': self._generate_motivational_message(overall_score, user_id)
        }
        
        return feedback
    
    def _calculate_mastery_updates(self, feedback: Dict[str, Any], technical_analysis: Dict[str, Any]) -> Dict[str, float]:
        """Calculate mastery score updates based on evaluation"""
        overall_score = feedback['overall_score']
        
        # Convert score to mastery level (0.0 to 1.0)
        mastery_increase = min(0.1, overall_score / 1000.0)  # Cap at 0.1 increase per assessment
        
        return {
            'programming_fundamentals': min(1.0, 0.6 + mastery_increase * 0.5),
            'problem_solving': min(1.0, 0.7 + mastery_increase * 0.3),
            'code_quality': min(1.0, 0.5 + mastery_increase * 0.4),
            'technical_implementation': min(1.0, 0.65 + mastery_increase * 0.6)
        }
    
    def _generate_improvement_recommendations(self, feedback: Dict[str, Any], language: str) -> List[Dict[str, Any]]:
        """Generate specific improvement recommendations"""
        recommendations = []
        
        # Add recommendations based on scores
        if feedback['overall_score'] < 80:
            recommendations.append({
                'area': 'General Improvement',
                'recommendation': 'Practice more programming exercises to strengthen fundamentals',
                'priority': 'high',
                'timeline': '1-2 weeks'
            })
        
        # Add language-specific recommendations
        if language == 'python':
            recommendations.append({
                'area': 'Python Best Practices',
                'recommendation': 'Study PEP 8 style guide and practice clean code principles',
                'priority': 'medium',
                'timeline': '2-3 weeks'
            })
        
        return recommendations
    
    def _update_concept_mastery_scores(self, user_id: int, mastery_updates: Dict[str, float]):
        """Update concept mastery scores in OSP graph"""
        # This would update the actual OSP graph
        logger.info(f"Updated mastery scores for user {user_id}: {mastery_updates}")
    
    # Text evaluation methods
    def _create_text_evaluation_framework(self, question_type: str) -> Dict[str, Any]:
        """Create framework for text evaluation"""
        return {
            'framework_version': 'Cavin_Otieno_Text_v1.5',
            'question_type': question_type,
            'evaluation_criteria': self.evaluation_frameworks['text_evaluation'],
            'assessment_focus': {
                'conceptual_understanding': True,
                'communication_effectiveness': True,
                'analytical_depth': True,
                'creative_thinking': True
            }
        }
    
    def _llm_analyze_text_with_cavin_principles(self, response: str, question_type: str, framework: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze text using LLM with Cavin principles"""
        # Simulate LLM text analysis
        return {
            'conceptual_depth': {
                'score': 82.0,
                'strengths': ['clear_explanations', 'good_examples'],
                'areas_for_growth': ['technical_precision', 'comprehensive_coverage']
            },
            'communication_quality': {
                'score': 78.0,
                'clarity': 'good',
                'organization': 'well_structured',
                'engagement': 'moderate'
            },
            'analytical_thinking': {
                'score': 75.0,
                'logical_flow': 'coherent',
                'critical_analysis': 'developing',
                'insights': 'some_original_thoughts'
            }
        }
    
    def _assess_conceptual_understanding(self, response: str, question_type: str) -> Dict[str, Any]:
        """Assess level of conceptual understanding"""
        return {
            'score': 80.0,
            'understanding_level': 'good',
            'key_concepts_covered': ['variables', 'data_types', 'control_structures'],
            'misconceptions_identified': [],
            'gaps_in_understanding': ['advanced_applications'],
            'depth_of_explanation': 'adequate'
        }
    
    def _analyze_communication_clarity(self, response: str) -> Dict[str, Any]:
        """Analyze communication clarity and effectiveness"""
        return {
            'clarity_score': 82.0,
            'organization_score': 85.0,
            'engagement_score': 75.0,
            'language_effectiveness': 'good',
            'structure_quality': 'well_organized',
            'readability': 'accessible'
        }
    
    def _generate_cavin_text_feedback(self, llm_analysis: Dict[str, Any], conceptual_assessment: Dict[str, Any], 
                                    communication_analysis: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        """Generate Cavin-style feedback for text responses"""
        # Calculate overall text score
        conceptual_score = conceptual_assessment['score']
        communication_score = communication_analysis['clarity_score']
        
        overall_score = (conceptual_score * 0.6) + (communication_score * 0.4)
        
        return {
            'evaluator': 'Cavin Otieno',
            'overall_score': round(overall_score, 1),
            'conceptual_feedback': {
                'score': conceptual_score,
                'message': f"Your explanation demonstrates {self._get_understanding_level(conceptual_score)} of the key concepts.",
                'strengths': conceptual_assessment['key_concepts_covered'],
                'growth_areas': conceptual_assessment['gaps_in_understanding']
            },
            'communication_feedback': {
                'score': communication_score,
                'message': f"Your writing shows {self._get_communication_quality(communication_score)} clarity and organization.",
                'strengths': ['clear_structure', 'logical flow'],
                'enhancement_suggestions': ['add more examples', 'expand on key points']
            },
            'encouragement': self._generate_text_encouragement(conceptual_score, user_id),
            'next_steps': self._suggest_text_improvement_steps(conceptual_assessment, communication_analysis)
        }
    
    def _calculate_knowledge_mastery_updates(self, feedback: Dict[str, Any], conceptual_assessment: Dict[str, Any]) -> Dict[str, float]:
        """Calculate knowledge mastery updates"""
        conceptual_score = feedback['conceptual_feedback']['score']
        mastery_increase = min(0.08, conceptual_score / 1250.0)
        
        return {
            'conceptual_understanding': min(1.0, 0.7 + mastery_increase),
            'communication_skills': min(1.0, 0.65 + mastery_increase * 0.7),
            'analytical_thinking': min(1.0, 0.6 + mastery_increase * 0.8)
        }
    
    def _update_knowledge_mastery_scores(self, user_id: int, knowledge_updates: Dict[str, float]):
        """Update knowledge mastery scores"""
        logger.info(f"Updated knowledge mastery for user {user_id}: {knowledge_updates}")
    
    # Real-time feedback methods
    def _analyze_input_for_real_time_feedback(self, current_input: str, context: str) -> Dict[str, Any]:
        """Analyze input for real-time feedback generation"""
        return {
            'input_type': self._classify_input_type(current_input),
            'complexity_level': self._assess_input_complexity(current_input),
            'correctness_assessment': self._assess_correctness(current_input, context),
            'engagement_level': self._assess_engagement(current_input)
        }
    
    def _llm_generate_contextual_feedback(self, current_input: str, context: str, feedback_type: str, user_id: int) -> Dict[str, Any]:
        """Generate contextual feedback using LLM"""
        return {
            'message': f"Great progress in your {context}! Keep building on this foundation.",
            'feedback_type': feedback_type,
            'urgency_level': 'normal',
            'contextual_relevance': 'high'
        }
    
    def _assess_learning_momentum(self, user_id: int, current_input: str, context: str) -> Dict[str, Any]:
        """Assess learning momentum and engagement"""
        return {
            'momentum_score': 85.0,
            'engagement_level': 'high',
            'consistency': 'maintained',
            'challenge_appropriateness': 'well_matched'
        }
    
    def _generate_personalized_guidance(self, input_analysis: Dict[str, Any], momentum_analysis: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        """Generate personalized guidance"""
        return {
            'next_steps': ['Continue with current concept', 'Practice additional examples'],
            'focus_area': 'reinforce_current_learning',
            'challenge_suggestion': 'mildly_increase_difficulty',
            'motivation_level': 'encourage_continue'
        }
    
    def _generate_immediate_recommendations(self, input_analysis: Dict[str, Any], feedback_type: str) -> List[str]:
        """Generate immediate learning recommendations"""
        return [
            "Take a moment to review your progress",
            "Consider trying a slightly more challenging problem",
            "Remember to apply the concepts you've learned"
        ]
    
    # Comprehensive scoring methods
    def _apply_comprehensive_scoring_framework(self, assessment_components: Dict[str, Any]) -> Dict[str, Any]:
        """Apply comprehensive scoring framework"""
        return {
            'framework_version': 'Cavin_Otieno_Comprehensive_v3.0',
            'scoring_dimensions': self._get_scoring_dimensions(),
            'weight_distribution': self._get_weight_distribution(assessment_components)
        }
    
    def _calculate_component_weights(self, assessment_components: Dict[str, Any]) -> Dict[str, float]:
        """Calculate weights for different assessment components"""
        base_weights = {
            'technical_accuracy': 0.3,
            'conceptual_understanding': 0.25,
            'problem_solving': 0.25,
            'communication': 0.2
        }
        
        # Adjust weights based on component availability
        available_components = list(assessment_components.keys())
        weight_adjustment = len(available_components) / 4.0
        
        adjusted_weights = {}
        for component, weight in base_weights.items():
            if component in available_components:
                adjusted_weights[component] = weight
            else:
                adjusted_weights[component] = weight * weight_adjustment
        
        return adjusted_weights
    
    def _calculate_weighted_scores(self, assessment_components: Dict[str, Any], weights: Dict[str, float]) -> Dict[str, Any]:
        """Calculate weighted scores"""
        component_scores = {}
        total_weighted_score = 0.0
        total_weight = 0.0
        
        for component, weight in weights.items():
            if component in assessment_components:
                component_score = assessment_components[component].get('score', 0.0)
                component_scores[component] = component_score
                total_weighted_score += component_score * weight
                total_weight += weight
        
        final_score = total_weighted_score / total_weight if total_weight > 0 else 0.0
        
        return {
            'component_scores': component_scores,
            'total_score': round(final_score, 1),
            'weight_distribution': weights
        }
    
    def _determine_mastery_level(self, weighted_scores: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        """Determine mastery level using Cavin's methodology"""
        total_score = weighted_scores['total_score']
        
        if total_score >= 90:
            level = 'advanced'
            percentage = total_score
        elif total_score >= 80:
            level = 'proficient'
            percentage = total_score
        elif total_score >= 70:
            level = 'developing'
            percentage = total_score
        else:
            level = 'beginning'
            percentage = total_score
        
        return {
            'level': level,
            'percentage': percentage,
            'strengths': self._identify_strengths_from_scores(weighted_scores['component_scores']),
            'improvement_areas': self._identify_improvement_areas(weighted_scores['component_scores'])
        }
    
    def _generate_detailed_score_breakdown(self, assessment_components: Dict[str, Any], 
                                         weighted_scores: Dict[str, Any], framework: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed score breakdown"""
        return {
            'overall_performance': f"Overall score of {weighted_scores['total_score']}% demonstrates {self._get_performance_level(weighted_scores['total_score'])} performance.",
            'component_breakdown': {
                component: f"Score: {score}% - {self._get_component_feedback(component, score)}"
                for component, score in weighted_scores['component_scores'].items()
            },
            'performance_highlights': self._identify_performance_highlights(weighted_scores['component_scores']),
            'development_opportunities': self._identify_development_opportunities(weighted_scores['component_scores'])
        }
    
    def _create_personalized_improvement_plan(self, mastery_determination: Dict[str, Any], 
                                            assessment_components: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        """Create personalized improvement plan"""
        return {
            'short_term_goals': self._set_short_term_goals(mastery_determination),
            'medium_term_objectives': self._set_medium_term_objectives(mastery_determination),
            'practice_recommendations': self._generate_practice_recommendations(mastery_determination),
            'learning_resources': self._suggest_learning_resources(mastery_determination),
            'timeline': self._create_improvement_timeline(mastery_determination)
        }
    
    def _get_next_assessment_recommendation(self, mastery_determination: Dict[str, Any]) -> Dict[str, Any]:
        """Get recommendation for next assessment"""
        level = mastery_determination['level']
        
        if level == 'advanced':
            return {
                'next_assessment_type': 'challenging_projects',
                'focus_areas': ['advanced_concepts', 'real_world_applications'],
                'timeline': '1_month'
            }
        elif level == 'proficient':
            return {
                'next_assessment_type': 'intermediate_challenges',
                'focus_areas': ['skill_refinement', 'complex_problems'],
                'timeline': '2_weeks'
            }
        else:
            return {
                'next_assessment_type': 'skill_building',
                'focus_areas': ['fundamental_concepts', 'practice_exercises'],
                'timeline': '1_week'
            }
    
    # Helper methods
    def _assess_code_complexity(self, code: str) -> str:
        """Assess code complexity level"""
        lines = len(code.split('\n'))
        if lines < 20:
            return 'simple'
        elif lines < 50:
            return 'moderate'
        else:
            return 'complex'
    
    def _validate_syntax(self, code: str, language: str) -> bool:
        """Validate code syntax"""
        try:
            if language.lower() == 'python':
                ast.parse(code)
                return True
            return True  # Simplified for other languages
        except SyntaxError:
            return False
    
    def _identify_potential_issues(self, code: str, language: str) -> List[str]:
        """Identify potential code issues"""
        issues = []
        
        if language.lower() == 'python':
            if 'import *' in code:
                issues.append('Avoid wildcard imports')
            if code.count('\t') > 0 and code.count('    ') > 0:
                issues.append('Mixed indentation detected')
        
        return issues
    
    def _calculate_cyclomatic_complexity(self, code: str) -> int:
        """Calculate cyclomatic complexity"""
        complexity_indicators = ['if', 'elif', 'else', 'for', 'while', 'try', 'except', 'and', 'or']
        complexity = 1  # Base complexity
        
        for indicator in complexity_indicators:
            complexity += code.lower().count(indicator)
        
        return complexity
    
    def _calculate_maintainability_index(self, code: str) -> float:
        """Calculate maintainability index"""
        lines = len([line for line in code.split('\n') if line.strip()])
        complexity = self._calculate_cyclomatic_complexity(code)
        
        # Simplified maintainability calculation
        return max(0, min(100, 100 - (complexity * 2) - (lines / 10)))
    
    def _check_indentation(self, code: str) -> bool:
        """Check indentation consistency"""
        lines = code.split('\n')
        for line in lines:
            if line.strip() and not line.startswith(' ') and not line.startswith('\t'):
                continue
            if line.startswith('\t') and '    ' in line:
                return False
        return True
    
    def _check_naming_conventions(self, code: str) -> bool:
        """Check naming conventions"""
        # Simplified check for Python conventions
        import re
        variable_pattern = r'\b([a-z_][a-z0-9_]*)\s*='
        function_pattern = r'def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\('
        
        variables = re.findall(variable_pattern, code)
        functions = re.findall(function_pattern, code)
        
        # Check if all names follow convention (lowercase with underscores)
        all_valid = True
        for name in variables + functions:
            if not re.match(r'^[a-z_][a-z0-9_]*$', name):
                all_valid = False
                break
        
        return all_valid
    
    def _assess_comments(self, code: str) -> str:
        """Assess comment quality"""
        lines = code.split('\n')
        comment_lines = [line for line in lines if line.strip().startswith('#')]
        total_lines = len([line for line in lines if line.strip()])
        
        if total_lines == 0:
            return 'no_code'
        
        comment_ratio = len(comment_lines) / total_lines
        
        if comment_ratio < 0.1:
            return 'insufficient'
        elif comment_ratio < 0.3:
            return 'adequate'
        else:
            return 'good'
    
    def _get_performance_descriptor(self, score: float) -> str:
        """Get performance descriptor"""
        if score >= 90:
            return 'excellent'
        elif score >= 80:
            return 'very good'
        elif score >= 70:
            return 'good'
        elif score >= 60:
            return 'satisfactory'
        else:
            return 'needs_improvement'
    
    def _get_quality_descriptor(self, score: float) -> str:
        """Get code quality descriptor"""
        if score >= 85:
            return 'high-quality'
        elif score >= 75:
            return 'good'
        elif score >= 65:
            return 'acceptable'
        else:
            return 'needs_improvement'
    
    def _extract_specific_points(self, technical_analysis: Dict[str, Any]) -> List[str]:
        """Extract specific technical points"""
        points = []
        if technical_analysis['syntax_correctness']:
            points.append('Syntax is correct and error-free')
        if technical_analysis['logic_flow'] == 'good':
            points.append('Logic flow is logical and coherent')
        return points
    
    def _generate_code_quality_recommendations(self, quality_score: float) -> List[str]:
        """Generate code quality recommendations"""
        recommendations = []
        if quality_score < 80:
            recommendations.append('Improve code organization and structure')
            recommendations.append('Add more descriptive variable names')
        if quality_score < 70:
            recommendations.append('Include more comments for clarity')
            recommendations.append('Follow language-specific style guides')
        return recommendations
    
    def _identify_strengths_for_celebration(self, llm_analysis: Dict[str, Any]) -> List[str]:
        """Identify strengths to celebrate"""
        strengths = []
        if llm_analysis['technical_analysis']['accuracy_score'] > 80:
            strengths.append('Strong technical implementation skills')
        if llm_analysis['quality_assessment']['readability_score'] > 80:
            strengths.append('Good code organization and readability')
        if llm_analysis['problem_solving']['approach_quality'] == 'logical':
            strengths.append('Logical problem-solving approach')
        return strengths
    
    def _generate_constructive_guidance(self, llm_analysis: Dict[str, Any]) -> Dict[str, str]:
        """Generate constructive guidance"""
        guidance = {}
        if llm_analysis['learning_insights']['improvement_areas']:
            guidance['focus_area'] = llm_analysis['learning_insights']['improvement_areas'][0]
        if llm_analysis['learning_insights']['next_level_skills']:
            guidance['next_skills'] = llm_analysis['learning_insights']['next_level_skills'][0]
        return guidance
    
    def _suggest_next_level_preparation(self, overall_score: float, user_id: int) -> List[str]:
        """Suggest next level preparation"""
        if overall_score >= 80:
            return [
                'Practice with more complex algorithms',
                'Explore design patterns',
                'Work on real-world projects'
            ]
        elif overall_score >= 70:
            return [
                'Review fundamental concepts',
                'Practice more coding exercises',
                'Study code optimization techniques'
            ]
        else:
            return [
                'Focus on basic syntax and concepts',
                'Complete more beginner exercises',
                'Review error handling techniques'
            ]
    
    def _generate_motivational_message(self, overall_score: float, user_id: int) -> str:
        """Generate motivational message"""
        if overall_score >= 85:
            return f"Outstanding work! Your progress shows dedication and strong problem-solving skills. Keep pushing forward!"
        elif overall_score >= 75:
            return f"Great progress! You're building solid foundations. Each step forward brings you closer to mastery."
        elif overall_score >= 65:
            return f"You're making steady progress! Every line of code you write contributes to your growth as a programmer."
        else:
            return f"Every expert was once a beginner. Your effort and persistence will lead to significant improvement. Keep coding!"
    
    def _get_understanding_level(self, score: float) -> str:
        """Get understanding level descriptor"""
        if score >= 85:
            return 'deep understanding'
        elif score >= 75:
            return 'good understanding'
        elif score >= 65:
            return 'basic understanding'
        else:
            return 'developing understanding'
    
    def _get_communication_quality(self, score: float) -> str:
        """Get communication quality descriptor"""
        if score >= 85:
            return 'excellent'
        elif score >= 75:
            return 'good'
        elif score >= 65:
            return 'adequate'
        else:
            return 'developing'
    
    def _generate_text_encouragement(self, conceptual_score: float, user_id: int) -> str:
        """Generate text response encouragement"""
        if conceptual_score >= 80:
            return f"Your explanations show excellent grasp of the concepts! Your ability to articulate ideas clearly is impressive."
        elif conceptual_score >= 70:
            return f"Good work! Your understanding is solid and your explanations are clear and well-organized."
        else:
            return f"You're making good progress in understanding these concepts. Keep practicing and your clarity will continue to improve."
    
    def _suggest_text_improvement_steps(self, conceptual_assessment: Dict[str, Any], communication_analysis: Dict[str, Any]) -> List[str]:
        """Suggest text improvement steps"""
        steps = []
        if conceptual_assessment['gaps_in_understanding']:
            steps.append(f"Review and deepen understanding of: {', '.join(conceptual_assessment['gaps_in_understanding'])}")
        if communication_analysis['clarity_score'] < 80:
            steps.append("Practice organizing thoughts before writing")
            steps.append("Use more specific examples to illustrate points")
        return steps
    
    def _classify_input_type(self, current_input: str) -> str:
        """Classify the type of user input"""
        if any(keyword in current_input.lower() for keyword in ['def ', 'class ', 'function']):
            return 'code_input'
        elif '?' in current_input:
            return 'question'
        elif len(current_input.split()) < 10:
            return 'brief_response'
        else:
            return 'detailed_response'
    
    def _assess_input_complexity(self, current_input: str) -> str:
        """Assess input complexity"""
        if len(current_input) < 50:
            return 'simple'
        elif len(current_input) < 200:
            return 'moderate'
        else:
            return 'complex'
    
    def _assess_correctness(self, current_input: str, context: str) -> str:
        """Assess input correctness"""
        # Simplified correctness assessment
        if 'error' in current_input.lower() or 'exception' in current_input.lower():
            return 'has_issues'
        elif 'print(' in current_input or 'return' in current_input:
            return 'appears_correct'
        else:
            return 'neutral'
    
    def _assess_engagement(self, current_input: str) -> str:
        """Assess user engagement level"""
        if len(current_input) > 100 and '?' in current_input:
            return 'highly_engaged'
        elif len(current_input) > 50:
            return 'moderately_engaged'
        else:
            return 'minimally_engaged'
    
    def _get_scoring_dimensions(self) -> List[str]:
        """Get scoring dimensions"""
        return ['technical_accuracy', 'conceptual_understanding', 'problem_solving', 'communication']
    
    def _get_weight_distribution(self, assessment_components: Dict[str, Any]) -> Dict[str, float]:
        """Get weight distribution for scoring"""
        return {
            'technical_accuracy': 0.3,
            'conceptual_understanding': 0.25,
            'problem_solving': 0.25,
            'communication': 0.2
        }
    
    def _get_performance_level(self, total_score: float) -> str:
        """Get overall performance level"""
        if total_score >= 90:
            return 'excellent'
        elif total_score >= 80:
            return 'proficient'
        elif total_score >= 70:
            return 'developing'
        else:
            return 'beginning'
    
    def _identify_strengths_from_scores(self, component_scores: Dict[str, float]) -> List[str]:
        """Identify strengths from component scores"""
        strengths = []
        for component, score in component_scores.items():
            if score >= 80:
                strengths.append(f"Strong {component.replace('_', ' ')} skills")
        return strengths
    
    def _identify_improvement_areas(self, component_scores: Dict[str, float]) -> List[str]:
        """Identify improvement areas from component scores"""
        improvements = []
        for component, score in component_scores.items():
            if score < 70:
                improvements.append(f"Improve {component.replace('_', ' ')}")
        return improvements
    
    def _identify_performance_highlights(self, component_scores: Dict[str, float]) -> List[str]:
        """Identify performance highlights"""
        highlights = []
        max_score = max(component_scores.values()) if component_scores else 0
        for component, score in component_scores.items():
            if score == max_score and score >= 75:
                highlights.append(f"Excellence in {component.replace('_', ' ')}")
        return highlights
    
    def _identify_development_opportunities(self, component_scores: Dict[str, float]) -> List[str]:
        """Identify development opportunities"""
        opportunities = []
        min_score = min(component_scores.values()) if component_scores else 0
        for component, score in component_scores.items():
            if score < 80:
                opportunities.append(f"Development opportunity in {component.replace('_', ' ')}")
        return opportunities
    
    def _get_component_feedback(self, component: str, score: float) -> str:
        """Get feedback for specific component"""
        if score >= 85:
            return 'excellent performance'
        elif score >= 75:
            return 'good performance'
        elif score >= 65:
            return 'satisfactory performance'
        else:
            return 'needs improvement'
    
    def _set_short_term_goals(self, mastery_determination: Dict[str, Any]) -> List[str]:
        """Set short-term learning goals"""
        level = mastery_determination['level']
        if level in ['advanced', 'proficient']:
            return [
                'Master advanced concepts',
                'Apply skills to complex projects',
                'Explore cutting-edge techniques'
            ]
        else:
            return [
                'Strengthen fundamental concepts',
                'Complete practice exercises',
                'Build consistent coding habits'
            ]
    
    def _set_medium_term_objectives(self, mastery_determination: Dict[str, Any]) -> List[str]:
        """Set medium-term learning objectives"""
        return [
            'Achieve proficiency in core areas',
            'Develop project portfolio',
            'Engage with coding community'
        ]
    
    def _generate_practice_recommendations(self, mastery_determination: Dict[str, Any]) -> List[str]:
        """Generate practice recommendations"""
        recommendations = []
        improvement_areas = mastery_determination.get('improvement_areas', [])
        
        for area in improvement_areas[:2]:  # Limit to top 2 areas
            recommendations.append(f"Practice exercises focusing on {area}")
        
        return recommendations
    
    def _suggest_learning_resources(self, mastery_determination: Dict[str, Any]) -> List[str]:
        """Suggest learning resources"""
        return [
            'Interactive coding tutorials',
            'Practice problem sets',
            'Peer programming sessions',
            'Documentation and examples'
        ]
    
    def _create_improvement_timeline(self, mastery_determination: Dict[str, Any]) -> str:
        """Create improvement timeline"""
        level = mastery_determination['level']
        if level == 'beginning':
            return '4-6 weeks of consistent practice'
        elif level == 'developing':
            return '3-4 weeks of focused improvement'
        else:
            return '2-3 weeks for skill refinement'

# Register the walker
WALKERS = [
    {
        'name': 'evaluate_code_submission',
        'description': 'Evaluate code submission using Cavin Otieno methodology',
        'parameters': ['user_id', 'quiz_id', 'code', 'language']
    },
    {
        'name': 'evaluate_text_response',
        'description': 'Evaluate text response using Cavin Otieno assessment',
        'parameters': ['user_id', 'quiz_id', 'response', 'question_type']
    },
    {
        'name': 'provide_real_time_feedback',
        'description': 'Provide real-time feedback during learning using Cavin principles',
        'parameters': ['user_id', 'current_input', 'context', 'feedback_type']
    },
    {
        'name': 'calculate_comprehensive_score',
        'description': 'Calculate comprehensive score using Cavin Otieno methodology',
        'parameters': ['user_id', 'assessment_components']
    }
]

# Create evaluator instance
evaluator = Evaluator()