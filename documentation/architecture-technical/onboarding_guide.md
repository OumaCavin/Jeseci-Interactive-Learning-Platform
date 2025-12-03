# Onboarding Guide

**Author**: Cavin Otieno  
**Version**: 1.0.0  
**Last Updated**: 2025-12-02 04:26:27  

## 🎯 Welcome to Jeseci Interactive Learning Platform

This comprehensive onboarding guide will help you set up your development environment, understand the project structure, and begin contributing to the Jeseci Interactive Learning Platform.

## 🚀 Quick Start

### Prerequisites

#### Required Software
- **Python >= 3.12** - Python runtime environment
- **Node.js 18+** - JavaScript runtime and npm package manager
- **Git** - Version control system
- **Docker & Docker Compose** - Containerization platform
- **Redis** - In-memory data structure store
- **PostgreSQL 15+** - Relational database

#### Optional Tools
- **VS Code** - Recommended code editor with extensions
- **Postman** - API testing tool
- **pgAdmin** - PostgreSQL administration tool

### Environment Setup

#### 1. Clone the Repository
```bash
# Clone the repository
git clone https://github.com/OumaCavin/Jeseci-Interactive-Learning-Platform.git
cd Jeseci-Learning-Platform

# Configure Git (replace with your details)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Create and switch to development branch
git checkout -b feature/your-feature-name
```

#### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

**Required Environment Variables:**
```bash
# Django Configuration
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DATABASE_URL=postgresql://jeseci_user:jeseci_password@localhost:5432/jeseci_dev
TEST_DATABASE_URL=postgresql://jeseci_user:jeseci_password@localhost:5432/jeseci_test

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# AI Service Configuration
OPENAI_API_KEY=your-openai-api-key
BYLLM_SERVICE_URL=http://localhost:8001

# Email Configuration (Optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

#### 3. Database Setup
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql

CREATE DATABASE jeseci_dev;
CREATE USER jeseci_user WITH ENCRYPTED PASSWORD 'jeseci_password';
GRANT ALL PRIVILEGES ON DATABASE jeseci_dev TO jeseci_user;
\q

# Install Redis
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## 🛠️ Development Setup

### Using Docker (Recommended)
```bash
# Start all services with Docker Compose
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis

# Stop all services
docker-compose down
```

### Manual Setup

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate  # Windows

# Install dependencies (latest versions)
pip install --upgrade pip
pip install jaclang jac-client
pip install django djangorestframework
pip install celery[redis] psycopg2-binary Pillow
pip install python-decouple dj-database-url
pip install django-cors-headers whitenoise
pip install drf-spectacular

# Install development tools
pip install pytest pytest-django pytest-cov
pip install black isort flake8
pip install django-debug-toolbar

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (latest versions)
npm install

# Install additional development dependencies
npm install --save-dev @types/jest @testing-library/jest-dom
npm install --save-dev eslint prettier

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

#### Multi-Agent System Setup
```bash
# Verify JacLang installation
jac --version

# Test Jac walker compilation
cd backend/jac_layer/walkers
jac compile evaluator.jac

# Run Jac walker tests
jac test evaluator.jac

