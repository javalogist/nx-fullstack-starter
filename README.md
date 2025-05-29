# Nx-FullStack-Starter

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **A modern full-stack monorepo starter built with Nx** ✨

## 🏗️ Project Structure

This monorepo is organized into the following structure:

```
nx-fullstack-starter/
├── apps/                    # Application projects
│   ├── web/                # Next.js frontend application
│   └── api/                # NestJS backend application
├── libs/                    # Shared libraries
│   ├── frontend/           # Frontend shared components and utilities
│   ├── backend/            # Backend shared modules and services
│   └── shared/             # Shared types and utilities
└── scripts/                # Build and utility scripts
```

## 🚀 Features

- **Modern Tech Stack**:
  - Frontend: Next.js 15 with React 19
  - Backend: NestJS with Fastify
  - UI: Tailwind CSS, Radix UI, and Mantine (though not active used)
  - State Management: React Query
  - Form Handling: React Hook Form with Zod validation
  - Authentication: Passport.js with JWT

- **Development Tools**:
  - TypeScript for type safety
  - ESLint and Prettier for code quality
  - Nx for monorepo management
  - SWC for fast compilation
  - Winston for logging

## 🛠️ Getting Started

1. **Installation**:
   ```bash
   npm install
   ```

2. **Development**:
   ```bash
   # Start frontend
   npx nx serve web

   # Start backend
   npx nx serve api

   # Run both
   npx nx run-many -t serve -p web api
   ```

3. **Building**:
   ```bash
   # Build all projects
   npx nx run-many -t build -p web api

   # Build specific project
   npx nx build web
   ```

## 📦 Available Scripts

- `npm run generate-types` - Generate TypeScript types from your API for your frontend
- `npx nx test` - Run tests
- `npx nx lint` - Run linting
- `npx nx graph` - View project dependencies

## 🔧 Configuration

- **Frontend**: Next.js configuration in `apps/web/next.config.js`
- **Backend**: NestJS configuration in `apps/api/src/main.ts`
- **Workspace**: Nx configuration in `nx.json`
- **TypeScript**: Base configuration in `tsconfig.base.json`

## 🧩 Code Generation

Use Nx generators to create new components, services, and modules:

```bash
# Generate a new component
npx nx generate @nx/react:component my-component --project=web

# Generate a new service
npx nx generate @nx/nest:service my-service --project=api
```

## 📚 Documentation

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Connect with us!

- [Join the Nx community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
