# Mitra Frontend - Mental Health AI Companion

A React-based frontend application for Mitra, an AI-powered mental health chatbot that provides 24/7 support, crisis detection, and personalized care.

## Features

### 🤖 AI-Powered Chat
- Real-time conversations with AI mental health companion
- Context-aware responses based on user history
- Mood tracking and emotional analysis
- WebSocket integration for instant messaging

### 🚨 Crisis Detection & Support
- Automatic detection of crisis-related keywords
- Immediate display of emergency resources
- Crisis alert system with professional intervention
- Country-specific emergency contacts

### 📊 Mental Health Analytics
- Mood tracking over time with interactive charts
- Session history and progress monitoring
- Key topic analysis and patterns
- Personalized dashboard with insights

### 🔐 Secure Authentication
- JWT-based authentication system
- Protected routes and user sessions
- Profile management and preferences
- Account deletion and data privacy

### 📱 Responsive Design
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities
- Touch-friendly interface
- Accessibility compliant

## Tech Stack

- **React 18** - Frontend framework
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **Recharts** - Charts and data visualization
- **React Hot Toast** - Notification system
- **Lucide React** - Icon library
- **Date-fns** - Date manipulation utilities

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mitra-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_SOCKET_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Chat/           # Chat interface components
│   ├── Common/         # Shared components (Button, Loading, etc.)
│   ├── Crisis/         # Crisis support components
│   └── Dashboard/      # Analytics and dashboard components
│
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state management
│   └── ChatContext.js  # Chat state management
│
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication hook
│   └── useChat.js      # Chat functionality hook
│
├── pages/              # Main page components
│   ├── HomePage.jsx    # Landing page
│   ├── LoginPage.jsx   # Authentication page
│   ├── ChatPage.jsx    # Main chat interface
│   ├── DashboardPage.jsx # Analytics dashboard
│   └── ProfilePage.jsx # User profile management
│
├── services/           # API and external services
│   ├── api.js          # API client and endpoints
│   ├── auth.js         # Authentication service
│   └── websocket.js    # WebSocket connection management
│
├── utils/              # Utility functions and constants
│   ├── constants.js    # App constants and enums
│   ├── helpers.js      # Helper functions
│   └── formatters.js   # Data formatting utilities
│
└── styles/             # CSS and styling
    ├── globals.css     # Global styles and Tailwind imports
    └── components.css  # Component-specific styles
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## Key Components

### Authentication Flow
```jsx
// Login/Register with validation
const { login, register, logout } = useAuth();
await login(email, password);
```

### Chat Interface
```jsx
// Send messages with crisis detection
const { sendMessage, messages } = useChat();
await sendMessage("I'm feeling anxious about work");
```

### Crisis Detection
```jsx
// Automatic crisis keyword detection
const hasCrisis = detectCrisisKeywords(message);
if (hasCrisis) {
  // Show crisis resources automatically
}
```

### Data Visualization
```jsx
// Mood tracking charts
<MoodChart sessions={recentSessions} />
```

## Configuration

### Environment Variables
- `REACT_APP_API_URL` - Backend API base URL
- `REACT_APP_SOCKET_URL` - WebSocket server URL

### Crisis Support Configuration
Update `src/utils/constants.js` to modify crisis keywords and emergency contacts for different regions.

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Protected route components
- Input sanitization
- XSS protection
- CSRF token support

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

## Crisis Support Integration

The app includes comprehensive crisis support features:

- **Keyword Detection**: Automatically detects crisis-related language
- **Emergency Resources**: Displays relevant emergency contacts
- **Crisis Alerts**: Visual and audio alerts for immediate attention
- **Professional Integration**: Connects users with mental health professionals

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Popular Platforms
- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop build folder
- **AWS S3**: Upload build files to S3 bucket
- **Docker**: Use provided Dockerfile

### Environment-specific Builds
```bash
# Staging
REACT_APP_API_URL=https://api-staging.mitra.com npm run build

# Production  
REACT_APP_API_URL=https://api.mitra.com npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support & Crisis Resources

### Immediate Help
- **Emergency**: 911 (US) / 112 (EU)
- **Crisis Line**: 988 (US)
- **Text Support**: Text HOME to 741741

### Development Support
- Create an issue for bugs or feature requests
- Check the documentation for API integration
- Join our community discussions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Important Notice

**This application is designed to provide support and resources, but it is not a replacement for professional mental health care. If you are experiencing a mental health emergency, please contact emergency services immediately.**

---

Made with ❤️ for mental health awareness and support.