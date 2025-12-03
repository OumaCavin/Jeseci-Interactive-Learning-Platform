// JAC Learning Platform - Enterprise Learning Intelligence System
// Author: Cavin Otieno
// Architecture: Zustand with AI-powered adaptive learning capabilities

import { create } from 'zustand';
import { subscribeWithSelector, devtools, immer } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';

// ===== ENTERPRISE LEARNING TYPES =====

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  type: LearningPathType;
  difficulty: LearningDifficulty;
  estimatedDuration: number; // in minutes
  moduleCount: number;
  prerequisites: string[];
  skills: Skill[];
  competencies: Competency[];
  tags: string[];
  isFeatured: boolean;
  isPublic: boolean;
  coverImage?: string;
  metadata: LearningPathMetadata;
  analytics: LearningPathAnalytics;
  aiInsights: AILearningInsights;
}

export type LearningPathType = 
  | 'guided' | 'adaptive' | 'self_paced' | 'milestone' | 'project_based' | 
  'competency' | 'micro_learning' | 'collaborative' | 'ai_powered' | 'hybrid';

export type LearningDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'adaptive';

export interface LearningPathMetadata {
  category: string;
  subcategory: string;
  industry: string;
  level: string;
  language: string;
  version: string;
  lastUpdated: string;
  author: string;
  rating: number;
  completionRate: number;
  averageScore: number;
  studentCount: number;
  reviewCount: number;
}

export interface LearningPathAnalytics {
  totalEnrollments: number;
  activeStudents: number;
  completionRate: number;
  averageTimeToComplete: number;
  averageScore: number;
  dropOffPoints: AnalysisPoint[];
  engagementMetrics: EngagementMetrics;
  learningOutcomes: LearningOutcome[];
}

export interface AnalysisPoint {
  moduleId: string;
  dropOffRate: number;
  averageTimeSpent: number;
  difficultyFeedback: number;
  contentEffectiveness: number;
}

export interface EngagementMetrics {
  dailyActiveUsers: number;
  sessionDuration: number;
  contentInteractionRate: number;
  practiceCompletionRate: number;
  discussionParticipationRate: number;
}

export interface LearningOutcome {
  skill: string;
  proficiencyGain: number;
  confidenceIncrease: number;
  applicationScore: number;
  retentionRate: number;
}

export interface Module {
  id: string;
  learningPathId: string;
  title: string;
  description: string;
  type: ModuleType;
  order: number;
  estimatedDuration: number;
  difficulty: number; // 1-5 scale
  content: ModuleContent;
  assessments: Assessment[];
  activities: LearningActivity[];
  prerequisites: string[];
  learningObjectives: LearningObjective[];
  adaptiveSettings: AdaptiveSettings;
  aiRecommendations: AIRecommendation[];
  analytics: ModuleAnalytics;
}

export type ModuleType = 
  | 'introduction' | 'concept' | 'practice' | 'application' | 'assessment' | 
  'project' | 'discussion' | 'simulation' | 'case_study' | 'lab' | 'quiz';

export interface ModuleContent {
  format: ContentFormat;
  content: any; // Rich content based on format
  media: MediaContent[];
  interactiveElements: InteractiveElement[];
  accessibility: AccessibilityFeatures;
  aiGenerated: boolean;
  lastAIUpdate: string;
}

export type ContentFormat = 
  | 'text' | 'video' | 'audio' | 'interactive' | 'simulation' | 
  'code_editor' | 'quiz' | 'diagram' | 'infographic' | 'vr_ar';

export interface MediaContent {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'simulation';
  url: string;
  title: string;
  description: string;
  duration?: number;
  size: number;
  quality: 'low' | 'medium' | 'high' | 'adaptive';
  transcript?: string;
  captions?: string;
}

export interface InteractiveElement {
  id: string;
  type: 'code_editor' | 'simulation' | 'drag_drop' | 'hotspot' | 'slider' | 'chart';
  configuration: any;
  progress: InteractiveProgress;
  aiHints: AIHint[];
}

export interface InteractiveProgress {
  completed: boolean;
  score: number;
  timeSpent: number;
  attempts: number;
  hintsUsed: number;
  lastInteraction: string;
}

export interface AIHint {
  id: string;
  trigger: string;
  hint: string;
  context: any;
  confidence: number;
  generatedAt: string;
}

export interface AccessibilityFeatures {
  screenReader: boolean;
  highContrast: boolean;
  keyboardNavigation: boolean;
  closedCaptions: boolean;
  audioDescriptions: boolean;
  transcriptAvailable: boolean;
  adjustableSpeed: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra_large';
}

export interface LearningActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  configuration: any;
  aiPersonalization: AIPersonalization;
  progress: ActivityProgress;
  analytics: ActivityAnalytics;
}

export type ActivityType = 
  | 'reading' | 'video_watching' | 'listening' | 'coding' | 'simulation' |
  'discussion' | 'collaboration' | 'problem_solving' | 'reflection' | 'practice';

export interface AIPersonalization {
  difficultyAdjustment: number;
  contentVariation: ContentVariation[];
  pacingRecommendations: PacingRecommendation;
  learningStyleAdaptation: LearningStyleAdaptation;
  contextAwareness: ContextAwareness;
}

export interface ContentVariation {
  originalContent: string;
  variations: ContentVariant[];
  adaptationReason: string;
  effectiveness: number;
}

export interface ContentVariant {
  id: string;
  content: any;
  adaptationType: string;
  confidence: number;
  generatedAt: string;
}

export interface PacingRecommendation {
  recommendedPace: 'slow' | 'normal' | 'fast' | 'adaptive';
  reasoning: string;
  basedOnData: any;
  adjustments: PaceAdjustment[];
}

export interface PaceAdjustment {
  moduleId: string;
  recommendedDuration: number;
  reasoning: string;
}

export interface LearningStyleAdaptation {
  detectedStyle: LearningStyle;
  adaptations: StyleAdaptation[];
  confidence: number;
  lastUpdate: string;
}

export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing' | 'multimodal';

export interface StyleAdaptation {
  elementType: string;
  originalFormat: string;
  adaptedFormat: string;
  reasoning: string;
}

export interface ContextAwareness {
  currentMood?: string;
  attentionLevel?: number;
  timeOfDay?: string;
  deviceType?: string;
  previousPerformance?: PerformanceContext;
}

export interface PerformanceContext {
  recentScores: number[];
  difficultyPreference: number;
  preferredPace: string;
  struggleAreas: string[];
  strengthAreas: string[];
}

export interface ActivityProgress {
  status: ActivityStatus;
  completionPercentage: number;
  timeSpent: number;
  attempts: number;
  score?: number;
  aiScore?: number;
  startedAt?: string;
  completedAt?: string;
  lastActivity: string;
}

export type ActivityStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped' | 'needs_review';

export interface ActivityAnalytics {
  engagementLevel: number;
  strugglePoints: string[];
  successPatterns: string[];
  learningVelocity: number;
  retentionPrediction: number;
  nextRecommendedAction: string;
}

export interface LearningObjective {
  id: string;
  description: string;
  type: ObjectiveType;
  difficulty: number;
  prerequisites: string[];
  successCriteria: SuccessCriteria;
  assessmentMethods: string[];
  aiGenerated: boolean;
}

export type ObjectiveType = 'knowledge' | 'comprehension' | 'application' | 'analysis' | 'synthesis' | 'evaluation';

export interface SuccessCriteria {
  measurableOutcomes: string[];
  threshold: number;
  evidence: string[];
  rubric: AssessmentRubric;
}

export interface AssessmentRubric {
  criteria: RubricCriterion[];
  scoringGuide: ScoringGuide;
  aiValidation: boolean;
}

export interface RubricCriterion {
  level: string;
  description: string;
  score: number;
  descriptors: string[];
}

export interface ScoringGuide {
  excellent: string;
  good: string;
  satisfactory: string;
  needsImprovement: string;
}

export interface AdaptiveSettings {
  difficultyAdjustment: boolean;
  pacingOptimization: boolean;
  contentVariation: boolean;
  assessmentAdaptation: boolean;
  collaborationMode: boolean;
  aiTutoring: boolean;
  realTimeHints: boolean;
  adaptiveReview: boolean;
}

export interface AIRecommendation {
  id: string;
  type: RecommendationType;
  content: any;
  reasoning: string;
  confidence: number;
  generatedAt: string;
  expiresAt: string;
  userFeedback?: RecommendationFeedback;
}

export type RecommendationType = 
  | 'content_variant' | 'pacing_adjustment' | 'difficulty_modification' |
  'review_suggestion' | 'collaboration_opportunity' | 'practice_recommendation' |
  'hint_provision' | 'motivation_message' | 'break_suggestion';

export interface RecommendationFeedback {
  helpful: boolean;
  relevance: number;
  actionTaken: boolean;
  feedback: string;
  timestamp: string;
}

export interface ModuleAnalytics {
  viewCount: number;
  completionRate: number;
  averageScore: number;
  averageTimeToComplete: number;
  difficultyRating: number;
  engagementScore: number;
  dropOffPoints: DropOffPoint[];
  aiEffectiveness: AIEffectivenessMetrics;
}

export interface DropOffPoint {
  section: string;
  dropOffRate: number;
  averageTimeSpent: number;
  userFeedback: string[];
  aiInsights: string[];
}

export interface AIEffectivenessMetrics {
  personalizationAccuracy: number;
  adaptationSuccess: number;
  recommendationRelevance: number;
  hintEffectiveness: number;
  predictiveAccuracy: number;
}

