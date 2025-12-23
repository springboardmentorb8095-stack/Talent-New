# Freelance Marketplace Platform

A full-stack web application connecting freelancers with clients for project-based work. Built with Django REST Framework (backend) and React (frontend).

## Features

### Core Functionality
- **User Authentication**: JWT-based authentication with separate client and freelancer profiles
- **Project Management**: Create, browse, and manage freelance projects
- **Proposal System**: Freelancers can submit proposals with custom pricing and timelines
- **Contract Management**: Formal agreements between clients and freelancers
- **Messaging System**: Real-time communication between users
- **Review & Rating**: Comprehensive feedback system for completed projects
- **Notifications**: Email notifications for important events

### User Roles
- **Clients**: Post projects, review proposals, hire freelancers, manage contracts
- **Freelancers**: Browse projects, submit proposals, deliver work, build reputation

## Tech Stack

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: PostgreSQL (production) / SQLite (development)
- **Server**: Gunicorn
- **Static Files**: WhiteNoise

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router 6.20.0
- **HTTP Client**: Axios 1.6.2
- **Styling**: CSS3

### Testing
- **Backend**: Pytest, pytest-django, pytest-cov
- **Frontend**: Jest, React Testing Library

## Quick Start

**Want to get started quickly?** See [QUICKSTART.md](QUICKSTART.md) for a 10-minute setup guide.

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (for production)

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd freelance-marketplace
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser (optional)**
```bash
python manage.py createsuperuser
```

7. **Load sample data (optional)**
```bash
python manage.py seed_data
```

8. **Run development server**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in frontend directory
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
```

4. **Run development server**
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## Testing

### Run All Tests
```bash
# Backend tests
pytest --cov=. --cov-report=html

# Frontend tests
cd frontend
npm test

# Or use the test runner scripts
./run_tests.sh      # Linux/Mac
run_tests.bat       # Windows
```

### Test Coverage
- Backend coverage report: `htmlcov/index.html`
- Frontend coverage report: `frontend/coverage/lcov-report/index.html`

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing documentation.

## API Documentation

### Authentication Endpoints
- `POST /api/accounts/register/` - Register new user
- `POST /api/accounts/login/` - Login user
- `GET /api/accounts/profile/` - Get user profile
- `PATCH /api/accounts/profile/` - Update user profile

### Project Endpoints
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create new project
- `GET /api/projects/{id}/` - Get project details
- `PATCH /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

### Proposal Endpoints
- `GET /api/proposals/` - List proposals
- `POST /api/proposals/` - Submit proposal
- `GET /api/proposals/{id}/` - Get proposal details
- `PATCH /api/proposals/{id}/` - Update proposal
- `POST /api/proposals/{id}/accept/` - Accept proposal

### Contract Endpoints
- `GET /api/contracts/` - List contracts
- `GET /api/contracts/{id}/` - Get contract details
- `PATCH /api/contracts/{id}/` - Update contract status

### Messaging Endpoints
- `GET /api/messages/` - List conversations
- `POST /api/messages/` - Send message
- `GET /api/messages/conversation/{user_id}/` - Get conversation

### Review Endpoints
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Submit review
- `GET /api/reviews/user/{user_id}/` - Get user reviews

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions covering:
- Render deployment
- Heroku deployment
- AWS deployment
- Environment configuration
- Database setup
- Static file handling

## Project Structure

```
freelance-marketplace/
├── accounts/              # User authentication and profiles
├── projects/              # Project management
├── proposals/             # Proposal system
├── contracts/             # Contract management
├── messaging/             # Messaging system
├── reviews/               # Review and rating system
├── freelance_marketplace/ # Django project settings
├── frontend/              # React frontend application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       └── __tests__/
├── .github/               # GitHub Actions CI/CD
├── requirements.txt       # Python dependencies
├── pytest.ini            # Pytest configuration
├── .gitignore            # Git ignore rules
└── manage.py             # Django management script
```

## Development Workflow

### Creating a New Feature

1. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Write tests first** (TDD approach)
```bash
# Create test file
touch app_name/tests/test_your_feature.py
# Write tests
pytest app_name/tests/test_your_feature.py
```

3. **Implement the feature**
```bash
# Write code to make tests pass
pytest
```

4. **Run all tests**
```bash
./run_tests.sh
```

5. **Commit and push**
```bash
git add .
git commit -m "Add your feature description"
git push origin feature/your-feature-name
```

### Code Quality

```bash
# Format code
black .

# Sort imports
isort .

# Check for issues
flake8 .

# Run security checks
safety check
```

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

**Quick Start**:
1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Implement your changes
5. Ensure all tests pass
6. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Documentation

📚 **[Documentation Index](DOCUMENTATION_INDEX.md)** - Complete guide to all documentation

### Quick Links
- [Quick Start Guide](QUICKSTART.md) - Get started in 10 minutes
- [Project Overview](PROJECT_OVERVIEW.md) - Visual project overview
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Deploy to production
- [Testing Guide](TESTING_GUIDE.md) - Testing documentation
- [Database Schema](DATABASE_SCHEMA.md) - Database structure
- [Complete Features](COMPLETE_FEATURES_SUMMARY.md) - All features
- [Project Status](FINAL_PROJECT_STATUS.md) - Current status

## Additional Resources

- 🗺️ [Roadmap](ROADMAP.md) - Future plans and features
- 📝 [Changelog](CHANGELOG.md) - Version history
- 🔒 [Security Policy](SECURITY.md) - Security guidelines
- 🤝 [Contributing Guide](CONTRIBUTING.md) - How to contribute

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Roadmap

### Completed ✅
- User authentication and profiles
- Project CRUD operations
- Proposal submission and management
- Contract system
- Messaging functionality
- Review and rating system
- Email notifications
- Production deployment configuration
- Testing infrastructure

### Planned 🔄
- Payment processing integration
- Real-time notifications (WebSockets)
- Advanced search and filtering
- File upload for project attachments
- Admin dashboard
- Analytics and reporting
- Mobile app
- Multi-language support

---

**Built with ❤️ using Django and React**
