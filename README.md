# Fastyr Frontend Test

This project is a frontend application built with Next.js, demonstrating integration with a GraphQL API and utilizing modern UI components. It serves as a submission for the Fastyr frontend developer position assessment.

## 🚀 Live Demo

[View the live demo]()

## 🛠 Tech Stack

- [Next.js](https://nextjs.org/) with App Router
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Table](https://tanstack.com/table/v8)

## 🌟 Features

- Responsive design with a sidebar and header component
- User management (/users and /users/[id] routes)
- Album management (/albums and /albums/[id] routes)
- Data table with search and filter functionality
- Bulk delete feature for albums
- CSV/XLSX import feature for albums with validation

## 📋 Prerequisites

- Node.js (v14 or later)
- npm or yarn

## 🚀 Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/hazmid/fastyr-frontend-test.git
   cd fastyr-frontend-test
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
- `/lib`: Utility functions and Apollo Client setup
- `/styles`: Global styles and Tailwind CSS configuration
- `/public`: Static assets

## 🔗 API Integration

This project uses Apollo Client to interact with the GraphQL API at [https://graphqlzero.almansi.me/api](https://graphqlzero.almansi.me/api).

## 🎨 UI Components

UI components are primarily sourced from shadcn/ui, with custom styling applied using Tailwind CSS.

## 📊 Data Table

The albums page (/albums) features a data table implemented using TanStack Table, providing search and filter capabilities.

## 📤 Deployment

This project is deployed on Vercel. Vercel was chosen for its seamless integration with Next.js projects, automatic deployments from Git, and excellent performance.

To deploy your own instance:

1. Push your code to a GitHub repository.
2. Sign up for a [Vercel account](https://vercel.com/signup).
3. Import your GitHub project to Vercel.
4. Follow the deployment steps provided by Vercel.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/hazmid/fastyr-frontend-test/issues).

## 📝 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

## 👤 Author

Your Name
- GitHub: [@hazmid](https://github.com/hazmid)
- Upwork: [Abdulhamid Usman](https://www.upwork.com/freelancers/~01f593d4b3e664a83e)

---

⭐️ If you like this project, please give it a star on GitHub!