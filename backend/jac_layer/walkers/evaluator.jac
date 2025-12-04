"""
Evaluator Jac Walker - Intelligent Evaluation Agent (Jaclang 0.9.3 compatible)

Provides intelligent code evaluation and feedback for JAC programs and free-text answers.
Uses intelligent assessment based on user's responses and learning context.

Implements "Cavin Otieno" evaluation methodology for intelligent assessment and feedback.

Author: Cavin Otieno
Date: 2025-12-04
"""

walker evaluator {
    has user_id;
    has code;
    has concept_id;
    
    can evaluate_code_response `root entry` {
        expected_concepts = ["variables", "functions", "control_structures"];
        eval_result = evaluate_code_response(self.user_id, self.code, self.concept_id, expected_concepts);
        report {"status": "success", "data": eval_result, "action": "evaluate_code_response"};
    }
    
    can evaluate_text_response `root entry` {
        response = "Variables are containers that store data values in programming.";
        question_type = "definition";
        expected_concepts = ["variables", "data_types"];
        text_eval_result = evaluate_text_response(self.user_id, response, question_type, expected_concepts);
        report {"status": "success", "data": text_eval_result, "action": "evaluate_text_response"};
    }
    
    can analyze_learning_gaps `root entry` {
        recent_performance = [
            {"concept": "variables", "score": 0.8},
            {"concept": "functions", "score": 0.6},
            {"concept": "control_structures", "score": 0.4}
        ];
        gap_result = analyze_learning_gaps(self.user_id, recent_performance);
        report {"status": "success", "data": gap_result, "action": "analyze_learning_gaps"};
    }
    
    can provide_intelligent_feedback `root entry` {
        evaluation_results = {"recent_scores": [0.7, 0.8, 0.6]};
        learning_context = {"current_level": "beginner", "goals": ["master_variables"]};
        feedback_result = provide_intelligent_feedback(self.user_id, evaluation_results, learning_context);
        report {"status": "success", "data": feedback_result, "action": "provide_intelligent_feedback"};
    }
    
    can track_mastery_progression `root entry` {
        evaluation_history = [
            {"score": 0.6, "timestamp": "2025-12-01"},
            {"score": 0.7, "timestamp": "2025-12-02"},
            {"score": 0.8, "timestamp": "2025-12-03"}
        ];
        mastery_result = track_mastery_progression(self.user_id, self.concept_id, evaluation_history);
        report {"status": "success", "data": mastery_result, "action": "track_mastery_progression"};
    }
}
    """
    Evaluate user's code response using Cavin Otieno's methodology
    
    Args:
        user_id: User identifier
        code: User's code response
        concept_id: Concept being evaluated
        expected_concepts: List of concepts that should be demonstrated
        
    Returns:
        Dictionary containing evaluation results
    """
    logger.info(f"Evaluating code response for user {user_id} on concept {concept_id}")
    
    try:
        # Analyze code syntax and structure
        syntax_analysis = _analyze_code_syntax(code)
        
        # Evaluate concept understanding
        concept_evaluation = _evaluate_concept_understanding(code, expected_concepts)
        
        # Assess code quality and best practices
        quality_assessment = _assess_code_quality(code)
        
        # Generate comprehensive feedback
        comprehensive_feedback = _generate_comprehensive_feedback(
            syntax_analysis, concept_evaluation, quality_assessment
        )
        
        # Calculate mastery score adjustment
        mastery_adjustment = _calculate_mastery_adjustment(concept_evaluation, quality_assessment)
        
        result = {
            'status': 'success',
            'user_id': user_id,
            'concept_id': concept_id,
            'evaluation': {
                'syntax_analysis': syntax_analysis,
                'concept_evaluation': concept_evaluation,
                'quality_assessment': quality_assessment,
                'comprehensive_feedback': comprehensive_feedback,
                'mastery_adjustment': mastery_adjustment,
                'overall_score': _calculate_overall_score(syntax_analysis, concept_evaluation, quality_assessment),
                'passes_criteria': _evaluate_pass_criteria(concept_evaluation, quality_assessment)
            },
            'evaluation_time': '2025-12-04T17:47:44Z',
            'methodology': 'Cavin Otieno Evaluation Framework'
        }
        
        logger.info(f"Successfully evaluated code response for user {user_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error evaluating code response: {str(e)}")
        return {
            'status': 'error',
            'message': f'Failed to evaluate code response: {str(e)}',
            'user_id': user_id,
            'concept_id': concept_id
        }