# Check all walkers
ls -la *.jac  # Should show 6 .jac files
```

## 🏗️ Project Structure

### Directory Overview
```
Jeseci-Interactive-Learning-Platform/
├── README.md                              # Project overview
├── README_DOCUMENTATION_INDEX.md          # Documentation index
├── docker-compose.yml                     # Docker services configuration
├── .env.example                           # Environment variables template
├── Makefile                              # Development automation
├── requirements.txt                       # Python dependencies (latest)
├── package.json                          # Node.js dependencies (latest)
│
├── backend/                               # Django Python backend
│   ├── api/                              # REST API endpoints
│   │   ├── views.py                      # API views
│   │   ├── serializers.py                # DRF serializers
│   │   ├── urls.py                       # URL routing
│   │   └── models.py                     # Database models
│   ├── jac_layer/                        # Multi-Agent System
│   │   ├── walkers/                      # Jac walker agents
│   │   │   ├── orchestrator.jac          # SystemOrchestrator
│   │   │   ├── content_curator.jac       # ContentCurator
│   │   │   ├── quiz_master.jac           # QuizMaster
│   │   │   ├── evaluator.jac             # Evaluator
│   │   │   ├── progress_tracker.jac      # ProgressTracker
│   │   │   └── motivator.jac             # Motivator
│   │   ├── jac_manager.py                # Jac integration manager
│   │   └── apps.py                       # Django app configuration
│   ├── backend/                          # Django project settings
│   │   ├── settings.py                   # Project settings
│   │   ├── urls.py                       # Main URL routing
│   │   └── wsgi.py                       # WSGI configuration
│   ├── tests/                            # Backend tests
│   ├── manage.py                         # Django management script
│   ├── requirements.txt                  # Python dependencies
│   └── static/                           # Static files
│
├── frontend/                             # React TypeScript frontend
│   ├── public/                           # Public assets
│   ├── src/                              # Source code
│   │   ├── components/                   # React components
│   │   ├── pages/                        # Application pages
│   │   ├── hooks/                        # Custom React hooks
│   │   ├── services/                     # API service layer
│   │   ├── types/                        # TypeScript definitions
│   │   ├── utils/                        # Utility functions
│   │   └── App.tsx                       # Main application component
│   ├── package.json                      # Node.js dependencies
│   ├── tsconfig.json                     # TypeScript configuration
│   └── tailwind.config.js                # TailwindCSS configuration
│
├── scripts/                              # Utility scripts
│   ├── migrate_py_to_jac.sh              # Jac file migration
│   ├── setup_development.sh              # Development setup
│   └── backup_production.sh              # Backup utilities
│
├── docs/                                 # Documentation
│   ├── architecture_overview.md          # System architecture
│   ├── multi_agent_system.md             # Agent documentation
│   ├── api_reference.yaml                # API documentation
│   ├── deployment_architecture.md        # Deployment guide
│   └── [other documentation files]
│
├── deployment/                           # Deployment configurations
│   ├── docker/                           # Docker configurations
│   ├── kubernetes/                       # K8s manifests
│   └── terraform/                        # Infrastructure as code
│
└── .github/                              # GitHub workflows
    └── workflows/                        # CI/CD pipelines
```

### Key Files and Their Purpose

#### Backend Files
- **backend/manage.py**: Django command-line utility
- **backend/jac_layer/jac_manager.py**: Integrates JacLang with Django
- **backend/api/views.py**: REST API endpoint implementations
- **backend/requirements.txt**: Python dependencies (latest versions)

#### Frontend Files
- **frontend/src/App.tsx**: Main React application component
- **frontend/src/components/**: Reusable UI components
- **frontend/package.json**: Node.js dependencies (latest versions)

#### Configuration Files
- **docker-compose.yml**: Development services configuration
- **Makefile**: Development workflow automation
- **.env**: Environment variables (local development)

## 🤖 Understanding the Multi-Agent System

### Agent Architecture
The platform uses 6 specialized agents implemented as Jac walkers:

1. **SystemOrchestrator** (`orchestrator.jac`)
   - Coordinates all agent activities
   - Manages overall system workflow
   - Handles error recovery

2. **ContentCurator** (`content_curator.jac`)
   - Manages learning materials
   - Ensures content quality
   - Adapts content difficulty

3. **QuizMaster** (`quiz_master.jac`)
   - Generates adaptive quizzes
   - Uses AI for question creation
   - Maintains assessment quality

4. **Evaluator** (`evaluator.jac`)
   - Implements Cavin Otieno's evaluation methodology
   - Provides intelligent feedback
   - Assesses learning progress

5. **ProgressTracker** (`progress_tracker.jac`)
   - Monitors learning patterns
   - Generates analytics reports
   - Identifies learning gaps

6. **Motivator** (`motivator.jac`)
   - Provides motivation and encouragement
   - Manages gamification elements
   - Tracks engagement levels

### Object-Spatial Graph (OSP)
The system uses an OSP to represent user knowledge and learning relationships:

```python
# OSP Node Types
class OSPNode:
    USER = "user"
    LESSON = "lesson"
    QUIZ = "quiz"
    CONCEPT = "concept"
    SKILL = "skill"