export interface UserLearningPath {
  id: string;
  userId: string;
  learningPathId: string;
  status: UserPathStatus;
  progress: UserPathProgress;
  enrollment: EnrollmentInfo;
  aiProfile: LearningAIProfile;
  collaboration: LearningCollaboration;
  analytics: UserPathAnalytics;
}

export type UserPathStatus = 
  | 'enrolled' | 'in_progress' | 'completed' | 'paused' | 'dropped' | 
  'recommendation' | 'featured' | 'custom' | 'peer_assisted';

export interface UserPathProgress {
  overallProgress: number; // 0-100
  currentModuleIndex: number;
  completedModules: string[];
  timeSpent: number; // in minutes
  averageScore: number;
  streakDays: number;
  lastActivity: string;
  estimatedCompletion: string;
  adaptiveMilestones: AdaptiveMilestone[];
}

export interface AdaptiveMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  achievedDate?: string;
  aiPersonalized: boolean;
  difficulty: number;
}

export interface EnrollmentInfo {
  enrolledAt: string;
  source: EnrollmentSource;
  motivation: string[];
  goals: string[];
  timeline: string;
  commitmentLevel: 'casual' | 'serious' | 'intensive';
}

export type EnrollmentSource = 
  | 'search' | 'recommendation' | 'peer' | 'instructor' | 'marketing' | 
  'curriculum' | 'adaptive' | 'social' | 'professional' | 'emergency';

export interface LearningAIProfile {
  learningStyle: LearningStyle;
  preferredPace: string;
  strengthAreas: string[];
  challengeAreas: string[];
  motivationFactors: string[];
  collaborationPreference: string;
  contentPreferences: ContentPreferences;
  aiAdaptationLevel: number;
  lastProfileUpdate: string;
}

export interface ContentPreferences {
  formatPreferences: string[];
  mediaPreferences: string[];
  interactionPreferences: string[];
  difficultyPreferences: string;
  timePreferences: string[];
  breakPreferences: BreakPreferences;
}

export interface BreakPreferences {
  frequency: string;
  duration: string;
  activities: string[];
  reminders: boolean;
}

export interface LearningCollaboration {
  peers: LearningPeer[];
  studyGroups: StudyGroup[];
  mentors: Mentor[];
  collaborativeActivities: CollaborativeActivity[];
  socialFeatures: SocialLearningFeatures;
}

export interface LearningPeer {
  peerId: string;
  peerName: string;
  learningPathId: string;
  status: 'active' | 'inactive' | 'completed' | 'ahead' | 'behind';
  compatibility: CompatibilityScore;
  interactionLevel: number;
  lastInteraction: string;
}

export interface CompatibilityScore {
  overall: number;
  learningStyle: number;
  pace: number;
  interests: number;
  goals: number;
}

export interface StudyGroup {
  id: string;
  name: string;
  members: string[];
  learningPathId: string;
  activity: GroupActivity;
  schedule: GroupSchedule;
  progress: GroupProgress;
}

export interface GroupActivity {
  discussionThreads: number;
  sharedResources: number;
  groupProjects: number;
  peerReviews: number;
  virtualMeetings: number;
}

export interface GroupSchedule {
  meetingTimes: string[];
  timeZone: string;
  frequency: string;
  nextMeeting: string;
}

export interface GroupProgress {
  overallProgress: number;
  averageScore: number;
  completionRate: number;
  engagementLevel: number;
}

export interface Mentor {
  mentorId: string;
  mentorName: string;
  expertise: string[];
  availability: string[];
  sessionCount: number;
  rating: number;
  specialties: string[];
}

export interface CollaborativeActivity {
  id: string;
  type: CollaborativeActivityType;
  participants: string[];
  status: ActivityStatus;
  progress: number;
  aiFacilitated: boolean;
}

export type CollaborativeActivityType = 
  | 'discussion' | 'project' | 'peer_review' | 'study_session' | 'problem_solving' |
  'knowledge_sharing' | 'code_review' | 'presentation' | 'debate' | 'workshop';

export interface SocialLearningFeatures {
  leaderboards: LeaderboardEntry[];
  achievements: UserAchievement[];
  socialFeed: SocialPost[];
  peerComparisons: PeerComparison[];
  sharingPreferences: SharingPreferences;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  rank: number;
  category: string;
  timeframe: string;
}

export interface UserAchievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  earnedAt: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  iconUrl: string;
  socialShare: boolean;
}

export type AchievementType = 
  | 'completion' | 'streak' | 'score' | 'speed' | 'collaboration' | 
  'innovation' | 'persistence' | 'helpfulness' | 'leadership' | 'consistency';

export interface SocialPost {
  id: string;
  userId: string;
  type: PostType;
  content: string;
  engagement: EngagementMetrics;
  timestamp: string;
  aiModerated: boolean;
}

export type PostType = 'progress' | 'achievement' | 'question' | 'tip' | 'milestone' | 'reflection';

export interface PeerComparison {
  peerId: string;
  peerName: string;
  comparisonMetrics: ComparisonMetrics;
  relativePerformance: string;
  insights: string[];
}

export interface ComparisonMetrics {
  progressRate: number;
  scoreComparison: number;
  timeEfficiency: number;
  engagementLevel: number;
  collaborationScore: number;
}

export interface SharingPreferences {
  progress: boolean;
  achievements: boolean;
  insights: boolean;
  comparisons: boolean;
  groups: boolean;
}

export interface UserPathAnalytics {
  totalTimeSpent: number;
  averageSessionDuration: number;
  learningVelocity: number;
  retentionRate: number;
  engagementTrend: TrendData[];
  performanceHistory: PerformanceHistory[];
  predictions: LearningPredictions;
  insights: LearningInsights[];
}

export interface TrendData {
  date: string;
  value: number;
  metric: string;
  trend: 'up' | 'down' | 'stable';
}

export interface PerformanceHistory {
  moduleId: string;
  scores: ScoreRecord[];
  attempts: number;
  improvement: number;
  aiAnalysis: string;
}

export interface ScoreRecord {
  score: number;
  timestamp: string;
  timeSpent: number;
  difficulty: number;
  confidence: number;
}

export interface LearningPredictions {
  completionProbability: number;
  timeToCompletion: number;
  expectedScore: number;
  retentionRate: number;
  dropoutRisk: number;
  nextOptimalAction: string;
  recommendedInterventions: string[];
}

export interface LearningInsights {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  actionability: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  generatedAt: string;
  expiresAt: string;
  implemented: boolean;
}

export type InsightType = 
  | 'performance' | 'engagement' | 'difficulty' | 'collaboration' | 'motivation' |
  'retention' | 'prediction' | 'recommendation' | 'optimization' | 'intervention';

export interface UserModuleProgress {
  id: string;
  userId: string;
  moduleId: string;
  learningPathId: string;
  status: UserModuleStatus;
  progress: ModuleProgress;
  learning: LearningProgress;
  engagement: EngagementData;
  aiAnalysis: ModuleAIAnalysis;
  collaboration: ModuleCollaboration;
}

export type UserModuleStatus = 
  | 'not_started' | 'in_progress' | 'completed' | 'mastered' | 
  'needs_review' | 'struggling' | 'accelerated' | 'paused';

export interface ModuleProgress {
  completionPercentage: number;
  timeSpent: number;
  attempts: number;
  scores: ScoreRecord[];
  currentAttempt: number;
  masteryLevel: number;
  prerequisitesMet: boolean;
  nextRecommendedAction: string;
}

export interface LearningProgress {
  understanding: number; // 0-100
  retention: number; // 0-100
  application: number; // 0-100
  confidence: number; // 0-100
  motivation: number; // 0-100
  flowState: number; // 0-100
  cognitiveLoad: number; // 0-100
  learningVelocity: number; // 0-100
}

export interface EngagementData {
  attentionLevel: number; // 0-100
  interactionFrequency: number;
  contentClarity: number;
  difficultyAppropriate: number;
  interestLevel: number;
  challengeLevel: number;
  frustrationLevel: number; // 0-100 (lower is better)
  breakFrequency: number;
  sessionQuality: number; // 0-100
}

export interface ModuleAIAnalysis {
  personalizedPath: PersonalizedModulePath;
  difficultyRecommendation: DifficultyRecommendation;
  contentAdaptation: ContentAdaptation;
  interventionSuggestions: InterventionSuggestion[];
  successPrediction: SuccessPrediction;
  learningPattern: LearningPattern;
}

export interface PersonalizedModulePath {
  optimalSequence: string[];
  skipRecommendations: string[];
  reviewRecommendations: string[];
  accelerationOpportunities: string[];
  difficultyAdjustments: DifficultyAdjustment[];
  reasoning: string;
}

export interface DifficultyRecommendation {
  currentLevel: number;
  recommendedLevel: number;
  reasoning: string;
  confidence: number;
  adaptationFactors: string[];
}

export interface ContentAdaptation {
  recommendedVariations: ContentVariation[];
  formatAdjustments: FormatAdjustment[];
  pacingRecommendations: PacingRecommendation[];
  interactionEnhancements: InteractionEnhancement[];
}

export interface FormatAdjustment {
  originalFormat: string;
  recommendedFormat: string;
  reasoning: string;
  implementation: string;
}

export interface InteractionEnhancement {
  elementType: string;
  currentInteraction: string;
  recommendedInteraction: string;
  expectedImpact: number;
}

export interface InterventionSuggestion {
  id: string;
  type: InterventionType;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  effectiveness: number; // 0-100
  implementation: string;
  aiGenerated: boolean;
}

export type InterventionType = 
  | 'hint' | 'break' | 'simplification' | 'acceleration' | 'collaboration' |
  'review' | 'practice' | 'explanation' | 'motivation' | 'adjustment';

