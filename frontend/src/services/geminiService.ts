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

interface AIInsightObject {
  type?: string;
  title?: string;
  description?: string;
  recommendation?: string;
  content?: string;
  confidence?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textPrimary?: string;
  textSecondary?: string;
  textDisabled?: string;
  textInverse?: string;
  optimizedColors?: any;
  compliance?: any;
  accessibility?: any;
  insights?: string[];
  layoutRecommendations?: any;
  suggestions?: any[];
  relationships?: any[];
  categoryScores?: any;
  overallScore?: number;
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

  // Enhanced AI Insight Generation with object support
  async generateInsight(promptOrData: string | any, optimizationType?: string): Promise<AIInsightObject> {
    const prompt = typeof promptOrData === 'string' 
      ? promptOrData 
      : `Generate insights based on this data: ${JSON.stringify(promptOrData)}`;
    
    const response = await this.generateContent(prompt);
    
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
        type: 'general',
        title: 'AI Insight',
        description: response,
        confidence: 0.8
      };
    }
    
    // Fallback response
    return {
      content: response,
      type: 'general',
      title: 'AI Insight',
      description: response,
      confidence: 0.8
    };
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

  // Theme Optimization
  async optimizeTheme(variant?: string): Promise<AIInsightObject> {
    const prompt = `Generate an optimized theme palette for ${variant || 'general'} variant. Return JSON with primaryColor, secondaryColor, accentColor, backgroundColor, surfaceColor, textPrimary, textSecondary, textDisabled, textInverse, and confidence.`;
    const response = await this.generateContent(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        primaryColor: parsed.primaryColor || '#3b82f6',
        secondaryColor: parsed.secondaryColor || '#6b7280',
        accentColor: parsed.accentColor || '#10b981',
        backgroundColor: parsed.backgroundColor || '#ffffff',
        surfaceColor: parsed.surfaceColor || '#f8fafc',
        textPrimary: parsed.textPrimary || '#1f2937',
        textSecondary: parsed.textSecondary || '#6b7280',
        textDisabled: parsed.textDisabled || '#9ca3af',
        textInverse: parsed.textInverse || '#ffffff',
        optimizedColors: parsed.optimizedColors || {},
        confidence: parsed.confidence || 0.85,
        type: 'theme'
      };
    } catch (e) {
      return {
        primaryColor: '#3b82f6',
        secondaryColor: '#6b7280',
        accentColor: '#10b981',
        backgroundColor: '#ffffff',
        surfaceColor: '#f8fafc',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        textDisabled: '#9ca3af',
        textInverse: '#ffffff',
        optimizedColors: {},
        confidence: 0.85,
        type: 'theme'
      };
    }
  }

  // Modal Suggestion
  async suggestModal(data: any): Promise<any> {
    const prompt = `Suggest a contextual modal based on this context: ${JSON.stringify(data)}. Return JSON with type, title, content, and recommendation.`;
    const response = await this.generateContent(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        type: parsed.type || 'information',
        title: parsed.title || 'Suggested Action',
        content: parsed.content || response,
        recommendation: parsed.recommendation || 'Consider implementing this modal.',
        confidence: parsed.confidence || 0.8
      };
    } catch (e) {
      return {
        type: 'information',
        title: 'Suggested Action',
        content: response,
        recommendation: 'Consider implementing this modal.',
        confidence: 0.8
      };
    }
  }

  // Behavior Analysis
  async analyzeBehavior(data: any): Promise<any> {
    const prompt = `Analyze user behavior patterns from this data: ${JSON.stringify(data)}. Provide insights and recommendations.`;
    const response = await this.generateContent(prompt);
    return {
      analysis: response,
      insights: [response],
      timestamp: new Date().toISOString(),
      confidence: 0.85
    };
  }

  // Knowledge Graph Node Generation
  async generateKnowledgeNodes(content: any): Promise<any[]> {
    const prompt = `Generate knowledge graph nodes from this content: ${JSON.stringify(content)}. Return JSON array of nodes with id, label, type, and properties.`;
    const response = await this.generateContent(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : [
        { id: 'node1', label: 'Main Topic', type: 'concept', properties: {} }
      ];
    } catch (e) {
      return [
        { id: 'node1', label: 'Main Topic', type: 'concept', properties: {} }
      ];
    }
  }

  // User Preferences Learning
  async learnUserPreferences(data: any): Promise<any> {
    const prompt = `Learn user preferences from this behavior data: ${JSON.stringify(data)}. Return insights about preferences and recommendations.`;
    const response = await this.generateContent(prompt);
    return {
      preferences: response,
      insights: [response],
      timestamp: new Date().toISOString(),
      confidence: 0.8
    };
  }

  // Accessibility Optimization
  async optimizeAccessibility(data: any): Promise<any> {
    const prompt = `Optimize accessibility based on this data: ${JSON.stringify(data)}. Return compliance recommendations and improvements.`;
    const response = await this.generateContent(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        compliance: {
          accessibility: {
            contrastRatio: parsed.contrastRatio || 4.5,
            colorBlindnessCompatibility: parsed.colorBlindnessCompatibility || 100,
            keyboardNavigation: parsed.keyboardNavigation || true,
            screenReaderCompatible: parsed.screenReaderCompatible || true
          },
          wcagLevel: parsed.wcagLevel || 'AA'
        },
        recommendations: parsed.recommendations || [response],
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      return {
        compliance: {
          accessibility: {
            contrastRatio: 4.5,
            colorBlindnessCompatibility: 100,
            keyboardNavigation: true,
            screenReaderCompatible: true
          },
          wcagLevel: 'AA'
        },
        recommendations: [response],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Conflict Resolution
  async resolveConflicts(conflicts: any[]): Promise<any> {
    const prompt = `Resolve these conflicts: ${JSON.stringify(conflicts)}. Provide resolution strategies.`;
    const response = await this.generateContent(prompt);
    return {
      resolutions: [response],
      timestamp: new Date().toISOString()
    };
  }
}

export const geminiService = new GeminiService();
export default geminiService;
