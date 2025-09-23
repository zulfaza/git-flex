# GitFlex

A flexible GitHub contribution calendar visualizer that lets you explore and customize your GitHub activity with interactive layouts, color themes, and export options.

## Features

- 🎨 **Customizable Colors**: Pick from preset themes or create your own color schemes
- 📊 **Flexible Layouts**: Adjust calendar layout and appearance
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 📸 **Export Options**: Download your calendar as SVG or PNG
- ⚡ **Real-time Preview**: See changes instantly as you customize

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/git-flex.git
cd git-flex
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter your GitHub username in the input field
2. View your contribution calendar with default styling
3. Customize colors, layout, and appearance using the controls
4. Export your calendar as SVG or PNG for use in portfolios, README files, or presentations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Export**: html2canvas-pro for image generation

## Development

### Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── constants/          # App constants
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