# OSP Edge Types
class OSPEdge:
    PREREQUISITE = "prerequisite"
    MASTERY_SCORE = "mastery_score"
    COMPLETION = "completion"
    SIMILARITY = "similarity"
```

## 🔧 Development Workflow

### Standard Development Process
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and test locally
make init          # Install latest dependencies
make test          # Run tests
make lint          # Check code quality

# 3. Stage and commit changes
git add .
git commit -m "feat: add your feature description"

# 4. Push to GitHub
git push -u origin feature/your-feature-name

# 5. Create Pull Request
# (Do this in GitHub web interface)

# 6. After review and merge
git checkout main
git pull origin main
make clean         # Clean temporary files
```

### Development Commands
```bash
# Environment management
make init          # Install latest dependencies
make run           # Start development servers
make test          # Run all tests
make lint          # Code quality checks
make freeze        # Lock dependency versions
make clean         # Clean temporary files

# Database operations
make migrate       # Run database migrations
make backup        # Create database backup
make restore       # Restore from backup

# Multi-Agent System
make jac-compile   # Compile Jac walkers
make jac-test      # Test Jac walkers
make jac-reload    # Reload Jac walkers

# Deployment
make build         # Build Docker images
make deploy-local  # Deploy to local environment
make deploy-k8s    # Deploy to Kubernetes
```

## 🧪 Testing

### Backend Testing
```bash
# Run all backend tests
cd backend
python manage.py test

# Run specific test class
python manage.py test api.tests.LearningProgressTest

# Run tests with coverage
coverage run --source='.' manage.py test
coverage report

# Run Jac walker tests
cd backend/jac_layer/walkers
jac test evaluator.jac
jac test orchestrator.jac
```

### Frontend Testing
```bash
# Run all frontend tests
cd frontend
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watchAll

# Run specific test file
npm test -- src/components/LearningInterface.test.tsx
```

### Integration Testing
```bash
# Run end-to-end tests
make test-e2e

# Test API endpoints
curl -X GET http://localhost:8000/api/health/
curl -X POST http://localhost:8000/api/learning/init/ \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1}'

# Test WebSocket connection
wscat -c ws://localhost:8000/ws/learning/
```

## 📚 Code Style and Standards

### Python Code Style
```python
# Follow PEP 8 standards
# Use Black for code formatting
black backend/

# Use isort for import sorting
isort backend/

# Use flake8 for linting
flake8 backend/
```

### TypeScript/JavaScript Code Style
```typescript
// Use ESLint and Prettier
npm run lint          # Check code style
npm run lint:fix      # Fix auto-fixable issues
npm run format        # Format code with Prettier
```

### Jac Code Style
```jac
// Follow Jac language conventions
// Use meaningful agent names
@JacWalker
class MyCustomAgent {
    @byLLM
    def my_method(self, param: str) -> Dict[str, Any]:
        # Method implementation
        pass
}
```

## 🔍 Debugging

### Backend Debugging
```bash
# Enable Django debug mode
DEBUG = True  # in .env

# Use Django Debug Toolbar
# Access at http://localhost:8000/__debug__/

# Run with verbose logging
python manage.py runserver --verbosity=2

# Debug specific view
import pdb; pdb.set_trace()  # Add breakpoints
```

### Frontend Debugging
```typescript
// Use React Developer Tools
// Install browser extension for React DevTools

// Debug TypeScript errors
npm run type-check

// Debug build issues
npm run build  # Production build for debugging
```

