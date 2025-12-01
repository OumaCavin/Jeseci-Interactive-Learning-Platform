# Jeseci Interactive Learning Platform

A production-ready, enterprise-grade Multi-Agent System (MAS) for adaptive learning built with Jac Programming Language, Django, and React.

## 🏗️ Architecture Overview

This platform implements a 3-Tier architecture:
- **Presentation Tier**: React frontend with interactive code editor
- **Application Tier**: Django REST Framework API
- **Data & Logic Tiers**: JacLang-based Multi-Agent System with Object-Spatial Graph (OSP)

### Multi-Agent System (MAS)

The system features 6 specialized agents implemented as Jac walkers:

1. **SystemOrchestrator**: Coordinates all agents and manages workflows
2. **ContentCurator**: Manages learning materials and content quality
3. **QuizMaster**: Generates adaptive quizzes using byLLM
4. **Evaluator**: Provides intelligent code evaluation with Cavin Otieno's methodology
5. **ProgressTracker**: Monitors learning progress and generates analytics
6. **Motivator**: Provides encouragement, gamification, and achievement tracking

## 🚀 Quick Start

### Prerequisites

- **WSL (Windows Subsystem for Linux)** - Required for development environment
- **Python >=3.12** 
- **Node.js 16+**
- **Redis** (for Celery background tasks)

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/OumaCavin/Jeseci-Learning-Platform.git
cd Jeseci-Interactive-Learning-Platform

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 2. Backend Setup (Django + JacLang)

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Setup Django
python manage.py makemigrations api
python manage.py migrate
python manage.py createsuperuser  # Optional: Create admin user

# Create necessary directories
mkdir -p logs static media
```

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd ../frontend

# Install Node.js dependencies
npm install

# Create React environment file
echo "REACT_APP_API_URL=http://localhost:8000" > .env
```

### 4. Start Services

**Terminal 1 - Django Backend:**
```bash
cd backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2 - Celery Worker:**
```bash
cd backend
source venv/bin/activate
celery -A jac_platform worker -l info
```

**Terminal 3 - React Frontend:**
```bash
cd frontend
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **API Documentation**: http://localhost:8000/api/schema/
- **Admin Panel**: http://localhost:8000/admin/

## 📚 Learning Features

### Core Learning Flow

1. **User Initialization**: SystemOrchestrator creates Object-Spatial Graph (OSP)
2. **Content Retrieval**: ContentCurator manages lesson content and prerequisites
3. **Adaptive Quizzes**: QuizMaster generates personalized quizzes using byLLM
4. **Intelligent Evaluation**: Evaluator (Cavin Otieno methodology) assesses submissions
5. **Progress Tracking**: ProgressTracker monitors learning patterns and gaps
6. **Motivation**: Motivator provides gamification and encouragement

### Key Learning Endpoints

```
POST /api/init_learning/           # Initialize user OSP graph
GET  /api/get_lesson/<id>/         # Retrieve lesson content
GET  /api/request_quiz/<topic>/    # Generate adaptive quiz
POST /api/submit_answer/           # Submit answer for evaluation
GET  /api/skill_map/               # Get skill visualization data
```

## 🎯 Adaptive Learning System

### Object-Spatial Graph (OSP)

The platform uses an OSP to model user mastery:
- **Nodes**: User, Lesson, Quiz, Concept
- **Edges**: prerequisite, mastery_score, completion
- **Mastery Tracking**: Real-time updates to concept mastery levels

### byLLM Integration

Advanced AI features powered by byLLM:
- **Dynamic Quiz Generation**: Questions adapt to user mastery level
- **Intelligent Evaluation**: Code and text assessment with detailed feedback
- **Personalized Content**: Learning materials adapted to individual needs
- **Real-time Feedback**: Contextual guidance during learning sessions

## 🏆 Evaluation Methodology

### Cavin Otieno's Evaluation System

The Evaluator agent implements Cavin Otieno's comprehensive assessment methodology:

- **Multi-dimensional Assessment**: Technical accuracy, code quality, problem-solving, communication
- **Constructive Feedback**: Specific, actionable, and encouraging guidance
- **Growth Mindset Focus**: Emphasizes improvement potential over fixed ability
- **Personalized Approach**: Considers individual learning patterns and progress
- **Progressive Challenge**: Gradually increases complexity based on capability

### Scoring Framework

```python
# Example evaluation breakdown
{
    'technical_accuracy': 0.3,      # 30% - Code correctness and syntax
    'code_quality': 0.25,           # 25% - Structure and best practices  
    'problem_solving': 0.25,        # 25% - Logic and approach
    'communication': 0.2            # 20% - Clarity and explanation
}
```

## 🔧 Development Setup

### Git Configuration

```bash
# Configure Git (replace with your details)
git config user.name "OumaCavin"
git config user.email "cavin.otieno012@gmail.com"

# Create and switch to main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/OumaCavin/Jeseci-Learning-Platform.git
```

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to GitHub
git push -u origin feature/your-feature-name

# Create Pull Request
# After review and merge to main:
git checkout main
git pull origin main
```

### Jac Development

Jac walker files are located in `backend/jac_layer/walkers/`:
- `orchestrator.jac` - SystemOrchestrator agent
- `content_curator.jac` - ContentCurator agent  
- `quiz_master.jac` - QuizMaster agent
- `evaluator.jac` - Evaluator agent (Cavin Otieno methodology)
- `progress_tracker.jac` - ProgressTracker agent
- `motivator.jac` - Motivator agent

### Hot Reload Configuration

Jac files support hot reloading:
```bash
# Monitor Jac file changes
watch -n 5 'ls -la backend/jac_layer/walkers/'

# Manual reload (if needed)
python manage.py shell
>>> from jac_layer.jac_manager import jac_manager
>>> jac_manager.reload_walkers()
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run Django tests
python manage.py test api

# Run specific test class
python manage.py test api.tests.LearningProgressTest

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Testing

```bash
cd frontend

# Run React tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watchAll
```

### API Testing

```bash
# Test API endpoints
curl -X POST http://localhost:8000/api/init_learning/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Test with authentication
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

## 🚢 Production Deployment

### Docker Deployment

```dockerfile
# Dockerfile example for production
FROM python:3.11-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .
EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
```

### Environment Configuration

Production environment variables:
```bash
# Production .env
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://redis-server:6379/0
```

### Deployment Options

**Option 1: Cloud Deployment**
- Frontend: Vercel/Netlify
- Backend: AWS/GCP/Heroku
- Database: PostgreSQL on AWS RDS
- Redis: AWS ElastiCache

**Option 2: Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
    depends_on:
      - redis
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  redis:
    image: redis:alpine
    
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: jac_platform
      POSTGRES_USER: jac_user
      POSTGRES_PASSWORD: jac_password
```

## 📊 Monitoring and Analytics

### Health Check Endpoints

```bash
# System health check
curl http://localhost:8000/api/health/

# System statistics
curl http://localhost:8000/api/stats/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🏢 Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed production deployment instructions.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Cavin Otieno and the Jeseci Learning Platform Team**