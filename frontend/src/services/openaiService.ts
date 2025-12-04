// OpenAI Service for JAC Learning Platform
// Enhanced by Cavin Otieno

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

interface AIInsightObject {
  type?: string;
  title?: string;
  description?: string;
  recommendation?: string;
  content?: string;
  confidence?: number;
  insights?: string[];
  isAnomaly?: boolean;
  layoutRecommendations?: any;
  suggestions?: any[];
  relationships?: any[];
  categoryScores?: any;
  overallScore?: number;
  optimization?: string;
  engagementPrediction?: number;
  churnRisk?: number;
}

class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async generateLearningContent(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator for the JAC learning platform. Generate high-quality, engaging learning content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Content generation failed';
    } catch (error) {
      console.error('OpenAI service error:', error);
      return 'Content generation unavailable';
    }
  }

  async generateQuizQuestions(topic: string): Promise<string> {
    const prompt = `Generate 5 multiple choice quiz questions about ${topic}. Include 4 options with 1 correct answer. Format as JSON.`;
    return this.generateLearningContent(prompt);
  }

  async provideLearningRecommendation(userStats: any): Promise<string> {
    const prompt = `Based on these learning statistics: ${JSON.stringify(userStats)}, provide personalized learning recommendations.`;
    return this.generateLearningContent(prompt);
  }

  // Enhanced AI Insight Generation with object support
  async generateInsight(promptOrData: string | any, optimizationType?: string): Promise<AIInsightObject> {
    const prompt = typeof promptOrData === 'string' 
      ? promptOrData 
      : `Generate insights based on this data: ${JSON.stringify(promptOrData)}`;
    
    const response = await this.generateLearningContent(prompt);
    
    // Parse response as object if it looks like JSON
    try {
      const parsed = JSON.parse(response);
      if (typeof parsed === 'object') {
        return parsed;
      }
    } catch (e) {
      // If not JSON, create a basic insight object
      return {
        content: response,
        type: optimizationType || 'general',
        title: `${optimizationType?.replace('_', ' ').toUpperCase() || 'Insight'}`,
        description: response,
        confidence: 0.8
      };
    }
    
    // Fallback response
    return {
      content: response,
      type: optimizationType || 'general',
      title: `${optimizationType?.replace('_', ' ').toUpperCase() || 'Insight'}`,
      description: response,
      confidence: 0.8
    };
  }

  // User Flow Optimization
  async optimizeUserFlow(flowData: any): Promise<any> {
    const prompt = `Analyze and optimize this user flow data: ${JSON.stringify(flowData)}. Provide specific recommendations for improvement.`;
    const result = await this.generateLearningContent(prompt);
    return { optimization: result, timestamp: new Date().toISOString() };
  }

  // Performance Prediction
  async predictPerformance(data: any): Promise<any> {
    const prompt = `Analyze performance data and provide predictions: ${JSON.stringify(data)}. Include trends, recommendations, and risk factors.`;
    const result = await this.generateLearningContent(prompt);
    return { predictions: result, timestamp: new Date().toISOString() };
  }

  // Data Sync Optimization
  async optimizeSync(data: any): Promise<any> {
    const prompt = `Optimize data synchronization with this data: ${JSON.stringify(data)}. Provide sync recommendations.`;
    const result = await this.generateLearningContent(prompt);
    return { syncData: result, timestamp: new Date().toISOString() };
  }
}

export const openaiService = new OpenAIService();
export default openaiService;