### Multi-Agent System Debugging
```bash
# Enable JacLang debug mode
export JAC_DEBUG=1

# Test specific agent
jac run orchestrator.jac --debug

# Check agent status
curl -X GET http://localhost:8000/api/agents/status/
```

## 📖 Learning Resources

### Understanding the Technology Stack

#### Django & Python
- [Django Official Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Python Best Practices](https://docs.python.org/3/tutorial/)

#### React & TypeScript
- [React Official Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

#### Jac Programming Language
- [JacLang Documentation](https://jac-lang.org/)
- [Jac Language Tutorial](https://jac-lang.org/tutorial/)
- [Multi-Agent Systems](https://en.wikipedia.org/wiki/Multi-agent_system)

#### DevOps & Deployment
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [CI/CD Best Practices](https://www.atlassian.com/continuous-delivery)

### Internal Documentation
- **Architecture Overview**: System design and component relationships
- **API Reference**: Complete REST API documentation
- **Multi-Agent System**: Detailed agent interactions and capabilities
- **Deployment Guide**: Production deployment procedures

## 🆘 Getting Help

### Common Issues and Solutions

#### Environment Setup Issues
```bash
# Python version not found
pyenv install 3.12.0
pyenv global 3.12.0

# Node.js version issues
nvm install 18
nvm use 18

# Database connection issues
# Check PostgreSQL service
sudo systemctl status postgresql
# Restart if needed
sudo systemctl restart postgresql

# Redis connection issues
redis-cli ping  # Should return PONG
```

#### Common Development Issues
```bash
# Port already in use
lsof -ti:8000 | xargs kill  # Kill process on port 8000

# Database migrations conflicts
python manage.py migrate --fake-initial

# Jac compilation errors
jac check backend/jac_layer/walkers/

# Frontend build issues
rm -rf node_modules package-lock.json
npm install
```

### Communication Channels
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Internal Chat**: Use project communication tools
- **Code Reviews**: Participate in peer code reviews

### When to Ask for Help
- Environment setup after 2+ hours of troubleshooting
- Complex algorithm implementation questions
- Architecture decisions that affect multiple components
- Performance optimization challenges
- Security-related concerns

## 🎯 Next Steps

### Week 1: Environment and Basics
- [x] Complete development environment setup
- [x] Understand project structure and architecture
- [x] Run basic functionality tests
- [x] Review existing documentation

### Week 2: Core Features
- [ ] Explore the Multi-Agent System
- [ ] Understand the Object-Spatial Graph
- [ ] Test API endpoints manually
- [ ] Contribute to documentation

### Week 3: Development
- [ ] Pick a starter issue or feature
- [ ] Implement a small improvement
- [ ] Write tests for your changes
- [ ] Submit your first pull request

### Week 4: Advanced Features
- [ ] Deep dive into specific agents
- [ ] Explore AI integration points
- [ ] Understand deployment processes
- [ ] Contribute to architecture discussions

## 🏆 Success Metrics

### Development Environment Success
- ✅ All services running without errors
- ✅ Tests passing consistently
- ✅ Can create and run basic learning sessions
- ✅ Multi-Agent System functioning properly

### Knowledge Achievement
- ✅ Understand the 6-agent architecture
- ✅ Can navigate and modify Jac walker files
- ✅ Familiar with Django REST API structure
- ✅ Comfortable with React component architecture

### Contribution Readiness
- ✅ Can debug common issues independently
- ✅ Understand code review process
- ✅ Follow established coding standards
- ✅ Ready to take on feature development

---

**Welcome to the Jeseci Interactive Learning Platform team!** 🎉

Start with the basics, ask questions when needed, and don't hesitate to contribute to improving this comprehensive learning environment. We're excited to have you onboard and look forward to your contributions to making adaptive learning accessible and engaging for everyone.