export interface SuccessPrediction {
  completionProbability: number;
  expectedScore: number;
  timeToCompletion: number;
  difficultyOfCompletion: number;
  factors: SuccessFactor[];
  confidence: number;
}

export interface SuccessFactor {
  factor: string;
  impact: number; // -100 to 100
  description: string;
  controllable: boolean;
}

export interface LearningPattern {
  learningStyle: LearningStyle;
  optimalTimes: string[];
  sessionPreferences: SessionPreferences;
  challengeResponse: ChallengeResponse;
  collaborationPreference: string;
  retentionStrategy: RetentionStrategy;
}

export interface SessionPreferences {
  idealDuration: number;
  breakFrequency: number;
  contentDensity: string;
  interactionLevel: string;
  difficultyProgression: string;
}

export interface ChallengeResponse {
  initialReaction: string;
  recoveryTime: number;
  helpSeekingBehavior: string;
  persistenceLevel: number;
  adaptationSpeed: number;
}

export interface RetentionStrategy {
  optimalReviewTiming: string[];
  reviewMethods: string[];
  spacedRepetition: SpacedRepetitionSettings;
  reinforcementTechniques: string[];
}

export interface SpacedRepetitionSettings {
  initialInterval: number; // days
  repetitionFactor: number;
  maxInterval: number; // days
  difficultyAdjustment: boolean;
  retentionTarget: number; // 0-100
}

export interface ModuleCollaboration {
  peerDiscussions: PeerDiscussion[];
  groupActivities: GroupActivity[];
  mentorSupport: MentorSupport[];
  collaborativeFeatures: CollaborativeModuleFeatures;
}

export interface PeerDiscussion {
  id: string;
  participants: string[];
  topic: string;
  engagement: number;
  aiModerated: boolean;
  lastActivity: string;
}

export interface GroupActivity {
  id: string;
  type: string;
  status: string;
  participants: string[];
  progress: number;
  aiFacilitated: boolean;
}

export interface MentorSupport {
  mentorId: string;
  supportType: string;
  provided: boolean;
  quality: number;
  timestamp: string;
}

export interface CollaborativeModuleFeatures {
  peerReview: boolean;
  groupProblem: boolean;
  discussionForum: boolean;
  sharedResources: boolean;
  virtualStudyRoom: boolean;
  aiFacilitated: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  level: SkillLevel;
  prerequisites: string[];
  learningObjectives: string[];
  assessmentCriteria: AssessmentCriteria;
  aiGenerated: boolean;
  industryRelevance: number;
}

export type SkillCategory = 
  | 'technical' | 'cognitive' | 'creative' | 'analytical' | 'communication' |
  'leadership' | 'problem_solving' | 'collaboration' | 'adaptability' | 'innovation';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';

export interface AssessmentCriteria {
  knowledgeLevel: number; // 0-100
  practicalApplication: number; // 0-100
  innovationThinking: number; // 0-100
  collaborationSkills: number; // 0-100
  communicationEffectiveness: number; // 0-100
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  framework: CompetencyFramework;
  levels: CompetencyLevel[];
  measurement: CompetencyMeasurement;
  industryAlignment: IndustryAlignment;
}

export type CompetencyFramework = 
  | 'bloom_taxonomy' | 'kirkpatrick' | 'dreyfus_model' | 'custom' | 'industry_standard';

export interface CompetencyLevel {
  level: number; // 1-5
  title: string;
  description: string;
  indicators: string[];
  assessmentMethods: string[];
}

export interface CompetencyMeasurement {
  rubrics: AssessmentRubric[];
  portfolios: PortfolioEvidence[];
  observations: ObservationData[];
  selfAssessments: SelfAssessment[];
  peerEvaluations: PeerEvaluation[];
}

export interface PortfolioEvidence {
  id: string;
  type: string;
  description: string;
  quality: number;
  relevance: number;
  timestamp: string;
}

export interface ObservationData {
  observer: string;
  situation: string;
  behavior: string;
  impact: string;
  timestamp: string;
}

export interface SelfAssessment {
  competencyId: string;
  selfRating: number;
  confidence: number;
  evidence: string[];
  reflection: string;
  timestamp: string;
}

export interface PeerEvaluation {
  evaluator: string;
  competencyId: string;
  rating: number;
  evidence: string[];
  feedback: string;
  timestamp: string;
}

export interface IndustryAlignment {
  industry: string;
  relevanceScore: number; // 0-100
  jobRoles: string[];
  certificationPath: string;
  marketDemand: number; // 0-100
  futureRelevance: number; // 0-100
}

export interface Assessment {
  id: string;
  moduleId: string;
  type: AssessmentType;
  title: string;
  description: string;
  questions: Question[];
  settings: AssessmentSettings;
  adaptiveSettings: AssessmentAdaptiveSettings;
  aiFeatures: AssessmentAIFeatures;
}

export type AssessmentType = 
  | 'formative' | 'summative' | 'diagnostic' | 'benchmark' | 'adaptive' |
  'performance' | 'portfolio' | 'peer_assessment' | 'self_assessment';

export interface AssessmentSettings {
  timeLimit?: number;
  attempts: number;
  passScore: number;
  randomize: boolean;
  showResults: boolean;
  allowReview: boolean;
  proctored: boolean;
}

export interface AssessmentAdaptiveSettings {
  difficultyAdjustment: boolean;
  contentVariation: boolean;
  timeAdjustment: boolean;
  hintProvision: boolean;
  realTimeFeedback: boolean;
  personalizedCutoffs: boolean;
}

export interface AssessmentAIFeatures {
  intelligentScoring: boolean;
  biasDetection: boolean;
  fairnessAnalysis: boolean;
  predictiveAnalytics: boolean;
  personalizedRecommendations: boolean;
  realTimeAdaptation: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  content: QuestionContent;
  difficulty: number;
  discrimination: number;
  timeEstimate: number;
  aiGenerated: boolean;
  adaptive: boolean;
  accessibility: AccessibilityFeatures;
}

export type QuestionType = 
  | 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code_completion' |
  'drag_drop' | 'hotspot' | 'matching' | 'fill_blank' | 'simulation' | 'portfolio';

export interface QuestionContent {
  prompt: string;
  options?: QuestionOption[];
  correctAnswer: any;
  explanations: string[];
  media?: MediaContent[];
  hints: string[];
  solution: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  media?: MediaContent;
}

export interface AILearningInsights {
  personalizationEffectiveness: number;
  adaptivePathOptimization: number;
  engagementPrediction: number;
  completionForecasting: number;
  learningStyleAdaptation: number;
  collaborationOptimization: number;
  difficultyCalibration: number;
  contentRelevanceScore: number;
}

// ===== MAIN STORE =====

export interface LearningState {
  // Core Learning Data
  learningPaths: LearningPath[];
  modules: Record<string, Module[]>;
  userLearningPaths: UserLearningPath[];
  userModuleProgress: UserModuleProgress[];
  
  // AI Intelligence
  aiPersonalization: AIPersonalizationEngine;
  learningAnalytics: LearningAnalyticsEngine;
  predictiveModels: PredictiveLearningModels;
  adaptiveAlgorithms: AdaptiveLearningAlgorithms;
  
  // User Experience
  currentLearningPath: string | null;
  currentModule: string | null;
  learningSession: LearningSession | null;
  studyPlan: StudyPlan | null;
  
  // Progress & Analytics
  overallProgress: OverallProgress;
  learningStreaks: LearningStreak[];
  achievements: Achievement[];
  leaderboards: LeaderboardEntry[];
  
  // Social Learning
  studyGroups: StudyGroup[];
  peers: LearningPeer[];
  mentors: Mentor[];
  collaborativeActivities: CollaborativeActivity[];
  
  // Content Management
  contentLibrary: ContentItem[];
  recommendations: LearningRecommendation[];
  bookmarks: Bookmark[];
  notes: LearningNote[];
  
  // Gamification
  gamification: GamificationSystem;
  rewards: Reward[];
  challenges: Challenge[];
  badges: Badge[];
  
