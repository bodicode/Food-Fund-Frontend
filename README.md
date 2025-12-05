# Food Fund - Charity & Fundraising Platform

Food Fund is a comprehensive charity and fundraising platform designed to connect generous donors with meaningful campaigns and organizations. This repository contains the frontend application built with modern web technologies to ensure a seamless, responsive, and engaging user experience.

## 🚀 Key Features

*   **Campaign Management**: Browse, search, and view detailed fundraising campaigns.
*   **Donation System**: Secure and transparent donation processing with wallet integration.
*   **Organization Hub**: Organizations can create profiles, manage campaigns, and track funding.
*   **Transparent Reporting**: Track ingredient requests, operation costs, and disbursement requests.
*   **User Profiles**: Manage personal information, view donation history, and earn **Badges & Titles** for contributions.
*   **Interactive Maps**: Visualize campaign locations and impact areas using Leaflet.
*   **Admin Dashboard**: Powerful tools for platform administrators to oversee activities and manage users.
*   **Real-time Notifications**: Stay updated on campaign progress and account activities.

## 🛠️ Tech Stack

This project is built using the latest web development standards:

### Core
*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Library**: [React 19](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)

### Styling & UI
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **Components**: [Radix UI](https://www.radix-ui.com/) (accessible primitives)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Animations**: [Motion](https://motion.dev/) & [GSAP](https://gsap.com/)

### State & Data
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
*   **API Client**: [Apollo Client](https://www.apollographql.com/) (GraphQL)
*   **Forms & Validation**: [Zod](https://zod.dev/)

### Tools & Libraries
*   **Maps**: [React Leaflet](https://react-leaflet.js.org/)
*   **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Dates**: [Date-fns](https://date-fns.org/) & [Day.js](https://day.js.org/)

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/foo-fund-frontend.git
    cd foo-fund-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory. You can use `.env.docker` as a reference or ask the team for the standard configuration.
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000/graphql
    # Add other necessary environment variables here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🐳 Docker Setup

The project includes Docker configuration for containerized development and deployment.

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📂 Project Structure

```bash
src/
├── app/                # Next.js App Router pages and layouts
├── components/         # Reusable React components
│   ├── ui/             # Generic UI components (buttons, inputs, etc.)
│   ├── campaign/       # Campaign-specific components
│   ├── profile/        # User profile components
│   └── ...
├── graphql/            # GraphQL queries and mutations
├── lib/                # Utility functions and configurations
├── services/           # API service layers
├── store/              # Redux store slices
├── types/              # TypeScript type definitions
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
