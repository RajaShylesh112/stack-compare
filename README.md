# StackCompare - AI-Powered Technology Stack Recommender

A modern, AI-powered technology stack recommendation platform built with Next.js, Mistral AI, and Appwrite. Get intelligent technology suggestions based on your project requirements, team size, and experience level.

## ✨ Features

- **🤖 AI-Powered Recommendations**: Intelligent technology stack suggestions using Mistral AI
- **🎯 Project-Specific Analysis**: Tailored recommendations based on project type, requirements, and constraints
- **🔍 Technology Comparison**: Compare different technology stacks side-by-side
- **💾 Stack Management**: Save and organize your favorite technology combinations
- **👥 User Profiles**: Personalize recommendations based on your experience level
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **⚡ Real-time Analysis**: Instant recommendations with detailed reasoning

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Next.js       │    │   Python AI     │
│   Frontend      │◄──►│   API Routes    │◄──►│   Service       │
│   Port 3000     │    │   Port 3000     │    │   Port 8000     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                              ┌─────────▼─────────┐
                                              │   Mistral AI      │
                                              │   API Service     │
                                              └───────────────────┘
                                                        │
                                              ┌─────────▼─────────┐
                                              │   Appwrite        │
                                              │   Database        │
                                              └───────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query** for state management
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for backend functionality
- **Python FastAPI** for AI services
- **Mistral AI** for intelligent recommendations
- **Appwrite** for user management and data storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Mistral AI API key (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stack-compare
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd python-api
   pip install -r requirements.txt
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Required for AI features
   MISTRAL_API_KEY=your_mistral_api_key_here
   
   # Optional: Appwrite for data persistence
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_API_KEY=your_api_key
   APPWRITE_DATABASE_ID=your_database_id
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Start Next.js frontend
   npm run dev
   
   # Terminal 2: Start Python AI service
   cd python-api
   python simple_main.py
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Python AI API: http://localhost:8000/health

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── ai-recommendations/ # AI recommendations page
│   ├── stack-builder/     # Manual stack builder
│   ├── compare-stacks/    # Stack comparison
│   ├── resources/         # Learning resources
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Navigation header
│   └── Footer.tsx        # Footer component
├── lib/                  # Utility functions and hooks
├── python-api/           # Python FastAPI service
│   ├── simple_main.py    # Main FastAPI app with Mistral AI
│   └── requirements.txt  # Python dependencies
└── shared/               # Shared types and utilities
```

## 🔧 API Endpoints

### Frontend Routes
- `/` - Home page with quick start
- `/ai-recommendations` - AI-powered recommendations
- `/stack-builder` - Manual stack builder
- `/compare-stacks` - Stack comparison
- `/resources` - Learning resources

### API Routes
- `GET /api/health` - Health check
- `POST /api/ai/recommend-stack` - Get AI recommendations
- `GET /api/ai/supported-technologies` - List available technologies
- `POST /api/ai/analyze-compatibility` - Analyze tech compatibility
- `GET /api/ai/status` - AI service status

## 🤖 AI Features

### Mistral AI Integration
- **Intelligent Recommendations**: Context-aware technology suggestions
- **Project Analysis**: Detailed analysis based on requirements and constraints
- **Compatibility Scoring**: Evaluate how well technologies work together
- **Learning Curve Assessment**: Estimate time to learn new technologies

### Technology Knowledge Base
The AI service includes comprehensive knowledge of:
- **Frontend**: React, Vue.js, Angular, Svelte, Next.js
- **Backend**: Node.js, Python, Go, Java, .NET
- **Databases**: PostgreSQL, MongoDB, MySQL, Redis, Appwrite
- **Mobile**: React Native, Flutter, Swift, Kotlin
- **Cloud**: AWS, Google Cloud, Azure, Vercel, Netlify

## 💾 Data Storage

### Appwrite Integration
- **User Management**: Complete user profiles and authentication
- **Stack Storage**: Save and retrieve technology combinations
- **Real-time Sync**: Automatic data synchronization
- **Scalable**: Cloud-hosted with automatic scaling

### Fallback Mode
If Appwrite is not configured, the app automatically uses in-memory storage for development and testing.

## 🚀 Deployment

### Docker Deployment (Recommended)
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### Vercel Deployment
1. Deploy Next.js frontend to Vercel
2. Use Vercel Edge Functions for API routes
3. Deploy Python AI service separately
4. Configure environment variables

### Manual VPS Deployment
1. Deploy Next.js to your VPS
2. Run Python AI service as a separate process
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

## 🔑 Required API Keys

### Mistral AI (Required for AI Features)
- Get your API key from [Mistral AI Console](https://console.mistral.ai/)
- Used for intelligent technology recommendations
- Without this key, the app uses basic fallback recommendations

### Appwrite (Optional)
- Create a free account at [Appwrite Cloud](https://cloud.appwrite.io)
- Used for user data persistence and authentication
- See [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) for detailed setup

## 🧪 Testing

### API Testing
```bash
# Health check
curl http://localhost:3000/api/health

# AI recommendation
curl -X POST http://localhost:3000/api/ai/recommend-stack \
  -H "Content-Type: application/json" \
  -d '{
    "project_type": "web-app",
    "requirements": ["scalability", "real-time"],
    "team_size": 3,
    "experience_level": "intermediate"
  }'
```

### Expected Response
The AI service returns structured recommendations with:
- Technology selections (frontend, backend, database)
- Detailed reasoning for each choice
- Pros and cons analysis
- Learning curve assessments
- Time estimates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](./docs) folder
- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join community discussions on GitHub

## 🙏 Acknowledgments

- [Mistral AI](https://mistral.ai/) for powerful AI capabilities
- [Appwrite](https://appwrite.io/) for scalable backend services
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing React framework