  // Analytics & Insights
  learningInsights: LearningInsights[];
  performanceMetrics: PerformanceMetrics;
  engagementMetrics: EngagementMetrics;
  predictiveInsights: PredictiveInsights[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  filters: LearningFilters;
  searchQuery: string;
  viewMode: ViewMode;
  
  // Preferences & Settings
  preferences: LearningPreferences;
  accessibility: AccessibilitySettings;
  personalization: PersonalizationSettings;
  
  // Real-time Features
  liveSession: LiveLearningSession | null;
  realTimeCollaborations: RealTimeCollaboration[];
  notifications: LearningNotification[];
  
  // Offline Support
  offlineContent: OfflineContent[];
  syncStatus: SyncStatus;
  cacheManagement: CacheManagement;
  
  // Performance
  lastSync: string;
  cacheExpiry: string;
  performanceMetrics: StatePerformanceMetrics;
}

// ===== SUPPORTING INTERFACES =====

export interface AIPersonalizationEngine {
  learningStyleDetection: LearningStyleDetector;
  contentAdaptation: ContentAdaptationEngine;
  paceOptimization: PaceOptimizationEngine;
  difficultyCalibration: DifficultyCalibrationEngine;
  recommendationEngine: RecommendationEngine;
  engagementOptimization: EngagementOptimizationEngine;
}

export interface LearningStyleDetector {
  currentStyle: LearningStyle;
  confidence: number;
  history: StyleHistory[];
  adaptations: StyleAdaptation[];
  lastUpdate: string;
}

export interface StyleHistory {
  date: string;
  detectedStyle: LearningStyle;
  confidence: number;
  triggers: string[];
}

export interface ContentAdaptationEngine {
  adaptations: ContentAdaptation[];
  effectiveness: number;
  userFeedback: AdaptationFeedback[];
}

export interface AdaptationFeedback {
  adaptationId: string;
  helpful: boolean;
  relevance: number;
  clarity: number;
  timestamp: string;
}

export interface PaceOptimizationEngine {
  optimalPace: string;
  currentPace: string;
  adjustments: PaceAdjustment[];
  recommendations: string[];
  effectiveness: number;
}

export interface DifficultyCalibrationEngine {
  calibratedDifficulty: number;
  userAbilityEstimate: number;
  calibrationHistory: CalibrationPoint[];
  nextAdjustment: DifficultyAdjustment;
}

export interface CalibrationPoint {
  moduleId: string;
  expectedDifficulty: number;
  actualDifficulty: number;
  userPerformance: number;
  timestamp: string;
}

export interface RecommendationEngine {
  recommendations: LearningRecommendation[];
  algorithm: string;
  accuracy: number;
  userAcceptanceRate: number;
}

export interface EngagementOptimizationEngine {
  currentEngagement: number;
  optimalEngagement: number;
  strategies: EngagementStrategy[];
  predictedEngagement: number;
}

export interface EngagementStrategy {
  type: string;
  description: string;
  expectedImpact: number;
  implementation: string;
}

export interface LearningAnalyticsEngine {
  realTimeAnalytics: RealTimeAnalytics;
  historicalAnalytics: HistoricalAnalytics;
  predictiveAnalytics: PredictiveAnalytics;
  comparativeAnalytics: ComparativeAnalytics;
  interventionAnalytics: InterventionAnalytics;
}

export interface RealTimeAnalytics {
  currentSession: SessionAnalytics;
  liveMetrics: LiveMetrics[];
  alerts: AnalyticsAlert[];
  recommendations: RealtimeRecommendation[];
}

export interface SessionAnalytics {
  sessionId: string;
  startTime: string;
  duration: number;
  modules: ModuleSessionAnalytics[];
  engagementLevel: number;
  learningVelocity: number;
  predictedOutcome: number;
}

export interface ModuleSessionAnalytics {
  moduleId: string;
  timeSpent: number;
  interactions: number;
  score?: number;
  difficulty: number;
  engagement: number;
  aiInsights: string[];
}

export interface LiveMetrics {
  metric: string;
  value: number;
  trend: string;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface AnalyticsAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendation: string;
  timestamp: string;
}

export interface RealtimeRecommendation {
  type: string;
  content: any;
  urgency: string;
  reasoning: string;
}

export interface HistoricalAnalytics {
  learningHistory: LearningHistoryRecord[];
  performanceTrends: PerformanceTrend[];
  engagementPatterns: EngagementPattern[];
  completionAnalysis: CompletionAnalysis;
}

export interface LearningHistoryRecord {
  date: string;
  learningPathId: string;
  timeSpent: number;
  modulesCompleted: number;
  averageScore: number;
  engagementLevel: number;
  achievements: string[];
}

export interface PerformanceTrend {
  metric: string;
  period: string;
  trend: 'improving' | 'declining' | 'stable';
  change: number;
  prediction: number;
}

export interface EngagementPattern {
  pattern: string;
  frequency: number;
  impact: number;
  recommendations: string[];
}

export interface CompletionAnalysis {
  completionRate: number;
  averageTimeToComplete: number;
  dropOffPoints: DropOffPoint[];
  successFactors: string[];
  failureFactors: string[];
}

export interface PredictiveAnalytics {
  completionPrediction: CompletionPrediction;
  performancePrediction: PerformancePrediction;
  retentionPrediction: RetentionPrediction;
  engagementPrediction: EngagementPrediction;
  interventionPrediction: InterventionPrediction;
}

export interface CompletionPrediction {
  probability: number;
  estimatedCompletionDate: string;
  confidence: number;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface PerformancePrediction {
  expectedScore: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface RetentionPrediction {
  retentionRate: number;
  dropoutRisk: number;
  criticalPeriods: string[];
  interventionPoints: string[];
}

export interface EngagementPrediction {
  engagementLevel: number;
  optimalSessionLength: number;
  breakRecommendations: string[];
  contentPreferences: string[];
}

export interface InterventionPrediction {
  recommendedInterventions: InterventionSuggestion[];
  timing: string[];
  expectedEffectiveness: number;
}

export interface ComparativeAnalytics {
  peerComparison: PeerComparison;
  cohortComparison: CohortComparison;
  benchmarkComparison: BenchmarkComparison;
}

export interface CohortComparison {
  cohortId: string;
  comparisonMetrics: ComparisonMetrics;
  percentile: number;
  insights: string[];
}

export interface BenchmarkComparison {
  benchmarkType: string;
  performance: number;
  percentile: number;
  gap: number;
  recommendations: string[];
}

export interface InterventionAnalytics {
  effectiveness: InterventionEffectiveness[];
  timing: InterventionTiming[];
  methods: InterventionMethod[];
}

export interface InterventionEffectiveness {
  interventionType: string;
  successRate: number;
  averageEffect: number;
  cost: number;
  roi: number;
}

export interface InterventionTiming {
  optimalTiming: string[];
  criticalWindows: string[];
  delayEffects: number;
}

export interface InterventionMethod {
  method: string;
  effectiveness: number;
  userAcceptance: number;
  resourceRequirements: number;
}

export interface PredictiveLearningModels {
  completionModel: CompletionMLModel;
  performanceModel: PerformanceMLModel;
  engagementModel: EngagementMLModel;
  retentionModel: RetentionMLModel;
  personalizationModel: PersonalizationMLModel;
}

export interface CompletionMLModel {
  accuracy: number;
  features: string[];
  predictions: CompletionPrediction[];
  retrainingSchedule: string;
}

export interface PerformanceMLModel {
  modelVersion: string;
  accuracy: number;
  predictions: PerformancePrediction[];
  featureImportance: FeatureImportance[];
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  type: string;
}

export interface EngagementMLModel {
  modelType: string;
  accuracy: number;
  predictions: EngagementPrediction[];
  realTimeUpdates: boolean;
}

export interface RetentionMLModel {
  modelAccuracy: number;
  retentionPredictions: RetentionPrediction[];
  interventionRecommendations: string[];
}

export interface PersonalizationMLModel {
  learningStyleModel: LearningStyleModel;
  contentPreferenceModel: ContentPreferenceModel;
  pacePreferenceModel: PacePreferenceModel;
}

export interface LearningStyleModel {
  currentStyle: LearningStyle;
  confidence: number;
  accuracy: number;
  adaptationHistory: StyleAdaptation[];
}

export interface ContentPreferenceModel {
  preferences: ContentPreference[];
  accuracy: number;
  adaptationRate: number;
}

export interface ContentPreference {
  contentType: string;
  preference: number;
  evidence: string[];
}

export interface PacePreferenceModel {
  preferredPace: string;
  optimalSessionLength: number;
  breakPreferences: BreakPreference[];
  accuracy: number;
}

export interface BreakPreference {
  frequency: number;
  duration: number;
  activities: string[];
}

export interface AdaptiveLearningAlgorithms {
  difficultyAdjustment: DifficultyAdjustmentAlgorithm;
  contentSequencing: ContentSequencingAlgorithm;
  pacingOptimization: PacingOptimizationAlgorithm;
  interventionTiming: InterventionTimingAlgorithm;
  collaborationMatching: CollaborationMatchingAlgorithm;
}

export interface DifficultyAdjustmentAlgorithm {
  currentDifficulty: number;
  targetDifficulty: number;
  adjustmentSpeed: number;
  successRate: number;
  nextAdjustment: DifficultyAdjustment;
}

export interface DifficultyAdjustment {
  moduleId: string;
  newDifficulty: number;
  reasoning: string;
  confidence: number;
  expectedImpact: number;
}

export interface ContentSequencingAlgorithm {
  optimalSequence: string[];
  alternativeSequences: string[][];
  skipRecommendations: string[];
  reviewRecommendations: string[];
  rationale: string;
}

export interface PacingOptimizationAlgorithm {
  currentPace: string;
  optimalPace: string;
  adjustments: PaceAdjustment[];
  effectiveness: number;
  recommendations: string[];
}

export interface InterventionTimingAlgorithm {
  criticalMoments: string[];
  interventionWindow: InterventionWindow[];
  recommendedTiming: string[];
  effectiveness: number;
}

export interface InterventionWindow {
  startTime: string;
  endTime: string;
  probability: number;
  interventionType: string;
}

export interface CollaborationMatchingAlgorithm {
  compatiblePeers: LearningPeer[];
  optimalGroups: StudyGroup[];
  mentorMatches: Mentor[];
  collaborationOpportunities: CollaborationOpportunity[];
}

export interface CollaborationOpportunity {
  type: string;
  participants: string[];
  timing: string;
  topic: string;
  aiFacilitated: boolean;
}

// ===== CONTINUE WITH MORE INTERFACES =====

export interface LearningSession {
  id: string;
  userId: string;
  learningPathId: string;
  startTime: string;
  plannedDuration: number;
  actualDuration?: number;
  modules: string[];
  currentModule?: string;
  progress: number;
  achievements: string[];
  breaks: BreakRecord[];
  aiInsights: SessionAIInsights;
}

export interface BreakRecord {
  startTime: string;
  endTime: string;
  duration: number;
  activity: string;
  reason: string;
}

export interface SessionAIInsights {
  attentionLevel: number;
  engagementScore: number;
  learningVelocity: number;
  predictedOutcome: number;
  recommendations: string[];
  interventions: InterventionSuggestion[];
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  learningPaths: string[];
  schedule: StudySchedule;
  goals: StudyGoal[];
  milestones: StudyMilestone[];
  aiOptimizations: AIStudyOptimizations;
  progress: StudyPlanProgress;
}

export interface StudySchedule {
  frequency: string;
  duration: number;
  preferredTimes: string[];
  flexibility: number;
  constraints: string[];
  aiOptimized: boolean;
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  aiTracked: boolean;
}

export interface StudyMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  criteria: string[];
  reward: string;
  aiPersonalized: boolean;
}

export interface AIStudyOptimizations {
  scheduleOptimization: ScheduleOptimization;
  contentPacing: ContentPacingOptimization;
  breakScheduling: BreakSchedulingOptimization;
  motivationTiming: MotivationTimingOptimization;
}

export interface ScheduleOptimization {
  optimalTimes: string[];
  sessionLength: number;
  breakFrequency: number;
  reasoning: string;
  effectiveness: number;
}

export interface ContentPacingOptimization {
  modulesPerSession: number;
  difficultyProgression: string;
  reviewScheduling: string;
  aiAdjustments: string[];
}

export interface BreakSchedulingOptimization {
  breakFrequency: number;
  breakDuration: number;
  breakActivities: string[];
  motivationTriggers: string[];
}

export interface MotivationTimingOptimization {
  motivationMessages: MotivationMessage[];
  achievementCelebrations: AchievementCelebration[];
  encouragementTriggers: string[];
  timing: string[];
}

export interface MotivationMessage {
  trigger: string;
  message: string;
  timing: string;
  effectiveness: number;
}

export interface AchievementCelebration {
  achievement: string;
  celebrationType: string;
  timing: string;
  social: boolean;
}

export interface StudyPlanProgress {
  overallProgress: number;
  completedGoals: string[];
  upcomingMilestones: StudyMilestone[];
  timeSpent: number;
  adherenceRate: number;
  aiScore: number;
}

// ===== STORE IMPLEMENTATION =====

export const useLearningStore = create<LearningState>()(
  subscribeWithSelector(
    devtools(
      immer(
        (set, get) => ({
          // ===== INITIAL STATE =====
          
          // Core Learning Data
          learningPaths: [],
          modules: {},
          userLearningPaths: [],
          userModuleProgress: [],
          
          // AI Intelligence
          aiPersonalization: {
            learningStyleDetection: {
              currentStyle: 'multimodal',
              confidence: 0,
              history: [],
              adaptations: [],
              lastUpdate: new Date().toISOString()
            },
            contentAdaptation: {
              adaptations: [],
              effectiveness: 0,
              userFeedback: []
            },
            paceOptimization: {
              optimalPace: 'normal',
              currentPace: 'normal',
              adjustments: [],
              recommendations: [],
              effectiveness: 0
            },
            difficultyCalibration: {
              calibratedDifficulty: 2.5,
              userAbilityEstimate: 2.5,
              calibrationHistory: [],
              nextAdjustment: {
                moduleId: '',
                newDifficulty: 2.5,
                reasoning: 'Initial calibration',
                confidence: 0.5,
                expectedImpact: 0
              }
            },
            recommendationEngine: {
              recommendations: [],
              algorithm: 'collaborative_filtering',
              accuracy: 0.75,
              userAcceptanceRate: 0.68
            },
            engagementOptimization: {
              currentEngagement: 50,
              optimalEngagement: 75,
              strategies: [],
              predictedEngagement: 50
            }
          },
          
          learningAnalytics: {
            realTimeAnalytics: {
              currentSession: {
                sessionId: '',
                startTime: new Date().toISOString(),
                duration: 0,
                modules: [],
                engagementLevel: 0,
                learningVelocity: 0,
                predictedOutcome: 0
              },
              liveMetrics: [],
              alerts: [],
              recommendations: []
            },
            historicalAnalytics: {
              learningHistory: [],
              performanceTrends: [],
              engagementPatterns: [],
              completionAnalysis: {
                completionRate: 0,
                averageTimeToComplete: 0,
                dropOffPoints: [],
                successFactors: [],
                failureFactors: []
              }
            },
            predictiveAnalytics: {
              completionPrediction: {
                probability: 0,
                estimatedCompletionDate: '',
                confidence: 0,
                factors: []
              },
              performancePrediction: {
                expectedScore: 0,
                confidence: 0,
                strengths: [],
                weaknesses: [],
                recommendations: []
              },
              retentionPrediction: {
                retentionRate: 0,
                dropoutRisk: 0,
                criticalPeriods: [],
                interventionPoints: []
              },
              engagementPrediction: {
                engagementLevel: 0,
                optimalSessionLength: 0,
                breakRecommendations: [],
                contentPreferences: []
              },
              interventionPrediction: {
                recommendedInterventions: [],
                timing: [],
                expectedEffectiveness: 0
              }
            },
            comparativeAnalytics: {
              peerComparison: {
                peerId: '',
                peerName: '',
                comparisonMetrics: {
                  progressRate: 0,
                  scoreComparison: 0,
                  timeEfficiency: 0,
                  engagementLevel: 0,
                  collaborationScore: 0
                },
                relativePerformance: '',
                insights: []
              },
              cohortComparison: {
                cohortId: '',
                comparisonMetrics: {
                  progressRate: 0,
                  scoreComparison: 0,
                  timeEfficiency: 0,
                  engagementLevel: 0,
                  collaborationScore: 0
                },
                percentile: 0,
                insights: []
              },
              benchmarkComparison: {
                benchmarkType: '',
                performance: 0,
                percentile: 0,
                gap: 0,
                recommendations: []
              }
            },
            interventionAnalytics: {
              effectiveness: [],
              timing: [],
              methods: []
            }
          },
          
          predictiveModels: {
            completionModel: {
              accuracy: 0.85,
              features: [],
              predictions: [],
              retrainingSchedule: ''
            },
            performanceModel: {
              modelVersion: '1.0',
              accuracy: 0.82,
              predictions: [],
              featureImportance: []
            },
            engagementModel: {
              modelType: 'neural_network',
              accuracy: 0.79,
              predictions: [],
              realTimeUpdates: true
            },
            retentionModel: {
              modelAccuracy: 0.88,
              retentionPredictions: [],
              interventionRecommendations: []
            },
            personalizationModel: {
              learningStyleModel: {
                currentStyle: 'multimodal',
                confidence: 0,
                accuracy: 0,
                adaptationHistory: []
              },
              contentPreferenceModel: {
                preferences: [],
                accuracy: 0,
                adaptationRate: 0
              },
              pacePreferenceModel: {
                preferredPace: 'normal',
                optimalSessionLength: 0,
                breakPreferences: [],
                accuracy: 0
              }
            }
          },
          
          adaptiveAlgorithms: {
            difficultyAdjustment: {
              currentDifficulty: 2.5,
              targetDifficulty: 2.5,
              adjustmentSpeed: 0.1,
              successRate: 0.75,
              nextAdjustment: {
                moduleId: '',
                newDifficulty: 2.5,
                reasoning: 'Initial state',
                confidence: 0.5,
                expectedImpact: 0
              }
            },
            contentSequencing: {
              optimalSequence: [],
              alternativeSequences: [],
              skipRecommendations: [],
              reviewRecommendations: [],
              rationale: 'Default sequencing'
            },
            pacingOptimization: {
              currentPace: 'normal',
              optimalPace: 'normal',
              adjustments: [],
              effectiveness: 0,
              recommendations: []
            },
            interventionTiming: {
              criticalMoments: [],
              interventionWindow: [],
              recommendedTiming: [],
              effectiveness: 0
            },
            collaborationMatching: {
              compatiblePeers: [],
              optimalGroups: [],
              mentorMatches: [],
              collaborationOpportunities: []
            }
          },
          
          // User Experience
          currentLearningPath: null,
          currentModule: null,
          learningSession: null,
          studyPlan: null,
          
          // Progress & Analytics
          overallProgress: {
            totalTimeSpent: 0,
            modulesCompleted: 0,
            learningPathsCompleted: 0,
            averageScore: 0,
            streakDays: 0,
            achievements: 0,
            skills: 0,
            competencies: 0
          },
          learningStreaks: [],
          achievements: [],
          leaderboards: [],
          
          // Social Learning
          studyGroups: [],
          peers: [],
          mentors: [],
          collaborativeActivities: [],
          
          // Content Management
          contentLibrary: [],
          recommendations: [],
          bookmarks: [],
          notes: [],
          
          // Gamification
          gamification: {
            enabled: true,
            pointSystem: {
              basePoints: 10,
              bonusMultipliers: [1.5, 2.0, 3.0],
              streakBonuses: true,
              collaborationBonuses: true
            },
            levelSystem: {
              maxLevel: 100,
              pointsPerLevel: 100,
              levelRewards: []
            },
            badgeSystem: {
              categories: ['progress', 'collaboration', 'innovation', 'persistence'],
              rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
              criteria: []
            }
          },
          rewards: [],
          challenges: [],
          badges: [],
          
          // Analytics & Insights
          learningInsights: [],
          performanceMetrics: {
            engagementScore: 0,
            retentionRate: 0,
            completionRate: 0,
            satisfactionScore: 0,
            learningVelocity: 0,
            collaborationScore: 0,
            innovationScore: 0,
            persistenceScore: 0
          },
          engagementMetrics: {
            dailyActiveUsers: 0,
            sessionDuration: 0,
            contentInteractionRate: 0,
            practiceCompletionRate: 0,
            discussionParticipationRate: 0
          },
          predictiveInsights: [],
          
          // UI State
          isLoading: false,
          error: null,
          filters: {
            difficulty: [],
            tags: [],
            duration: '',
            type: [],
            status: [],
            source: []
          },
          searchQuery: '',
          viewMode: 'grid',
          
          // Preferences & Settings
          preferences: {
            learningStyle: 'multimodal',
            pace: 'normal',
            notifications: {
              achievements: true,
              reminders: true,
              social: true,
              updates: true
            },
            privacy: {
              profileVisible: true,
              progressVisible: true,
              socialFeatures: true,
              dataSharing: true
            },
            accessibility: {
              fontSize: 'medium',
              highContrast: false,
              screenReader: false,
              keyboardNavigation: true
            },
            aiPersonalization: {
              enabled: true,
              level: 'moderate',
              areas: ['difficulty', 'pace', 'content', 'collaboration']
            }
          },
          accessibility: {
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false,
            screenReader: boolean,
            keyboardNavigation: boolean,
            colorBlindFriendly: boolean
          },
          personalization: {
            adaptiveDifficulty: true,
            personalizedContent: true,
            aiRecommendations: true,
            smartReminders: true,
            collaborativeFeatures: true
          },
          
          // Real-time Features
          liveSession: null,
          realTimeCollaborations: [],
          notifications: [],
          
          // Offline Support
          offlineContent: [],
          syncStatus: {
            isOnline: true,
            lastSync: new Date().toISOString(),
            pendingChanges: [],
            conflictCount: 0
          },
          cacheManagement: {
            cacheSize: 0,
            maxCacheSize: 100 * 1024 * 1024, // 100MB
            cacheStrategy: 'lru',
            autoCleanup: true
          },
          
          // Performance
          lastSync: new Date().toISOString(),
          cacheExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          performanceMetrics: {
            stateUpdateTime: 0,
            memoryUsage: 0,
            renderTime: 0,
            actionDispatchTime: 0
          },

          // ===== CORE LEARNING ACTIONS =====
          
          // Learning Path Management
          loadLearningPaths: async () => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/learning/paths');
              const paths = await response.json();
              
              set(state => {
                state.learningPaths = paths;
                state.lastSync = new Date().toISOString();
              });
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
            } finally {
              set(state => { state.isLoading = false; });
            }
          },
          
          createLearningPath: async (pathData: Omit<LearningPath, 'id' | 'analytics' | 'aiInsights'>) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/learning/paths', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pathData)
              });
              
              const newPath = await response.json();
              
              set(state => {
                state.learningPaths.push(newPath);
              });
              
              return newPath;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },
          
          updateLearningPath: async (pathId: string, updates: Partial<LearningPath>) => {
            try {
              const response = await fetch(`/api/learning/paths/${pathId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
              });
              
              const updatedPath = await response.json();
              
              set(state => {
                const index = state.learningPaths.findIndex(p => p.id === pathId);
                if (index >= 0) {
                  state.learningPaths[index] = updatedPath;
                }
              });
              
              return updatedPath;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // Module Management
          loadModules: async (pathId: string) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch(`/api/learning/paths/${pathId}/modules`);
              const modules = await response.json();
              
              set(state => {
                state.modules[pathId] = modules;
              });
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
            } finally {
              set(state => { state.isLoading = false; });
            }
          },
          
          createModule: async (moduleData: Omit<Module, 'id'>) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/learning/modules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moduleData)
              });
              
              const newModule = await response.json();
              
              set(state => {
                if (!state.modules[newModule.learningPathId]) {
                  state.modules[newModule.learningPathId] = [];
                }
                state.modules[newModule.learningPathId].push(newModule);
              });
              
              return newModule;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },
          
          // ===== AI-POWERED PERSONALIZATION ACTIONS =====
          
          // Learning Style Detection
          detectLearningStyle: async () => {
            try {
              const response = await fetch('/api/learning/ai/detect-style', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: get().currentUserId,
                  learningHistory: get().userLearningPaths
                })
              });
              
              const detection = await response.json();
              
              set(state => {
                state.aiPersonalization.learningStyleDetection = {
                  currentStyle: detection.style,
                  confidence: detection.confidence,
                  history: [...state.aiPersonalization.learningStyleDetection.history, {
                    date: new Date().toISOString(),
                    detectedStyle: detection.style,
                    confidence: detection.confidence,
                    triggers: detection.triggers
                  }],
                  adaptations: detection.adaptations,
                  lastUpdate: new Date().toISOString()
                };
              });
              
              return detection;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // Adaptive Content Delivery
          adaptContent: async (moduleId: string, userContext: any) => {
            try {
              const response = await fetch(`/api/learning/ai/adapt-content/${moduleId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userContext,
                  learningStyle: get().aiPersonalization.learningStyleDetection.currentStyle,
                  currentProgress: get().userModuleProgress.find(p => p.moduleId === moduleId)
                })
              });
              
              const adaptation = await response.json();
              
              set(state => {
                state.aiPersonalization.contentAdaptation.adaptations = [
                  ...state.aiPersonalization.contentAdaptation.adaptations,
                  adaptation
                ];
              });
              
              return adaptation;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // Pace Optimization
          optimizePace: async () => {
            try {
              const response = await fetch('/api/learning/ai/optimize-pace', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: get().currentUserId,
                  recentSessions: get().userLearningPaths.map(path => path.analytics?.performanceHistory || [])
                })
              });
              