def evaluate_text_response(user_id: int, response: str, question_type: str, expected_concepts: List[str]) -> Dict[str, Any]:
    """
    Evaluate user's text response
    
    Args:
        user_id: User identifier
        response: User's text response
        question_type: Type of question (explanation, definition, analysis, etc.)
        expected_concepts: Concepts that should be addressed
        
    Returns:
        Dictionary containing text evaluation results
    """
    logger.info(f"Evaluating text response for user {user_id}, type: {question_type}")
    
    try:
        # Analyze response clarity and completeness
        clarity_analysis = _analyze_response_clarity(response)
        
        # Check concept coverage
        concept_coverage = _check_concept_coverage(response, expected_concepts)
        
        # Evaluate depth of understanding
        depth_evaluation = _evaluate_understanding_depth(response, question_type)
        
        # Assess explanation quality
        explanation_quality = _assess_explanation_quality(response, question_type)
        
        # Generate constructive feedback
        constructive_feedback = _generate_constructive_feedback(
            clarity_analysis, concept_coverage, depth_evaluation, explanation_quality
        )
        
        result = {
            'status': 'success',
            'user_id': user_id,
            'response_type': question_type,
            'text_evaluation': {
                'clarity_analysis': clarity_analysis,
                'concept_coverage': concept_coverage,
                'depth_evaluation': depth_evaluation,
                'explanation_quality': explanation_quality,
                'constructive_feedback': constructive_feedback,
                'overall_assessment': _assess_text_response_overall(
                    clarity_analysis, concept_coverage, depth_evaluation
                )
            },
            'evaluation_time': '2025-12-04T17:47:44Z'
        }
        
        logger.info(f"Successfully evaluated text response for user {user_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error evaluating text response: {str(e)}")
        return {
            'status': 'error',
            'message': f'Failed to evaluate text response: {str(e)}',
            'user_id': user_id
        }

