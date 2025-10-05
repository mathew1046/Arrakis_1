# ProdSight - AI-Powered Film Production Management

ProdSight is a comprehensive film production management system that unifies pre-production, production, post-production, and distribution into a single platform with role-based dashboards and AI-powered features.

## Features

### 🎬 Role-Based Dashboards
- **Producer**: Task assignment, budget management, and crew scheduling
- **Production Manager**: Full project oversight with budget, tasks, and progress tracking
- **Director**: Script management, AI breakdown, and scene approval
- **Crew**: Personal task management and asset uploads
- **VFX**: VFX pipeline management with version control

### 🤖 AI-Powered Features
- **Script Breakdown**: Automatically parse scripts into scenes with character, prop, and location detection
- **Budget Forecasting**: Predict budget overruns and get optimization suggestions
- **Task Assignment**: Intelligent crew assignment based on skills and availability
- **Conflict Resolution**: Detect scheduling conflicts and propose solutions
- **Report Generation**: Auto-generate comprehensive production reports

### 📊 Core Functionality
- **Kanban Task Board**: Drag-and-drop task management with real-time updates
- **Budget Management**: Visual budget tracking with category breakdowns and alerts
- **Script Management**: Upload, analyze, and manage scripts with AI assistance
- **Asset Management**: Drag-and-drop file uploads with categorization
- **VFX Pipeline**: Shot tracking, version management, and review workflows
- **Analytics & Reports**: Comprehensive reporting with AI-generated insights

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with dark mode support
- **Routing**: React Router v6
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit/core
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prodsight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Credentials

The application includes demo users for testing different roles:

| Role | Username | Password |
|------|----------|----------|
| Producer | `producer` | `password123` |
| Production Manager | `prodmanager` | `password123` |
| Director | `director` | `password123` |
| Crew | `crew` | `password123` |
| VFX | `vfx` | `password123` |

## Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── client.ts          # Mock API client with localStorage
│   ├── endpoints.ts       # API endpoint definitions
│   └── aiMock.ts         # AI service mocks
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── charts/           # Chart components
│   ├── dashboard/        # Dashboard-specific components
│   ├── kanban/           # Kanban board components
│   ├── layout/           # Layout components (Sidebar, Topbar)
│   └── ui/               # Base UI components (Button, Modal)
├── data/                 # Mock JSON data
│   ├── users.json        # User accounts and roles
│   ├── tasks.json        # Task data
│   ├── budget.json       # Budget information
│   ├── script.json       # Script and scene data
│   └── vfx.json         # VFX shots and versions
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useTasks.ts       # Task management hook
│   ├── useBudget.ts      # Budget management hook
│   ├── useScript.ts      # Script management hook
│   └── useAI.ts          # AI features hook
├── pages/                # Page components
│   ├── Auth/             # Login page
│   ├── Dashboard/        # Role-based dashboards
│   ├── Tasks/            # Kanban task board
│   ├── Budget/           # Budget management
│   ├── Script/           # Script management
│   ├── Assets/           # Asset management
│   ├── VFX/              # VFX pipeline
│   └── Reports/          # Analytics and reports
├── providers/            # React context providers
│   ├── AuthProvider.tsx  # Authentication context
│   └── NotificationProvider.tsx # Notification context
└── utils/                # Utility functions
    ├── permissions.ts    # Role-based permissions
    ├── formatters.ts     # Data formatting utilities
    └── validators.ts     # Form validation schemas
```

## Key Features Explained

### Role-Based Access Control
The application implements a comprehensive permission system where each role has specific access rights:
- Routes are protected based on user permissions
- UI elements are conditionally rendered based on roles
- API endpoints respect role-based access patterns

### Mock Data & API Simulation
- All data is stored in JSON files and localStorage
- API calls are simulated with realistic delays
- Data persists across browser sessions
- Easy to replace with real backend endpoints

### AI Integration Ready
- AI features are implemented as mock services
- Easy to swap with real AI/ML endpoints
- Consistent interface for all AI operations
- Proper loading states and error handling

### Responsive Design
- Mobile-first approach with TailwindCSS
- Dark mode support throughout the application
- Optimized for both desktop and mobile workflows
- Accessible design patterns

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Pages**: Add to `src/pages/` and update routing in `App.tsx`
2. **New Components**: Add to appropriate `src/components/` subdirectory
3. **New API Endpoints**: Add to `src/api/endpoints.ts`
4. **New Permissions**: Update `src/utils/permissions.ts`

### Customization

- **Styling**: Modify `tailwind.config.js` for theme customization
- **Mock Data**: Update JSON files in `src/data/` directory
- **AI Features**: Replace mock implementations in `src/api/aiMock.ts`
- **Permissions**: Modify role definitions in `src/utils/permissions.ts`

## Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] Integration with actual AI/ML services
- [ ] File storage integration (AWS S3, etc.)
- [ ] Advanced reporting and analytics
- [ ] Mobile app companion
- [ ] Third-party integrations (Slack, Jira, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**ProdSight** - Streamlining film production with AI-powered intelligence.