              const optimization = await response.json();
              
              set(state => {
                state.aiPersonalization.paceOptimization = {
                  optimalPace: optimization.optimalPace,
                  currentPace: optimization.currentPace,
                  adjustments: optimization.adjustments,
                  recommendations: optimization.recommendations,
                  effectiveness: optimization.effectiveness
                };
              });
              
              return optimization;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // Difficulty Calibration
          calibrateDifficulty: async (moduleId: string, userPerformance: any) => {
            try {
              const response = await fetch('/api/learning/ai/calibrate-difficulty', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  moduleId,
                  userPerformance,
                  history: get().adaptiveAlgorithms.difficultyAdjustment.calibrationHistory
                })
              });
              
              const calibration = await response.json();
              
              set(state => {
                state.aiPersonalization.difficultyCalibration = {
                  calibratedDifficulty: calibration.difficulty,
                  userAbilityEstimate: calibration.ability,
                  calibrationHistory: [
                    ...state.aiPersonalization.difficultyCalibration.calibrationHistory,
                    {
                      moduleId,
                      expectedDifficulty: calibration.expected,
                      actualDifficulty: calibration.actual,
                      userPerformance: userPerformance.score,
                      timestamp: new Date().toISOString()
                    }
                  ],
                  nextAdjustment: calibration.nextAdjustment
                };
              });
              