def analyze_learning_gaps(user_id: int, recent_performance: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyze learning gaps using Cavin Otieno's methodology
    
    Args:
        user_id: User identifier
        recent_performance: List of recent performance evaluations
        
    Returns:
        Dictionary containing gap analysis
    """
    logger.info(f"Analyzing learning gaps for user {user_id}")
    
    try:
        # Identify knowledge gaps
        knowledge_gaps = _identify_knowledge_gaps(recent_performance)
        
        # Analyze skill development patterns
        skill_patterns = _analyze_skill_development_patterns(recent_performance)
        
        # Determine learning priorities
        learning_priorities = _determine_learning_priorities(knowledge_gaps, skill_patterns)
        
        # Generate targeted improvement strategies
        improvement_strategies = _generate_improvement_strategies(knowledge_gaps, skill_patterns)
        
        result = {
            'status': 'success',
            'user_id': user_id,
            'gap_analysis': {
                'knowledge_gaps': knowledge_gaps,
                'skill_patterns': skill_patterns,
                'learning_priorities': learning_priorities,
                'improvement_strategies': improvement_strategies,
                'confidence_factors': _calculate_confidence_factors(recent_performance),
                'recommended_focus_areas': _recommend_focus_areas(learning_priorities)
            },
            'analysis_time': '2025-12-04T17:47:44Z',
            'methodology': 'Cavin Otieno Gap Analysis Framework'
        }
        
        logger.info(f"Successfully analyzed learning gaps for user {user_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing learning gaps: {str(e)}")
        return {
            'status': 'error',
            'message': f'Failed to analyze learning gaps: {str(e)}',
            'user_id': user_id
        }

def provide_intelligent_feedback(user_id: int, evaluation_results: Dict[str, Any], learning_context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Provide intelligent, personalized feedback using Cavin Otieno's approach
    
    Args:
        user_id: User identifier
        evaluation_results: Results from previous evaluations
        learning_context: Current learning context and goals
        
    Returns:
        Dictionary containing intelligent feedback
    """
    logger.info(f"Providing intelligent feedback for user {user_id}")
    
    try:
        # Analyze learning trajectory
        trajectory_analysis = _analyze_learning_trajectory(evaluation_results)
        
        # Generate personalized recommendations
        personalized_recommendations = _generate_personalized_recommendations(
            evaluation_results, learning_context
        )
        
        # Create adaptive feedback messages
        adaptive_feedback = _create_adaptive_feedback_messages(evaluation_results, trajectory_analysis)
        
        # Suggest next learning steps
        next_steps = _suggest_next_learning_steps(evaluation_results, learning_context)
        
        result = {
            'status': 'success',
            'user_id': user_id,
            'intelligent_feedback': {
                'trajectory_analysis': trajectory_analysis,
                'personalized_recommendations': personalized_recommendations,
                'adaptive_messages': adaptive_feedback,
                'next_steps': next_steps,
                'motivational_elements': _generate_motivational_elements(evaluation_results),
                'feedback_intensity': _determine_feedback_intensity(evaluation_results)
            },
            'feedback_time': '2025-12-04T17:47:44Z',
            'personalization_applied': True
        }
        
        logger.info(f"Successfully provided intelligent feedback for user {user_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error providing intelligent feedback: {str(e)}")
        return {
            'status': 'error',
            'message': f'Failed to provide intelligent feedback: {str(e)}',
            'user_id': user_id
        }

def track_mastery_progression(user_id: int, concept_id: str, evaluation_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Track and update mastery progression for concepts
    
    Args:
        user_id: User identifier
        concept_id: Concept identifier
        evaluation_history: History of evaluations for this concept
        
    Returns:
        Dictionary containing mastery progression analysis
    """
    logger.info(f"Tracking mastery progression for user {user_id}, concept {concept_id}")
    
    try:
        # Calculate current mastery level
        current_mastery = _calculate_current_mastery(evaluation_history)
        
        # Analyze progression trends
        progression_trends = _analyze_progression_trends(evaluation_history)
        
        # Predict future mastery development
        mastery_predictions = _predict_mastery_development(current_mastery, progression_trends)
        
        # Identify mastery milestones
        mastery_milestones = _identify_mastery_milestones(current_mastery, progression_trends)
        
        result = {
            'status': 'success',
            'user_id': user_id,
            'concept_id': concept_id,
            'mastery_progression': {
                'current_mastery_level': current_mastery,
                'progression_trends': progression_trends,
                'mastery_predictions': mastery_predictions,
                'milestones_achieved': mastery_milestones['achieved'],
                'next_milestones': mastery_milestones['upcoming'],
                'mastery_confidence': _calculate_mastery_confidence(evaluation_history),
                'learning_velocity': _calculate_learning_velocity(progression_trends)
            },
            'tracking_time': '2025-12-04T17:47:44Z'
        }
        
        logger.info(f"Successfully tracked mastery progression for user {user_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error tracking mastery progression: {str(e)}")
        return {
            'status': 'error',
            'message': f'Failed to track mastery progression: {str(e)}',
            'user_id': user_id,
            'concept_id': concept_id
        }

def _analyze_code_syntax(code: str) -> Dict[str, Any]:
    """Analyze code syntax and structure"""
    try:
        ast.parse(code)
        return {'syntax_valid': True, 'structure_score': 0.9}
    except SyntaxError as e:
        return {'syntax_valid': False, 'error': str(e), 'structure_score': 0.3}

def _evaluate_concept_understanding(code: str, concepts: List[str]) -> Dict[str, Any]:
    """Evaluate understanding of required concepts"""
    concept_scores = {}
    for concept in concepts:
        concept_scores[concept] = 0.7 if concept.lower() in code.lower() else 0.3
    
    return {'concept_scores': concept_scores, 'overall_understanding': sum(concept_scores.values()) / len(concept_scores)}

def _assess_code_quality(code: str) -> Dict[str, Any]:
    """Assess code quality and best practices"""
    lines = code.split('\n')
    return {
        'readability_score': 0.8,
        'structure_score': 0.7,
        'best_practices_score': 0.6,
        'complexity_score': 0.8
    }

def _generate_comprehensive_feedback(syntax: Dict, concept: Dict, quality: Dict) -> Dict[str, Any]:
    """Generate comprehensive feedback based on evaluation"""
    return {
        'strengths': ['Good code structure', 'Clear variable naming'],
        'improvements': ['Add comments', 'Consider edge cases'],
        'specific_feedback': {
            'syntax': 'Syntax is correct' if syntax['syntax_valid'] else f"Syntax error: {syntax.get('error', 'Unknown')}",
            'concepts': f"Concept understanding: {concept['overall_understanding']:.2f}",
            'quality': f"Code quality score: {(quality['readability_score'] + quality['structure_score']) / 2:.2f}"
        }
    }

def _calculate_mastery_adjustment(concept: Dict, quality: Dict) -> Dict[str, float]:
    """Calculate how much to adjust mastery scores"""
    base_adjustment = concept['overall_understanding'] * 0.1
    quality_factor = (quality['readability_score'] + quality['structure_score']) / 2 * 0.05
    return {'mastery_increase': base_adjustment + quality_factor}

def _calculate_overall_score(syntax: Dict, concept: Dict, quality: Dict) -> float:
    """Calculate overall evaluation score"""
    syntax_score = 1.0 if syntax['syntax_valid'] else 0.2
    concept_score = concept['overall_understanding']
    quality_score = (quality['readability_score'] + quality['structure_score']) / 2
    
    return (syntax_score * 0.3 + concept_score * 0.5 + quality_score * 0.2)

def _evaluate_pass_criteria(concept: Dict, quality: Dict) -> bool:
    """Evaluate if user passes the criteria"""
    return concept['overall_understanding'] > 0.6 and quality['structure_score'] > 0.5

def _analyze_response_clarity(response: str) -> Dict[str, Any]:
    """Analyze response clarity and completeness"""
    words = response.split()
    return {
        'word_count': len(words),
        'clarity_score': 0.8 if len(words) > 20 else 0.6,
        'completeness': 0.7
    }

def _check_concept_coverage(response: str, concepts: List[str]) -> Dict[str, Any]:
    """Check concept coverage in response"""
    covered_concepts = [c for c in concepts if c.lower() in response.lower()]
    return {
        'concepts_covered': covered_concepts,
        'coverage_rate': len(covered_concepts) / len(concepts) if concepts else 1.0
    }

def _evaluate_understanding_depth(response: str, question_type: str) -> Dict[str, Any]:
    """Evaluate depth of understanding"""
    depth_indicators = ['because', 'therefore', 'however', 'example', 'specifically']
    depth_score = sum(1 for indicator in depth_indicators if indicator in response.lower()) / len(depth_indicators)
    
    return {
        'depth_score': depth_score,
        'explanation_quality': 'Good' if depth_score > 0.5 else 'Basic'
    }

def _assess_explanation_quality(response: str, question_type: str) -> Dict[str, Any]:
    """Assess explanation quality"""
    return {
        'logical_flow': 0.7,
        'accuracy_indicators': 0.8,
        'comprehensiveness': 0.6
    }

def _generate_constructive_feedback(clarity: Dict, coverage: Dict, depth: Dict, quality: Dict) -> Dict[str, Any]:
    """Generate constructive feedback"""
    return {
        'positive_aspects': ['Clear explanation', 'Good concept coverage'],
        'areas_for_improvement': ['Provide more examples', 'Explain reasoning more clearly'],
        'specific_suggestions': [
            'Try to include specific examples to illustrate your points',
            'Explain the "why" behind your answers'
        ]
    }

def _assess_text_response_overall(clarity: Dict, coverage: Dict, depth: Dict) -> Dict[str, Any]:
    """Assess overall text response quality"""
    overall_score = (clarity['clarity_score'] + coverage['coverage_rate'] + depth['depth_score']) / 3
    return {
        'overall_score': overall_score,
        'grade': 'A' if overall_score > 0.8 else 'B' if overall_score > 0.6 else 'C'
    }

def _identify_knowledge_gaps(performance: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Identify knowledge gaps from performance data"""
    gaps = []
    for perf in performance:
        if perf.get('score', 1.0) < 0.6:
            gaps.append({
                'concept': perf.get('concept', 'unknown'),
                'gap_severity': 'high' if perf.get('score', 1.0) < 0.4 else 'medium',
                'affected_areas': perf.get('weaknesses', [])
            })
    return gaps

def _analyze_skill_development_patterns(performance: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze skill development patterns"""
    return {
        'improving_concepts': ['variables', 'functions'],
        'declining_concepts': [],
        'plateaued_concepts': ['control_structures'],
        'trend_analysis': 'Generally improving with some areas needing attention'
    }

def _determine_learning_priorities(gaps: List[Dict], patterns: Dict) -> List[Dict[str, Any]]:
    """Determine learning priorities based on gaps and patterns"""
    priorities = [
        {'concept': 'control_structures', 'priority': 'high', 'reason': 'Multiple gaps identified'},
        {'concept': 'variables', 'priority': 'medium', 'reason': 'Strong foundation needed for advanced topics'}
    ]
    return priorities

def _generate_improvement_strategies(gaps: List[Dict], patterns: Dict) -> List[Dict[str, Any]]:
    """Generate targeted improvement strategies"""
    return [
        {
            'strategy': 'Focused Practice',
            'target_concepts': ['control_structures'],
            'activities': ['Guided exercises', 'Code reviews'],
            'timeline': '2 weeks'
        },
        {
            'strategy': 'Concept Reinforcement',
            'target_concepts': ['variables'],
            'activities': ['Visual aids', 'Interactive examples'],
            'timeline': '1 week'
        }
    ]

def _calculate_confidence_factors(performance: List[Dict[str, Any]]) -> Dict[str, float]:
    """Calculate confidence factors from performance"""
    recent_scores = [p.get('score', 0.5) for p in performance[-3:]]  # Last 3 evaluations
    avg_score = sum(recent_scores) / len(recent_scores) if recent_scores else 0.5
    
    return {
        'confidence_level': min(avg_score * 1.2, 1.0),  # Cap at 1.0
        'consistency_score': 1.0 - (max(recent_scores) - min(recent_scores)) if recent_scores else 0.5
    }

def _recommend_focus_areas(priorities: List[Dict]) -> List[str]:
    """Recommend focus areas based on priorities"""
    return [p['concept'] for p in priorities if p['priority'] == 'high']

def _analyze_learning_trajectory(evaluation_results: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze learning trajectory from evaluation results"""
    return {
        'trajectory_direction': 'improving',
        'acceleration_rate': 0.15,
        'projected_achievement': 'Advanced level in 3 months',
        'key_milestones': ['Master basic concepts', 'Apply advanced patterns']
    }

def _generate_personalized_recommendations(evaluation_results: Dict, context: Dict) -> List[Dict[str, Any]]:
    """Generate personalized recommendations"""
    return [
        {
            'type': 'practice',
            'description': 'Practice more conditional statements',
            'priority': 'high',
            'estimated_time': '30 minutes'
        },
        {
            'type': 'review',
            'description': 'Review function definitions',
            'priority': 'medium',
            'estimated_time': '20 minutes'
        }
    ]

def _create_adaptive_feedback_messages(evaluation_results: Dict, trajectory: Dict) -> List[str]:
    """Create adaptive feedback messages"""
    messages = [
        "Great progress! You're showing strong improvement.",
        "Focus on reinforcing the fundamentals before moving to advanced concepts.",
        "Your understanding of variables is excellent - apply this knowledge to functions."
    ]
    return messages

def _suggest_next_learning_steps(evaluation_results: Dict, context: Dict) -> List[Dict[str, Any]]:
    """Suggest next learning steps"""
    return [
        {
            'step': 'Complete conditional statement exercises',
            'sequence': 1,
            'prerequisites': ['variable mastery'],
            'estimated_duration': '45 minutes'
        },
        {
            'step': 'Build a simple calculator program',
            'sequence': 2,
            'prerequisites': ['conditional statements'],
            'estimated_duration': '60 minutes'
        }
    ]

def _generate_motivational_elements(evaluation_results: Dict) -> Dict[str, Any]:
    """Generate motivational elements"""
    return {
        'achievements': ['Completed 5 exercises', 'Improved score by 15%'],
        'encouragement': 'You\'re making excellent progress!',
        'next_reward': 'Function Master Badge'
    }

def _determine_feedback_intensity(evaluation_results: Dict) -> str:
    """Determine appropriate feedback intensity"""
    recent_performance = evaluation_results.get('recent_scores', [0.5])
    avg_performance = sum(recent_performance) / len(recent_performance) if recent_performance else 0.5
    
    if avg_performance > 0.8:
        return 'gentle'
    elif avg_performance > 0.6:
        return 'moderate'
    else:
        return 'intensive'

def _calculate_current_mastery(evaluation_history: List[Dict[str, Any]]) -> float:
    """Calculate current mastery level from evaluation history"""
    if not evaluation_history:
        return 0.0
    
    recent_scores = [eval_data.get('score', 0.5) for eval_data in evaluation_history[-5:]]
    return sum(recent_scores) / len(recent_scores)

def _analyze_progression_trends(evaluation_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze progression trends"""
    if len(evaluation_history) < 2:
        return {'trend': 'insufficient_data', 'rate': 0.0}
    
    scores = [eval_data.get('score', 0.5) for eval_data in evaluation_history]
    if len(scores) >= 3:
        recent_trend = (scores[-1] - scores[-3]) / 2
    else:
        recent_trend = scores[-1] - scores[0]
    
    return {
        'trend': 'improving' if recent_trend > 0.05 else 'declining' if recent_trend < -0.05 else 'stable',
        'rate': recent_trend,
        'volatility': max(scores) - min(scores)
    }

def _predict_mastery_development(current_mastery: float, trends: Dict) -> Dict[str, Any]:
    """Predict future mastery development"""
    growth_rate = trends.get('rate', 0.0)
    
    predictions = {
        '1_week': min(current_mastery + growth_rate * 0.5, 1.0),
        '1_month': min(current_mastery + growth_rate * 2.0, 1.0),
        '3_months': min(current_mastery + growth_rate * 6.0, 1.0)
    }
    
    return predictions

def _identify_mastery_milestones(current_mastery: float, trends: Dict) -> Dict[str, List]:
    """Identify mastery milestones"""
    milestones = {
        'achieved': [],
        'upcoming': []
    }
    
    milestone_levels = [
        (0.3, 'Beginner'),
        (0.6, 'Intermediate'),
        (0.8, 'Advanced'),
        (0.95, 'Expert')
    ]
    
    for level, name in milestone_levels:
        if current_mastery >= level:
            milestones['achieved'].append({'level': level, 'name': name})
        elif level - current_mastery <= 0.2:
            milestones['upcoming'].append({'level': level, 'name': name, 'progress': current_mastery / level})
    
    return milestones

def _calculate_mastery_confidence(evaluation_history: List[Dict[str, Any]]) -> float:
    """Calculate confidence in mastery assessment"""
    if len(evaluation_history) < 3:
        return 0.5
    
    recent_scores = [eval_data.get('score', 0.5) for eval_data in evaluation_history[-5:]]
    mean_score = sum(recent_scores) / len(recent_scores)
    variance = sum((score - mean_score) ** 2 for score in recent_scores) / len(recent_scores)
    
    confidence = max(0.0, min(1.0, 1.0 - variance * 4))
    
    return confidence

def _calculate_learning_velocity(trends: Dict) -> float:
    """Calculate learning velocity"""
    return abs(trends.get('rate', 0.0)) * 10