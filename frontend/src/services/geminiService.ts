// Gemini AI Service for JAC Learning Platform
// Enhanced by Cavin Otieno

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

class GeminiService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  async generateContent(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      });

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'Content generation failed';
    } catch (error) {
      console.error('Gemini service error:', error);
      return 'Content generation unavailable';
    }
  }

  async analyzeLearningPath(pathContent: string): Promise<string> {
    const prompt = `Analyze this learning path content and provide insights: ${pathContent}`;
    return this.generateContent(prompt);
  }

  async adaptContentDifficulty(content: string, userLevel: 'beginner' | 'intermediate' | 'advanced'): Promise<string> {
    const prompt = `Adapt this content for a ${userLevel} learner: ${content}`;
    return this.generateContent(prompt);
  }

  async generateExplanations(concept: string): Promise<string> {
    const prompt = `Provide a detailed explanation of: ${concept}`;
    return this.generateContent(prompt);
  }

  // AI Insight Generation
  async generateInsight(promptOrData: string | any): Promise<string> {
    const prompt = typeof promptOrData === 'string' 
      ? promptOrData 
      : `Generate insights based on this data: ${JSON.stringify(promptOrData)}`;
    
    return this.generateContent(prompt);
  }

  // User Flow Optimization
  async optimizeUserFlow(flowData: any): Promise<any> {
    const prompt = `Analyze and optimize this user flow data: ${JSON.stringify(flowData)}. Provide specific recommendations for improvement.`;
    const result = await this.generateContent(prompt);
    return { optimization: result, timestamp: new Date().toISOString() };
  }

  // Performance Prediction
  async predictPerformance(data: any): Promise<any> {
    const prompt = `Analyze performance data and provide predictions: ${JSON.stringify(data)}. Include trends, recommendations, and risk factors.`;
    const result = await this.generateContent(prompt);
    return { predictions: result, timestamp: new Date().toISOString() };
  }
}

export const geminiService = new GeminiService();
export default geminiService;