              return calibration;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // ===== USER PROGRESS ACTIONS =====
          
          // Enroll in Learning Path
          enrollInLearningPath: async (pathId: string) => {
            set(state => { state.isLoading = true; state.error = null; });
            
            try {
              const response = await fetch('/api/learning/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pathId })
              });
              
              const enrollment = await response.json();
              
              set(state => {
                state.userLearningPaths.push({
                  id: enrollment.id,
                  userId: enrollment.userId,
                  learningPathId: pathId,
                  status: 'enrolled',
                  progress: {
                    overallProgress: 0,
                    currentModuleIndex: 0,
                    completedModules: [],
                    timeSpent: 0,
                    averageScore: 0,
                    streakDays: 0,
                    lastActivity: new Date().toISOString(),
                    estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    adaptiveMilestones: []
                  },
                  enrollment: {
                    enrolledAt: new Date().toISOString(),
                    source: 'search',
                    motivation: [],
                    goals: [],
                    timeline: 'flexible',
                    commitmentLevel: 'casual'
                  },
                  aiProfile: {
                    learningStyle: 'multimodal',
                    preferredPace: 'normal',
                    strengthAreas: [],
                    challengeAreas: [],
                    motivationFactors: [],
                    collaborationPreference: 'moderate',
                    contentPreferences: {
                      formatPreferences: [],
                      mediaPreferences: [],
                      interactionPreferences: [],
                      difficultyPreferences: 'adaptive',
                      timePreferences: [],
                      breakPreferences: {
                        frequency: 'moderate',
                        duration: 'short',
                        activities: ['break'],
                        reminders: true
                      }
                    },
                    aiAdaptationLevel: 0.5,
                    lastProfileUpdate: new Date().toISOString()
                  },
                  collaboration: {
                    peers: [],
                    studyGroups: [],
                    mentors: [],
                    collaborativeActivities: [],
                    socialFeatures: {
                      leaderboards: [],
                      achievements: [],
                      socialFeed: [],
                      peerComparisons: [],
                      sharingPreferences: {
                        progress: true,
                        achievements: true,
                        insights: false,
                        comparisons: false,
                        groups: true
                      }
                    }
                  },
                  analytics: {
                    totalTimeSpent: 0,
                    averageSessionDuration: 0,
                    learningVelocity: 0,
                    retentionRate: 0,
                    engagementTrend: [],
                    performanceHistory: [],
                    predictions: {
                      completionProbability: 0.5,
                      timeToCompletion: 30,
                      expectedScore: 75,
                      retentionRate: 0.8,
                      dropoutRisk: 0.2,
                      nextOptimalAction: 'start_first_module',
                      recommendedInterventions: []
                    },
                    insights: []
                  }
                });
              });
              
              return enrollment;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },
          
