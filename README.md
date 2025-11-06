# n8n Dashboard

A Next.js dashboard for managing n8n workflows. View, monitor, and edit your n8n workflow configurations from a modern web interface.

## Features

- View all workflows in a card-based dashboard
- Toggle workflows active/inactive status
- Edit workflow configurations (name, settings)
- View workflow details (nodes count, creation date, etc.)
- Dark mode support
- Responsive design with Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+ installed
- An n8n instance with API access
- n8n API key (get it from Settings > n8n API in your n8n instance)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure your n8n instance:

Edit `.env.local` file and add your n8n credentials:

```env
N8N_BASE_URL=https://ryzebeyond.app.n8n.cloud
N8N_API_KEY=your_api_key_here
```

To get your API key:
- Open your n8n instance
- Go to Settings > n8n API
- Generate or copy your API key

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Dashboard Page (/)

- View all your workflows in card format
- See workflow status (Active/Inactive)
- Toggle workflow status directly from cards
- Click on workflow name to edit details
- Refresh button to reload workflows

### Workflow Edit Page (/workflows/[id])

Edit workflow configurations:
- Change workflow name
- Toggle active status
- Configure execution settings:
  - Save error executions
  - Save success executions
  - Save manual executions
- View workflow metadata (ID, nodes count, dates)

## API Endpoints

The dashboard uses Next.js API routes to communicate with n8n:

- `GET /api/workflows` - List all workflows
- `GET /api/workflows/[id]` - Get workflow details
- `PUT /api/workflows/[id]` - Update workflow

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- n8n REST API

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── workflows/          # API routes
│   ├── workflows/
│   │   └── [id]/              # Workflow edit page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Dashboard page
│   └── globals.css            # Global styles
├── components/
│   └── WorkflowCard.tsx       # Workflow card component
├── lib/
│   └── n8n-client.ts          # n8n API client
├── types/
│   └── n8n.ts                 # TypeScript types
└── .env.local                 # Environment variables
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- The dashboard uses server-side API routes to securely communicate with n8n
- Your API key is never exposed to the client
- All API calls are proxied through Next.js API routes
- The interface supports both light and dark mode

## License

MIT
