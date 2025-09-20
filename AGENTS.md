# GitFlex Agent Instructions

## Build/Lint/Test Commands

- **Lint**: `npm run lint` (ESLint with Next.js rules)
- **Test**: No test framework configured yet

## Code Style Guidelines

### TypeScript & React
- Use functional components with TypeScript interfaces for props
- Define interfaces above component declarations
- Use proper TypeScript typing for all variables and functions
- Follow Next.js App Router structure

### Imports
- Group imports: React/React hooks first, then external libraries, then internal components
- Place type imports at the top with `import type`
- Use named exports over default exports

### Formatting
- No semicolons (modern JavaScript style)
- Single quotes for strings
- 2 spaces for indentation
- Use Tailwind CSS classes for styling
- Follow ESLint Next.js configuration

### Naming Conventions
- camelCase for variables, functions, and components
- PascalCase for component names and interfaces
- Descriptive, meaningful names (e.g., `currentTheme`, `exportCalendar`)

### Error Handling
- Use try-catch blocks for async operations
- Log errors with `console.error`
- Provide user-friendly error messages
- Reset UI state on errors

### Best Practices
- Use React hooks (useState, useRef, etc.) appropriately
- Implement proper loading states for async operations
- Add accessibility attributes (titles, labels)
- Follow React performance patterns (memoization when needed)

### Development
- After finished your work, you just need to check lint and type errors
- DO NOT run build, dev, or start commands if I don't asked you to
- Do not add any unnecessary comments
- Do not commit any changes, user will do it himself