          // Start Learning Session
          startLearningSession: async (pathId: string) => {
            const sessionId = crypto.randomUUID();
            const session: LearningSession = {
              id: sessionId,
              userId: get().currentUserId,
              learningPathId: pathId,
              startTime: new Date().toISOString(),
              plannedDuration: 60, // 60 minutes default
              modules: [],
              progress: 0,
              achievements: [],
              breaks: [],
              aiInsights: {
                attentionLevel: 50,
                engagementScore: 50,
                learningVelocity: 50,
                predictedOutcome: 50,
                recommendations: [],
                interventions: []
              }
            };
            
            set(state => {
              state.learningSession = session;
            });
            
            return session;
          },
          
          // Complete Module
          completeModule: async (moduleId: string, completionData: any) => {
            try {
              const response = await fetch(`/api/learning/complete-module/${moduleId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completionData)
              });
              
              const result = await response.json();
              
              // Update user module progress
              set(state => {
                const existingProgress = state.userModuleProgress.find(p => p.moduleId === moduleId);
                if (existingProgress) {
                  existingProgress.status = 'completed';
                  existingProgress.progress.completionPercentage = 100;
                  existingProgress.progress.timeSpent = completionData.timeSpent;
                  existingProgress.learning.understanding = completionData.understanding || 80;
                  existingProgress.learning.retention = completionData.retention || 75;
                  existingProgress.learning.application = completionData.application || 70;
                  existingProgress.learning.confidence = completionData.confidence || 85;
                } else {
                  state.userModuleProgress.push({
                    id: crypto.randomUUID(),
                    userId: get().currentUserId,
                    moduleId,
                    learningPathId: completionData.pathId,
                    status: 'completed',
                    progress: {
                      completionPercentage: 100,
                      timeSpent: completionData.timeSpent,
                      attempts: 1,
                      scores: [{
                        score: completionData.score || 80,
                        timestamp: new Date().toISOString(),
                        timeSpent: completionData.timeSpent,
                        difficulty: completionData.difficulty || 2,
                        confidence: completionData.confidence || 80
                      }],
                      currentAttempt: 1,
                      masteryLevel: completionData.masteryLevel || 80,
                      prerequisitesMet: true,
                      nextRecommendedAction: 'continue_to_next_module'
                    },
                    learning: {
                      understanding: completionData.understanding || 80,
                      retention: completionData.retention || 75,
                      application: completionData.application || 70,
                      confidence: completionData.confidence || 85,
                      motivation: 80,
                      flowState: 75,
                      cognitiveLoad: 20,
                      learningVelocity: 70
                    },
                    engagement: {
                      attentionLevel: 80,
                      interactionFrequency: 75,
                      contentClarity: 85,
                      difficultyAppropriate: 80,
                      interestLevel: 85,
                      challengeLevel: 70,
                      frustrationLevel: 15,
                      breakFrequency: 2,
                      sessionQuality: 80
                    },
                    aiAnalysis: {
                      personalizedPath: {
                        optimalSequence: [],
                        skipRecommendations: [],
                        reviewRecommendations: [],
                        accelerationOpportunities: [],
                        difficultyAdjustments: [],
                        reasoning: 'Module completed successfully'
                      },
                      difficultyRecommendation: {
                        currentLevel: completionData.difficulty || 2,
                        recommendedLevel: completionData.difficulty || 2,
                        reasoning: 'Appropriate difficulty maintained',
                        confidence: 0.8,
                        adaptationFactors: []
                      },
                      contentAdaptation: {
                        recommendedVariations: [],
                        formatAdjustments: [],
                        pacingRecommendations: {
                          recommendedPace: 'normal',
                          reasoning: 'Current pace is optimal',
                          basedOnData: {},
                          adjustments: []
                        },
                        interactionEnhancements: []
                      },
                      interventionSuggestions: [],
                      successPrediction: {
                        completionProbability: 0.9,
                        expectedScore: 85,
                        timeToCompletion: 30,
                        difficultyOfCompletion: 0.3,
                        factors: [],
                        confidence: 0.8
                      },
                      learningPattern: {
                        learningStyle: 'multimodal',
                        optimalTimes: [],
                        sessionPreferences: {
                          idealDuration: 60,
                          breakFrequency: 3,
                          contentDensity: 'moderate',
                          interactionLevel: 'moderate',
                          difficultyProgression: 'gradual'
                        },
                        challengeResponse: {
                          initialReaction: 'positive',
                          recoveryTime: 5,
                          helpSeekingBehavior: 'moderate',
                          persistenceLevel: 75,
                          adaptationSpeed: 70
                        },
                        collaborationPreference: 'moderate',
                        retentionStrategy: {
                          optimalReviewTiming: [],
                          reviewMethods: [],
                          spacedRepetition: {
                            initialInterval: 1,
                            repetitionFactor: 2,
                            maxInterval: 30,
                            difficultyAdjustment: true,
                            retentionTarget: 80
                          },
                          reinforcementTechniques: []
                        }
                      }
                    },
                    collaboration: {
                      peerDiscussions: [],
                      groupActivities: [],
                      mentorSupport: [],
                      collaborativeFeatures: {
                        peerReview: false,
                        groupProblem: false,
                        discussionForum: false,
                        sharedResources: false,
                        virtualStudyRoom: false,
                        aiFacilitated: false
                      }
                    }
                  });
                }
              });
              
              // Trigger AI analysis for next recommendations
              await get().generateLearningRecommendations();
              
              return result;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // ===== COLLABORATIVE LEARNING ACTIONS =====
          
          // Find Study Partners
          findStudyPartners: async (pathId: string) => {
            try {
              const response = await fetch(`/api/learning/study-partners/${pathId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: get().currentUserId,
                  preferences: get().preferences
                })
              });
              
              const partners = await response.json();
              
              set(state => {
                state.peers = partners;
              });
              
              return partners;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // Join Study Group
          joinStudyGroup: async (groupId: string) => {
            try {
              const response = await fetch('/api/learning/join-group', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupId })
              });
              
              const groupData = await response.json();
              
              set(state => {
                const existingGroup = state.studyGroups.find(g => g.id === groupId);
                if (existingGroup) {
                  existingGroup.members.push(get().currentUserId);
                } else {
                  state.studyGroups.push(groupData);
                }
              });
              
              return groupData;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // Request Mentor Support
          requestMentorSupport: async (topic: string) => {
            try {
              const response = await fetch('/api/learning/mentor-support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: get().currentUserId,
                  topic,
                  currentPath: get().currentLearningPath
                })
              });
              
              const mentor = await response.json();
              
              set(state => {
                state.mentors.push(mentor);
              });
              
              return mentor;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // ===== ANALYTICS & INSIGHTS ACTIONS =====
          
          // Generate Learning Recommendations
          generateLearningRecommendations: async () => {
            try {
              const response = await fetch('/api/learning/ai/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: get().currentUserId,
                  learningPaths: get().userLearningPaths,
                  moduleProgress: get().userModuleProgress,
                  aiProfile: get().aiPersonalization.learningStyleDetection
                })
              });
              
              const recommendations = await response.json();
              
              set(state => {
                state.recommendations = recommendations;
              });
              
              return recommendations;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // Analyze Learning Patterns
          analyzeLearningPatterns: async () => {
            try {
              const response = await fetch('/api/learning/ai/pattern-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: get().currentUserId,
                  learningHistory: get().userLearningPaths,
                  sessionData: get().userLearningPaths.map(path => path.analytics?.performanceHistory || [])
                })
              });
              
              const analysis = await response.json();
              
              set(state => {
                state.learningInsights = analysis.insights;
                state.performanceMetrics = {
                  ...state.performanceMetrics,
                  ...analysis.metrics
                };
              });
              
              return analysis;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // Predict Learning Outcomes
          predictLearningOutcomes: async (pathId: string) => {
            try {
              const response = await fetch(`/api/learning/ai/predict-outcomes/${pathId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: get().currentUserId,
                  progress: get().userLearningPaths.find(p => p.learningPathId === pathId),
                  aiProfile: get().aiPersonalization.learningStyleDetection
                })
              });
              
              const prediction = await response.json();
              
              set(state => {
                const path = state.userLearningPaths.find(p => p.learningPathId === pathId);
                if (path) {
                  path.analytics.predictions = prediction;
                }
              });
              
              return prediction;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // ===== GAMIFICATION ACTIONS =====
          
          // Track Achievement
          trackAchievement: async (achievementType: AchievementType, details: any) => {
            try {
              const response = await fetch('/api/learning/achievements/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: get().currentUserId,
                  type: achievementType,
                  details
                })
              });
              
              const achievement = await response.json();
              
              set(state => {
                state.achievements.push(achievement);
                state.overallProgress.achievements += 1;
              });
              
              return achievement;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            }
          },
          
          // Update Learning Streak
          updateLearningStreak: async () => {
            const today = new Date().toISOString().split('T')[0];
            
            set(state => {
              const existingStreak = state.learningStreaks.find(s => s.date === today);
              if (!existingStreak) {
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const lastStreak = state.learningStreaks.find(s => s.date === yesterday);
                const newStreak = {
                  id: crypto.randomUUID(),
                  date: today,
                  activity: 'learning',
                  duration: 0,
                  modulesCompleted: 0,
                  achievements: [],
                  consecutive: lastStreak ? lastStreak.consecutive + 1 : 1
                };
                state.learningStreaks.push(newStreak);
                state.overallProgress.streakDays = newStreak.consecutive;
              }
            });
          },
          
          // ===== UI & UTILITY ACTIONS =====
          
          // Set Current Learning Path
          setCurrentLearningPath: (pathId: string | null) => {
            set(state => {
              state.currentLearningPath = pathId;
            });
          },
          
          // Set Current Module
          setCurrentModule: (moduleId: string | null) => {
            set(state => {
              state.currentModule = moduleId;
            });
          },
          
          // Update Filters
          updateFilters: (filters: Partial<LearningFilters>) => {
            set(state => {
              Object.assign(state.filters, filters);
            });
          },
          
          // Search Learning Content
          searchContent: async (query: string) => {
            set(state => {
              state.searchQuery = query;
              state.isLoading = true;
            });
            
            try {
              const response = await fetch(`/api/learning/search?q=${encodeURIComponent(query)}`, {
                headers: {
                  'Authorization': `Bearer ${get().authToken}`
                }
              });
              
              const results = await response.json();
              
              set(state => {
                state.contentLibrary = results;
              });
              
              return results;
              
            } catch (error: any) {
              set(state => { state.error = error.message; });
              throw error;
            } finally {
              set(state => { state.isLoading = false; });
            }
          },
          
          // Clear Error
          clearError: () => {
            set(state => { state.error = null; });
          },
          
          // Sync with Server
          syncWithServer: async () => {
            try {
              const response = await fetch('/api/learning/sync', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${get().authToken}`
                },
                body: JSON.stringify({
                  userId: get().currentUserId,
                  lastSync: get().lastSync,
                  localChanges: get().getLocalChanges()
                })
              });
              
              const syncData = await response.json();
              
              set(state => {
                state.userLearningPaths = syncData.learningPaths || state.userLearningPaths;
                state.userModuleProgress = syncData.moduleProgress || state.userModuleProgress;
                state.achievements = syncData.achievements || state.achievements;
                state.lastSync = new Date().toISOString();
                state.syncStatus.lastSync = new Date().toISOString();
                state.syncStatus.pendingChanges = [];
              });
              
              return syncData;
              
            } catch (error) {
              set(state => {
                state.syncStatus.isOnline = false;
              });
              throw error;
            }
          }
        }),
        {
          name: 'learning-store',
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            userLearningPaths: state.userLearningPaths,
            userModuleProgress: state.userModuleProgress,
            achievements: state.achievements,
            learningStreaks: state.learningStreaks,
            preferences: state.preferences,
            bookmarks: state.bookmarks,
            notes: state.notes,
            gamification: state.gamification,
            offlineContent: state.offlineContent
          })
        }
      )
    )
  )
);

