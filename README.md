# IT Platform Bangladesh

A comprehensive online platform for selling software, web applications, and AI agents with a full-featured team dashboard for managing workflow, CRM, scheduling, content publishing, and lead generation.

## Features

### Public Website
- Modern, responsive landing page
- Service showcase
- Product catalog with categories
- Contact form with automatic lead capture
- Smooth animations and professional design

### Team Dashboard
Comprehensive dashboard with the following modules:

#### 1. Overview Dashboard
- Real-time statistics (leads, projects, tasks, revenue)
- Recent activity tracking
- Upcoming events display

#### 2. Lead Management
- Lead tracking and status management
- Priority assignment
- Lead source tracking
- Contact history
- AI-powered 24/7 lead capture

#### 3. CRM (Customer Relationship Management)
- Customer database
- Interaction tracking
- Customer segmentation
- Status management
- Contact history

#### 4. Project Management
- Project creation and tracking
- Status monitoring
- Priority management
- Due date tracking
- Customer assignment

#### 5. Task Management
- Kanban board (To Do, In Progress, Completed)
- Task assignment to team members
- Priority and deadline management
- Project association

#### 6. Schedule & Calendar
- Event creation and management
- Meeting scheduling
- Participant management
- Event types and locations

#### 7. Content Manager (Social Media)
- Multi-platform content scheduling (Facebook, LinkedIn, YouTube, Instagram)
- Content templates
- Post status tracking
- Scheduled publishing
- Platform-specific analytics

#### 8. Email Templates
- Template library
- Variable support
- Category organization
- Email campaign management

#### 9. Product Management
- Product catalog management
- Pricing and inventory
- Featured products
- Category assignment

#### 10. Order Management
- Order tracking
- Payment status monitoring
- Customer order history

#### 11. Team Management
- Team member profiles
- Role assignment
- Department organization
- Activity status

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Bootstrap Icons
- **Styling**: Custom CSS with Bootstrap framework

## Database Schema

The platform uses a comprehensive database schema with the following main tables:

- `categories` - Product/service categories
- `products` - Product listings
- `customers` - Customer database
- `leads` - Lead tracking
- `orders` - Order management
- `team_members` - Team profiles
- `projects` - Project tracking
- `tasks` - Task management
- `schedules` - Calendar events
- `content_posts` - Social media content
- `email_templates` - Email templates
- `email_campaigns` - Campaign tracking

All tables include Row Level Security (RLS) for data protection.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are pre-configured in `.env` file

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage

### Public Website
- Access the landing page at `/`
- Browse services and products
- Submit contact form to generate leads

### Team Dashboard
- Register or login at `/login.html`
- Access dashboard at `/dashboard.html`
- Navigate between modules using the sidebar

### Lead Generation
The platform automatically captures leads from:
- Contact form submissions
- User registrations
- Product inquiries

All leads are stored in the database with:
- Contact information
- Source tracking
- Status management
- Priority assignment

## Security

- All database tables have Row Level Security (RLS) enabled
- Authentication required for dashboard access
- Secure password handling via Supabase Auth
- Protected API endpoints

## Features in Detail

### AI Content Management
- Schedule posts across multiple platforms
- Use templates for consistent messaging
- Track post performance
- Manage social media accounts

### Email System
- Create reusable templates
- Personalize with variables
- Track campaign performance
- Segment recipients

### Workflow Management
- Visual task boards
- Team collaboration
- Progress tracking
- Deadline management

### CRM Features
- Complete customer profiles
- Interaction history
- Communication tracking
- Customer segmentation

## Support

For support and inquiries:
- Email: info@itpbd.com
- Phone: +880 1234-567890
- Location: Dhaka, Bangladesh

## License

Licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for UI components
- Supabase for backend infrastructure
- Pexels for stock images
