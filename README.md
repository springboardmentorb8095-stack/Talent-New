# TalentLink - Freelancer Marketplace Platform

A full-stack freelancer marketplace platform connecting clients with skilled freelancers. Built with Django REST Framework (backend) and React (frontend).

## Features

- 🔐 **User Authentication**: JWT-based authentication with role-based access (Client/Freelancer)
- 📋 **Project Management**: Clients can post projects, freelancers can browse and apply
- 💼 **Proposal System**: Freelancers submit proposals with pricing and cover letters
- 📝 **Contract Management**: Automated contract creation from accepted proposals
- 💬 **Real-time Messaging**: WebSocket-based chat for contract communication
- ⭐ **Reviews & Ratings**: Post-completion review system
- 🔔 **Notifications**: In-app notifications for important events
- 📊 **Dashboards**: Separate dashboards for clients and freelancers
- 🔍 **Search & Filters**: Advanced project search by skills, budget, duration

## Tech Stack

### Backend
- **Django 6.0** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Production database (SQLite for local dev)
- **JWT Authentication** - Token-based auth
- **Django Channels** - WebSocket support
- **Redis** - Channel layer for WebSockets

### Frontend
- **React 19** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

## Project Structure

```
TalentLink/
├── backend/
│   └── core/
│       ├── accounts/          # Account management (legacy)
│       ├── contracts/         # Contract models & APIs
│       ├── messages/          # Messaging system
│       ├── notifications/     # Notification system
│       ├── profiles/          # User profiles
│       ├── projects/          # Project management
│       ├── proposals/         # Proposal system
│       ├── reviews/           # Review & rating system
│       ├── users/             # User authentication & management
│       └── core/              # Django settings & config
├── frontend/
│   └── src/
│       ├── api/               # API client functions
│       ├── components/        # Reusable components
│       ├── context/           # React context providers
│       ├── hooks/             # Custom React hooks
│       └── pages/             # Page components
├── requirements.txt           # Python dependencies
├── Procfile                  # Deployment configuration
└── runtime.txt               # Python version
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL (for production) or SQLite (for local dev)
- Redis (optional, for WebSockets)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TalentLink
   ```

2. **Set up Backend**
   ```bash
   # Create and activate virtual environment
   python -m venv env
   # Windows
   env\Scripts\activate
   # Mac/Linux
   source env/bin/activate

   # Install dependencies
   cd backend/core
   pip install -r ../../requirements.txt

   # Create .env file (copy from .env.example)
   # Set up environment variables

   # Run migrations
   python manage.py migrate

   # Create superuser
   python manage.py createsuperuser

   # Seed sample data (optional)
   python manage.py seed_data

   # Run development server
   python manage.py runserver
   ```

3. **Set up Frontend**
   ```bash
   cd frontend

   # Install dependencies
   npm install

   # Create .env file with:
   # VITE_API_URL=http://localhost:8000

   # Run development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

### Environment Variables

Create `.env` file in `backend/core/`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=sqlite  # or 'postgresql'
# Add other variables as needed
```

See `backend/core/.env.example` for full list.

## API Endpoints

### Authentication
- `POST /users/register/` - Register new user
- `POST /users/token/` - Get JWT tokens
- `GET /users/me/` - Get current user

### Projects
- `GET /projects/` - List all projects
- `POST /projects/` - Create project (Client only)
- `GET /projects/{id}/` - Get project details
- `PATCH /projects/{id}/` - Update project (Owner only)
- `DELETE /projects/{id}/` - Delete project (Owner only)

### Proposals
- `GET /proposals/` - List proposals
- `POST /proposals/` - Submit proposal (Freelancer only)
- `PATCH /proposals/{id}/status/` - Update proposal status (Client only)

### Contracts
- `GET /contracts/` - List contracts
- `GET /contracts/{id}/` - Get contract details
- `PATCH /contracts/{id}/` - Update contract status

### Notifications
- `GET /api/notifications/` - List notifications
- `PATCH /api/notifications/{id}/mark_read/` - Mark as read
- `GET /api/notifications/unread_count/` - Get unread count

### Reviews
- `POST /reviews/` - Create review
- `GET /reviews/` - List reviews

Full API documentation available at `/api/` when running.

## Running Tests

```bash
cd backend/core
python manage.py test
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy Options:**
- **Backend**: Render.com or Heroku
- **Frontend**: Vercel or Netlify
- **Database**: Render PostgreSQL (free tier)
- **Redis**: Upstash or Redis Cloud (free tier)

## User Roles

### Client
- Post projects
- Review proposals
- Accept/reject proposals
- Manage contracts
- Leave reviews

### Freelancer
- Browse projects
- Submit proposals
- Manage contracts
- Submit work
- Receive reviews

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review API documentation at `/api/`
- Check test files for usage examples

---

Built with ❤️ using Django and React