// ===== SUPPORTING TYPES FOR THE STORE =====

export interface LearningFilters {
  difficulty: string[];
  tags: string[];
  duration: string;
  type: string[];
  status: string[];
  source: string[];
}

export type ViewMode = 'grid' | 'list' | 'timeline' | 'map';

export interface LearningPreferences {
  learningStyle: LearningStyle;
  pace: string;
  notifications: {
    achievements: boolean;
    reminders: boolean;
    social: boolean;
    updates: boolean;
  };
  privacy: {
    profileVisible: boolean;
    progressVisible: boolean;
    socialFeatures: boolean;
    dataSharing: boolean;
  };
  accessibility: {
    fontSize: string;
    highContrast: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
  };
  aiPersonalization: {
    enabled: boolean;
    level: string;
    areas: string[];
  };
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra_large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindFriendly: boolean;
}

export interface PersonalizationSettings {
  adaptiveDifficulty: boolean;
  personalizedContent: boolean;
  aiRecommendations: boolean;
  smartReminders: boolean;
  collaborativeFeatures: boolean;
}

export interface LiveLearningSession {
  sessionId: string;
  participants: string[];
  currentModule?: string;
  startTime: string;
  status: 'active' | 'paused' | 'completed';
  features: SessionFeatures;
}

export interface SessionFeatures {
  screenSharing: boolean;
  voiceChat: boolean;
  whiteboard: boolean;
  fileSharing: boolean;
  aiAssistance: boolean;
}

export interface RealTimeCollaboration {
  id: string;
  type: string;
  participants: string[];
  data: any;
  timestamp: string;
  aiManaged: boolean;
}

export interface LearningNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface OfflineContent {
  id: string;
  type: string;
  url: string;
  downloadedAt: string;
  expiresAt: string;
  size: number;
  downloadProgress: number;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string;
  pendingChanges: any[];
  conflictCount: number;
}

export interface CacheManagement {
  cacheSize: number;
  maxCacheSize: number;
  cacheStrategy: 'lru' | 'lfu' | 'fifo';
  autoCleanup: boolean;
}

export interface StatePerformanceMetrics {
  stateUpdateTime: number;
  memoryUsage: number;
  renderTime: number;
  actionDispatchTime: number;
}

export interface OverallProgress {
  totalTimeSpent: number;
  modulesCompleted: number;
  learningPathsCompleted: number;
  averageScore: number;
  streakDays: number;
  achievements: number;
  skills: number;
  competencies: number;
}

export interface LearningStreak {
  id: string;
  date: string;
  activity: string;
  duration: number;
  modulesCompleted: number;
  achievements: string[];
  consecutive: number;
}

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  earnedAt: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  iconUrl: string;
  socialShare: boolean;
}

export interface ContentItem {
  id: string;
  type: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  difficulty: string;
  tags: string[];
  aiGenerated: boolean;
  lastUpdated: string;
}

export interface LearningRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  generatedAt: string;
  actionUrl: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Bookmark {
  id: string;
  userId: string;
  type: string;
  itemId: string;
  title: string;
  url: string;
  notes: string;
  createdAt: string;
  tags: string[];
}

export interface LearningNote {
  id: string;
  userId: string;
  moduleId: string;
  content: string;
  type: 'highlight' | 'note' | 'question' | 'reflection';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  shared: boolean;
}

export interface GamificationSystem {
  enabled: boolean;
  pointSystem: {
    basePoints: number;
    bonusMultipliers: number[];
    streakBonuses: boolean;
    collaborationBonuses: boolean;
  };
  levelSystem: {
    maxLevel: number;
    pointsPerLevel: number;
    levelRewards: string[];
  };
  badgeSystem: {
    categories: string[];
    rarity: string[];
    criteria: string[];
  };
}

export interface Reward {
  id: string;
  type: string;
  title: string;
  description: string;
  value: number;
  earnedAt: string;
  criteria: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  participants: string[];
  rewards: string[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  rarity: string;
  criteria: string;
  earnedBy: string[];
  category: string;
}

export interface LearningInsights {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  actionability: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  generatedAt: string;
  expiresAt: string;
  implemented: boolean;
}

export interface PerformanceMetrics {
  engagementScore: number;
  retentionRate: number;
  completionRate: number;
  satisfactionScore: number;
  learningVelocity: number;
  collaborationScore: number;
  innovationScore: number;
  persistenceScore: number;
}

export interface PredictiveInsights {
  id: string;
  type: string;
  prediction: any;
  confidence: number;
  timeframe: string;
  recommendations: string[];
  generatedAt: string;
}

// ===== SELECTORS =====

export const useLearningPaths = () => useLearningStore(state => state.learningPaths);
export const useUserLearningPaths = () => useLearningStore(state => state.userLearningPaths);
export const useUserModuleProgress = () => useLearningStore(state => state.userModuleProgress);
export const useCurrentLearningPath = () => useLearningStore(state => state.currentLearningPath);
export const useCurrentModule = () => useLearningStore(state => state.currentModule);
export const useLearningSession = () => useLearningStore(state => state.learningSession);

export const useAIPersonalization = () => useLearningStore(state => ({
  learningStyle: state.aiPersonalization.learningStyleDetection,
  contentAdaptation: state.aiPersonalization.contentAdaptation,
  paceOptimization: state.aiPersonalization.paceOptimization,
  difficultyCalibration: state.aiPersonalization.difficultyCalibration,
  recommendations: state.aiPersonalization.recommendationEngine
}));

export const useLearningAnalytics = () => useLearningStore(state => state.learningAnalytics);
export const usePredictiveModels = () => useLearningStore(state => state.predictiveModels);
export const useAdaptiveAlgorithms = () => useLearningStore(state => state.adaptiveAlgorithms);

export const useLearningProgress = () => useLearningStore(state => ({
  overallProgress: state.overallProgress,
  learningStreaks: state.learningStreaks,
  achievements: state.achievements
}));

export const useSocialLearning = () => useLearningStore(state => ({
  peers: state.peers,
  studyGroups: state.studyGroups,
  mentors: state.mentors,
  collaborativeActivities: state.collaborativeActivities
}));

export const useGamification = () => useLearningStore(state => ({
  gamification: state.gamification,
  rewards: state.rewards,
  challenges: state.challenges,
  badges: state.badges
}));

export const useLearningInsights = () => useLearningStore(state => ({
  insights: state.learningInsights,
  performanceMetrics: state.performanceMetrics,
  predictiveInsights: state.predictiveInsights
}));

export const useLearningUI = () => useLearningStore(state => ({
  isLoading: state.isLoading,
  error: state.error,
  filters: state.filters,
  searchQuery: state.searchQuery,
  viewMode: state.viewMode
}));

export const useLearningPreferences = () => useLearningStore(state => ({
  preferences: state.preferences,
  accessibility: state.accessibility,
  personalization: state.personalization
}));

export const useRealTimeLearning = () => useLearningStore(state => ({
  liveSession: state.liveSession,
  realTimeCollaborations: state.realTimeCollaborations,
  notifications: state.notifications
}));

export const useOfflineSupport = () => useLearningStore(state => ({
  offlineContent: state.offlineContent,
  syncStatus: state.syncStatus,
  cacheManagement: state.cacheManagement
}));

export const useContentLibrary = () => useLearningStore(state => ({
  contentLibrary: state.contentLibrary,
  recommendations: state.recommendations,
  bookmarks: state.bookmarks,
  notes: state.notes
}));

export default useLearningStore;