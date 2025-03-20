# NIT Agartala Research Satellite Team Recruitment

![Research Satellite](./generated-icon.png)

A full-fledged satellite team recruitment website with interactive 3D visualization, application submission system, and admin management for NIT Agartala's research satellite project.

## Features

- **Interactive 3D Satellite Model**: Visualize the satellite with clickable components representing different departments
- **Department Selection**: Choose from 4 critical satellite subsystems:
  - Power System
  - On-Board Computer
  - Communication System
  - Attitude Determination & Control System
- **Application Submission**: Easy to use form for B.Tech students to join the research team
- **Admin Panel**: Secure admin interface to view and manage applications
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, ThreeJS, TanStack Query
- **Backend**: Express, TypeScript, Drizzle ORM
- **Database**: PostgreSQL
- **Deployment**: Netlify (with serverless functions)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nit-agartala-satellite.git
cd nit-agartala-satellite
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/satellite_db
SESSION_SECRET=your_secret_key
```

4. Initialize the database:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

## Deployment

### Netlify One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/nit-agartala-satellite)

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to any static hosting service
3. Set up a PostgreSQL database and configure the environment variables

## Admin Access

The default admin credentials are:
- Username: `admin`
- Password: `satellite123`

**Important**: Change these credentials in production!

## License

MIT License - See the LICENSE file for details

## Acknowledgments

- This project was created for NIT Agartala's Research Satellite initiative
- Special thanks to the contributors and the faculty advisors