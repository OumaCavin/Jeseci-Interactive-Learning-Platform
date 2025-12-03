// Code Editor Store - State management for code editing and execution
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiClient as api } from '../../services/api';

export interface CodeExecutionRequest {
  code: string;
  language: 'python' | 'javascript' | 'typescript' | 'jac' | 'html' | 'css';
  timeout?: number;
  memory_limit?: number;
  test_cases?: any[];
}

export interface CodeExecutionResponse {
  success: boolean;
  output: string;
  error?: string;
  execution_time: number;
  memory_usage: number;
  line_number?: number;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage: number;
  lineNumber?: number;
  timestamp: Date;
}

export interface CodeTemplate {
  id: string;
  name: string;
  language: string;
  code: string;
  description: string;
  tags: string[];
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: 'dark' | 'light';
  autoSave: boolean;
  executionTimeout: number;
  memoryLimit: number;
  showLineNumbers: boolean;
  wordWrap: boolean;
}

export interface CodeSnippet {
  id: string;
  name: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
}

interface CodeEditorState {
  // Editor Content
  code: string;
  selectedLanguage: 'python' | 'javascript' | 'typescript' | 'jac' | 'html' | 'css';
  
  // Execution
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  executionHistory: ExecutionResult[];
  
  // Templates and Snippets
  templates: CodeTemplate[];
  snippets: CodeSnippet[];
  selectedTemplate: CodeTemplate | null;
  
  // Settings
  settings: EditorSettings;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  showSettings: boolean;
  showTemplates: boolean;
  showSnippets: boolean;
  
  // Actions
  setCode: (code: string) => void;
  setLanguage: (language: 'python' | 'javascript' | 'typescript' | 'jac' | 'html' | 'css') => void;
  executeCode: (request?: CodeExecutionRequest) => Promise<void>;
  stopExecution: () => void;
  
  // Template Actions
  loadTemplates: () => Promise<void>;
  selectTemplate: (template: CodeTemplate) => void;
  createTemplate: (template: Omit<CodeTemplate, 'id'>) => void;
  
  // Snippet Actions
  loadSnippets: () => Promise<void>;
  saveSnippet: (snippet: Omit<CodeSnippet, 'id' | 'createdAt'>) => void;
  deleteSnippet: (snippetId: string) => void;
  
  // Settings Actions
  updateSettings: (settings: Partial<EditorSettings>) => void;
  resetSettings: () => void;
  
  // Utility Actions
  clearOutput: () => void;
  resetCode: () => void;
  duplicateCode: () => void;
  insertAtCursor: (text: string) => void;
  
  // UI Actions
  setShowSettings: (show: boolean) => void;
  setShowTemplates: (show: boolean) => void;
  setShowSnippets: (show: boolean) => void;
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  theme: 'dark',
  autoSave: true,
  executionTimeout: 30,
  memoryLimit: 512,
  showLineNumbers: true,
  wordWrap: true,
};

