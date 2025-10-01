# Aurore: Gestion du Petit-Déjeuner

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Zhakaria-kone/pointage-du-jour)

A minimalist, high-performance web application for a 4-star hotel to seamlessly manage and track its daily breakfast service.

Aurore is a streamlined application designed for a 4-star hotel to manage its daily breakfast service. The application provides an intuitive interface for front-of-house staff to check in guests by room number, preventing duplicate entries for the same day. It features a real-time dashboard displaying the number of guests served and a detailed list of checked-in rooms with timestamps. The system automatically handles daily sessions, resetting room statuses each morning. A comprehensive history module allows management to review and export reports from previous days for operational analysis. The entire experience is built on Cloudflare's edge network, ensuring instantaneous response times critical for a fast-paced restaurant environment.

## Key Features

- **Daily Room Check-in**: Quickly check in guests by entering their room number.
- **Duplicate Prevention**: A room number can only be checked in once per day.
- **Real-time Dashboard**: View a live count of served guests and a list of checked-in rooms with timestamps.
- **Automatic Daily Reset**: The system automatically starts a new session each day, resetting all room statuses.
- **Service History**: Access and review detailed reports from previous days.
- **Printable Reports**: Generate clean, printable summaries for any given day's service.
- **Minimalist UI**: A clean, fast, and intuitive interface designed for high-pressure environments.

## Technology Stack

- **Frontend**: React, Vite, React Router, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React, Framer Motion
- **Backend**: Hono running on Cloudflare Workers
- **State Management**: Cloudflare Durable Objects
- **Forms & Validation**: React Hook Form, Zod
- **Utilities**: date-fns, Sonner (for notifications)
- **Language**: TypeScript

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) package manager
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) logged into your Cloudflare account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd aurore_breakfast_manager
    ```

2.  **Install dependencies using Bun:**
    ```bash
    bun install
    ```

## Development

To start the local development server, which runs both the Vite frontend and the Hono backend on Cloudflare Workers locally, run the following command:

```bash
bun dev
```

The application will be available at `http://localhost:3000` (or the next available port). The backend API will be accessible from the same origin.

## Deployment

This project is configured for seamless deployment to Cloudflare's global network.

1.  **Build the application:**
    The `deploy` script automatically builds the project first.

2.  **Deploy to Cloudflare:**
    Run the following command and follow the Wrangler CLI prompts:
    ```bash
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Zhakaria-kone/pointage-du-jour)

## Project Structure

-   `src/`: Contains the frontend React application code, including pages, components, hooks, and utilities.
-   `worker/`: Contains the backend Hono application code, including routes and Durable Object entity definitions.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and the worker.

## License

This project is licensed under the MIT License.