const LANGUAGE_TEMPLATES: Record<string, CodeTemplate> = {
  python: {
    id: 'python-template',
    name: 'Python Hello World',
    language: 'python',
    description: 'Basic Python template with function examples',
    tags: ['python', 'beginner', 'functions'],
    code: `# Python Template - JAC Learning Platform
# Welcome to Python programming!

def fibonacci(n):
    """Calculate fibonacci number recursively"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def factorial(n):
    """Calculate factorial of a number"""
    if n <= 1:
        return 1
    return n * factorial(n-1)

# Example usage
print("Fibonacci sequence:")
for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")

print("\\nFactorial examples:")
for i in range(1, 6):
    print(f"{i}! = {factorial(i)}")

# Try your own code below:
# print("Hello, World!")
`
  },
  jac: {
    id: 'jac-template',
    name: 'JAC (Jaseci) Template',
    language: 'jac',
    description: 'JAC programming language template',
    tags: ['jac', 'ai', 'nodes', 'walkers'],
    code: `// JAC Template - Jaseci Architecture Code
// Welcome to JAC (Jaseci Architecture Code)!

walker hello_world {
    can print;
    
    // Basic printing
    print("Hello from JAC!");
    print("JAC is an AI-first programming language for building intelligent systems");
    
    // Define a simple node with capabilities
    node person {
        has name, age, interests;
        can greet with person entry {
            can print;
            greeting = f"Hello! I'm {here.name}, {here.age} years old";
            print(greeting);
            
            if here.interests:
                print(f"My interests include: {', '.join(here.interests)}");
        }
        
        can share_knowledge {
            can print;
            print(f"{here.name} shares: Knowledge is power!");
        }
    }
    
    // Create and interact with nodes
    person_1 = spawn node.person(
        name="Alice", 
        age=25, 
        interests=["AI", "Machine Learning", "Data Science"]
    );
    
    person_2 = spawn node.person(
        name="Bob", 
        age=30, 
        interests=["Web Development", "React", "Node.js"]
    );
    
    // Node interactions
    person_1.greet;
    person_2.greet;
    person_1.share_knowledge;
    
    // Final report
    report {
        "message": "JAC execution completed successfully!",
        "result": "success",
        "nodes_created": 2,
        "language": "JAC (Jaseci Architecture Code)"
    };
    
    // Try your own JAC code below:
    // print("Your JAC code here!");
}`
  },
  javascript: {
    id: 'js-template',
    name: 'JavaScript ES6+',
    language: 'javascript',
    description: 'Modern JavaScript with ES6+ features',
    tags: ['javascript', 'es6', 'modern'],
    code: `// JavaScript ES6+ Template - JAC Learning Platform
// Modern JavaScript with arrow functions, destructuring, and async/await

// Arrow functions and template literals
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("JavaScript Developer"));

// Array methods
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = numbers.filter(n => n % 2 === 0);
const squares = numbers.map(n => n * n);

console.log("Even numbers:", evens);
console.log("Squares:", squares);

// Async/await example
const fetchData = async () => {
    try {
        console.log("Fetching data...");
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, data: "Sample data" };
    } catch (error) {
        console.error("Error:", error);
        return { success: false, error: error.message };
    }
};

// Object destructuring
const processUser = (userData) => {
    const { name, age, email } = userData;
    return \`User: \${name}, Age: \${age}, Email: \${email}\`;
};

const user = { name: "John Doe", age: 30, email: "john@example.com" };
console.log(processUser(user));

// Class example
class Calculator {
    constructor() {
        this.result = 0;
    }
    
    add(x) {
        this.result += x;
        return this;
    }
    
    multiply(x) {
        this.result *= x;
        return this;
    }
    
    getResult() {
        return this.result;
    }
}

// Using the calculator
const calc = new Calculator();
const finalResult = calc.add(5).multiply(3).getResult();
console.log("Calculator result:", finalResult);

// Run async function
fetchData().then(result => {
    console.log("Async result:", result);
});

console.log("JavaScript execution completed!");
`
  },
  typescript: {
    id: 'ts-template',
    name: 'TypeScript Advanced',
    language: 'typescript',
    description: 'TypeScript with interfaces, generics, and advanced types',
    tags: ['typescript', 'types', 'generics', 'interfaces'],
    code: `// TypeScript Advanced Template - JAC Learning Platform
// Advanced TypeScript features: interfaces, generics, type guards, and more

// Interface definition
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
    preferences?: UserPreferences;
}

// Nested interface
interface UserPreferences {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
}

// Generic function
function createResponse<T>(data: T, status: 'success' | 'error' = 'success'): ApiResponse<T> {
    return {
        success: status === 'success',
        data,
        timestamp: new Date().toISOString()
    };
}

// Type definition
type ApiResponse<T> = {
    success: boolean;
    data: T;
    timestamp: string;
};

// Enum
enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

// Type guard
function isUser(obj: any): obj is User {
    return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}

// Class with generics
class DataStore<T> {
    private items: T[] = [];
    
    add(item: T): void {
        this.items.push(item);
    }
    
    getAll(): T[] {
        return [...this.items];
    }
    
    find(predicate: (item: T) => boolean): T | undefined {
        return this.items.find(predicate);
    }
}

// Utility types
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;

// Function overloads
function formatValue(value: string): string;
function formatValue(value: number): string;
function formatValue(value: boolean): string;
function formatValue(value: any): string {
    if (typeof value === 'string') return value.toUpperCase();
    if (typeof value === 'number') return value.toFixed(2);
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    return String(value);
}

// Example usage
const user: User = {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true
    }
};

const response = createResponse(user);
console.log('API Response:', response);

const store = new DataStore<User>();
store.add(user);
console.log('Users in store:', store.getAll());

console.log('TypeScript execution completed!');
console.log('Formatted values:');
console.log(formatValue("hello"));     // "HELLO"
console.log(formatValue(3.14159));     // "3.14"
console.log(formatValue(true));        // "TRUE"
`
  },
  html: {
    id: 'html-template',
    name: 'HTML5 Structure',
    language: 'html',
    description: 'Modern HTML5 with semantic elements',
    tags: ['html', 'html5', 'semantic'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JAC Learning Platform - HTML Template</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
        }
        
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        h1 {
            color: #4a5568;
            margin-bottom: 0.5rem;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .feature {
            padding: 1.5rem;
            background: #f7fafc;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .feature h3 {
            color: #2d3748;
            margin-top: 0;
        }
        
        footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e2e8f0;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 JAC Learning Platform</h1>
            <p>Welcome to modern web development with HTML5</p>
        </header>
        
        <main>
            <section class="features">
                <article class="feature">
                    <h3>📚 Rich Learning Content</h3>
                    <p>Access comprehensive tutorials and interactive exercises to master programming concepts.</p>
                </article>
                
                <article class="feature">
                    <h3>💻 Live Code Editor</h3>
                    <p>Write and execute code in real-time with our advanced integrated development environment.</p>
                </article>
                
                <article class="feature">
                    <h3>🤝 Collaborative Learning</h3>
                    <p>Join study groups, collaborate on projects, and learn together with peers worldwide.</p>
                </article>
                
                <article class="feature">
                    <h3>🏆 Achievement System</h3>
                    <p>Track your progress and earn badges as you complete challenges and reach milestones.</p>
                </article>
            </section>
        </main>
        
        <footer>
            <p>&copy; 2025 JAC Learning Platform. Empowering developers worldwide.</p>
        </footer>
    </div>
    
    <script>
        // Simple JavaScript to enhance interactivity
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 JAC Learning Platform loaded successfully!');
            
            // Add click handlers to features
            const features = document.querySelectorAll('.feature');
            features.forEach((feature, index) => {
                feature.addEventListener('click', function() {
                    this.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                    console.log(\`Feature \${index + 1} clicked!\`);
                });
            });
        });
    </script>
</body>
</html>`
  },
  css: {
    id: 'css-template',
    name: 'CSS Modern Techniques',
    language: 'css',
    description: 'Modern CSS with Grid, Flexbox, and animations',
    tags: ['css', 'modern', 'grid', 'flexbox'],
    code: `/* Modern CSS Template - JAC Learning Platform */
/* CSS Grid, Flexbox, Custom Properties, and Advanced Animations */

:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    --text-color: #2d3748;
    --bg-color: #f7fafc;
    --card-bg: #ffffff;
    --shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    min-height: 100vh;
    color: var(--text-color);
    line-height: 1.6;
}

/* Modern Card Component */
.card {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: var(--shadow);
    transition: var(--transition);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* CSS Grid Layout */
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

/* Flexbox Layout */
.flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: center;
}

.flex-item {
    flex: 1;
    min-width: 250px;
    max-width: 350px;
}

/* Modern Button */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.btn:hover::before {
    left: 100%;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Advanced Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
}

.animate-pulse {
    animation: pulse 2s infinite;
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Typography */
.heading {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
}

.subheading {
    font-size: 1.25rem;
    color: #718096;
    margin-bottom: 2rem;
}

/* Glass Morphism Effect */
.glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 0 0.5rem;
    }
    
    .heading {
        font-size: 2rem;
    }
    
    .card {
        padding: 1.5rem;
    }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    :root {
        --text-color: #e2e8f0;
        --bg-color: #1a202c;
        --card-bg: #2d3748;
    }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
}`
  }
};

export const useCodeEditorStore = create<CodeEditorState>()(
  devtools(
    (set, get) => ({
      // Initial state
      code: LANGUAGE_TEMPLATES.python.code,
      selectedLanguage: 'python',
      isExecuting: false,
      executionResult: null,
      executionHistory: [],
      templates: Object.values(LANGUAGE_TEMPLATES),
      snippets: [],
      selectedTemplate: null,
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      error: null,
      showSettings: false,
      showTemplates: false,
      showSnippets: false,

      setCode: (code) => set({ code }),
      
      setLanguage: (language) => {
        const template = LANGUAGE_TEMPLATES[language];
        set({ 
          selectedLanguage: language,
          code: template?.code || '',
          executionResult: null,
          selectedTemplate: template || null
        });
      },

      executeCode: async (request) => {
        const state = get();
        set({ isExecuting: true, error: null });

        try {
          const executionRequest: CodeExecutionRequest = {
            code: state.code,
            language: state.selectedLanguage,
            timeout: state.settings.executionTimeout,
            memory_limit: state.settings.memoryLimit,
            ...request
          };

          const startTime = Date.now();
          
          // Simulate API call (replace with actual endpoint)
          const response = await new Promise<CodeExecutionResponse>((resolve) => {
            setTimeout(() => {
              // Mock execution based on language
              if (state.selectedLanguage === 'html') {
                resolve({
                  success: true,
                  output: '<html>HTML executed successfully!</html>',
                  execution_time: 0.5,
                  memory_usage: 12
                });
              } else if (state.selectedLanguage === 'css') {
                resolve({
                  success: true,
                  output: 'CSS compiled and applied successfully!',
                  execution_time: 0.3,
                  memory_usage: 8
                });
              } else if (state.selectedLanguage === 'jac') {
                resolve({
                  success: true,
                  output: 'JAC (Jaseci) code executed successfully!\\nReport: {"message": "JAC execution completed!", "result": "success"}',
                  execution_time: 0.8,
                  memory_usage: 45
                });
              } else {
                // Generic execution simulation
                resolve({
                  success: true,
                  output: state.code.includes('print') ? 
                    'Code executed successfully!\\nOutput: Hello, World!' :
                    'Code executed successfully!',
                  execution_time: Math.random() * 2 + 0.1,
                  memory_usage: Math.floor(Math.random() * 50) + 10
                });
              }
            }, 1000);
          });

          const result: ExecutionResult = {
            success: response.success,
            output: response.output,
            error: response.error,
            executionTime: response.execution_time,
            memoryUsage: response.memory_usage,
            timestamp: new Date()
          };

          set(state => ({
            executionResult: result,
            executionHistory: [result, ...state.executionHistory.slice(0, 9)], // Keep last 10
            isExecuting: false
          }));

        } catch (error: any) {
          const errorResult: ExecutionResult = {
            success: false,
            output: '',
            error: error.message || 'Execution failed',
            executionTime: 0,
            memoryUsage: 0,
            timestamp: new Date()
          };

          set({
            executionResult: errorResult,
            isExecuting: false,
            error: error.message || 'Code execution failed'
          });
        }
      },

      stopExecution: () => {
        set({ isExecuting: false });
      },

      loadTemplates: async () => {
        set({ isLoading: true });
        try {
          // Simulate loading templates
          set({
            templates: Object.values(LANGUAGE_TEMPLATES),
            isLoading: false
          });
        } catch (error) {
          set({ error: 'Failed to load templates', isLoading: false });
        }
      },

      selectTemplate: (template) => {
        set({ 
          code: template.code,
          selectedLanguage: template.language as any,
          selectedTemplate: template
        });
      },

      createTemplate: (templateData) => {
        const newTemplate: CodeTemplate = {
          id: Date.now().toString(),
          ...templateData
        };
        set(state => ({
          templates: [...state.templates, newTemplate]
        }));
      },

      loadSnippets: async () => {
        set({ isLoading: true });
        try {
          // Simulate loading snippets from localStorage
          const savedSnippets = JSON.parse(localStorage.getItem('code-snippets') || '[]');
          set({
            snippets: savedSnippets,
            isLoading: false
          });
        } catch (error) {
          set({ error: 'Failed to load snippets', isLoading: false });
        }
      },

      saveSnippet: (snippetData) => {
        const newSnippet: CodeSnippet = {
          id: Date.now().toString(),
          ...snippetData,
          createdAt: new Date()
        };
        
        set(state => {
          const updatedSnippets = [...state.snippets, newSnippet];
          // Save to localStorage
          localStorage.setItem('code-snippets', JSON.stringify(updatedSnippets));
          return { snippets: updatedSnippets };
        });
      },

      deleteSnippet: (snippetId) => {
        set(state => {
          const updatedSnippets = state.snippets.filter(s => s.id !== snippetId);
          localStorage.setItem('code-snippets', JSON.stringify(updatedSnippets));
          return { snippets: updatedSnippets };
        });
      },

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      },

      clearOutput: () => {
        set({ executionResult: null });
      },

      resetCode: () => {
        const state = get();
        const template = LANGUAGE_TEMPLATES[state.selectedLanguage];
        set({
          code: template?.code || '',
          executionResult: null
        });
      },

      duplicateCode: async () => {
        const { code } = get();
        try {
          await navigator.clipboard.writeText(code);
          // Could add a toast notification here
        } catch (error) {
          console.error('Failed to copy code:', error);
        }
      },

      insertAtCursor: (text) => {
        set(state => {
          const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newCode = state.code.substring(0, start) + text + state.code.substring(end);
            
            // Restore cursor position
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = start + text.length;
              textarea.focus();
            }, 0);
            
            return { code: newCode };
          }
          return { code: state.code + text };
        });
      },

      setShowSettings: (show) => set({ showSettings: show }),
      setShowTemplates: (show) => set({ showTemplates: show }),
      setShowSnippets: (show) => set({ showSnippets: show })
    }),
    {
      name: 'code-editor-store',
    }
  )
);