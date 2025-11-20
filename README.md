# Block Me Daddy

A browser extension for Chromium-based browsers (Chrome, Edge, Brave, Opera) that helps you stay focused by blocking distracting websites based on customizable schedules.

## Features

- **Website Blocking**: Block distracting websites by domain or exact URL matching
- **Preset Site Lists**: Quick-add common distracting sites across 6 categories (Social Media, Video Streaming, News & Media, Gaming, Shopping, Entertainment)
- **Flexible Scheduling**: Create multiple schedules with day-of-week and time range controls
- **Dark Mode**: Beautiful dark/light theme support with excellent contrast and accessibility
- **Import/Export**: Back up and restore your blocked sites and schedules as JSON
- **Smart URL Matching**: Automatically handles www/non-www variants and protocol normalization
- **Engaging Blocked Page**: Motivational GIFs to keep you on track when you try to visit blocked sites

## Screenshots

![Options Page](assets/icon128.png)

<!-- TODO: Add actual screenshots after Phase 6 -->

## Installation

### For Users (Extension Stores)

_Coming soon - extension will be published to browser extension stores_

- Chrome Web Store
- Microsoft Edge Add-ons
- Opera Add-ons

### For Developers

#### Prerequisites

- [Bun](https://bun.sh/) v1.0.0 or higher (or Node.js v18+)
- A Chromium-based browser (Chrome, Edge, Brave, Opera, etc.)

#### Setup

1. Clone the repository:

```bash
git clone https://github.com/michaelfaisst/block-me-daddy.git
cd block-me-daddy
```

2. Install dependencies:

```bash
bun install
```

3. Build the extension:

```bash
bun run build
```

4. Load the extension in your browser:

    **Chrome/Edge/Brave:**
    - Open your browser and navigate to the extensions page:
        - Chrome: `chrome://extensions/`
        - Edge: `edge://extensions/`
        - Brave: `brave://extensions/`
    - Enable "Developer mode" (toggle in top-right corner)
    - Click "Load unpacked"
    - Select the `dist` folder from the project directory

## Usage

### Blocking Websites

1. Click the extension icon or right-click and select "Options"
2. In the "Blocked Sites" section, click "Add Site"
3. Enter the domain (e.g., `facebook.com`) or use "Quick Add Presets" for common sites
4. Choose between domain matching (blocks all subdomains) or exact URL matching
5. Click "Add Site"

**Tips:**

- Use domain matching for `youtube.com` to block all YouTube pages
- Use exact matching for specific pages like `reddit.com/r/gaming`
- Don't include `www.` - the extension handles this automatically

### Creating Schedules

1. Navigate to the "Schedules" section
2. Click "Add Schedule"
3. Select the days of the week when blocking should be active
4. Set the time range (e.g., 9:00 AM to 5:00 PM for work hours)
5. Click "Save"

**Note:** If no schedules are defined, sites are blocked 24/7.

### Import/Export

- **Export**: Click "Export Settings" to download a JSON file with your blocked sites and schedules
- **Import**: Click "Import Settings" and select a previously exported JSON file

## Development

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - TypeScript type-check + production build
- `bun run test` - Run all tests with Vitest
- `bun run test:ui` - Run tests with Vitest UI
- `bun run test:coverage` - Generate test coverage report
- `bun run prettify` - Format code with Prettier

### Project Structure

```
block-me-daddy/
├── src/
│   ├── background.ts           # Service worker for blocking logic
│   ├── lib/
│   │   ├── blocking.ts         # Core blocking and matching logic
│   │   ├── blocking.test.ts    # Unit tests (52 tests)
│   │   ├── constants.ts        # App-wide constants
│   │   ├── presets.ts          # Preset site lists
│   │   └── utils.ts            # Utility functions
│   ├── dto/
│   │   └── index.ts            # Zod schemas and TypeScript types
│   ├── components/
│   │   ├── blocked-sites/      # Blocked sites management UI
│   │   ├── schedule/           # Schedule management UI
│   │   └── ui/                 # Reusable UI components (shadcn/ui)
│   ├── context/
│   │   └── theme.tsx           # Dark mode context provider
│   ├── options/
│   │   └── page.tsx            # Options page entry point
│   └── blocked/
│       └── page.tsx            # Blocked page with GIFs
├── assets/                     # Extension icons
├── manifest.config.ts          # Extension manifest (Manifest V3)
└── vite.config.ts              # Vite build configuration
```

### Tech Stack

- **Framework**: React 18 + TypeScript (strict mode)
- **Build Tool**: Vite 6 + @crxjs/vite-plugin (cross-browser extension support)
- **UI Library**: Radix UI + Tailwind CSS + shadcn/ui
- **Form Handling**: react-hook-form + Zod
- **Storage**: WebExtensions Storage API via use-chrome-storage
- **Testing**: Vitest + happy-dom
- **Code Quality**: Prettier + Husky + lint-staged

### Code Style

- **Imports**: Three groups separated by blank lines: (1) third-party, (2) `@/` paths, (3) relative
- **Formatting**: 4-space tabs, double quotes, no trailing commas
- **TypeScript**: Strict mode enabled, Zod schemas for validation
- **Components**: Functional components with hooks
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for files

### Testing

Run the test suite:

```bash
bun run test
```

Run tests with UI:

```bash
bun run test:ui
```

Generate coverage report:

```bash
bun run test:coverage
```

**Test Coverage**: 52 tests covering all blocking logic, including edge cases for overnight schedules, URL normalization, and invalid inputs.

### CI/CD

This project uses GitHub Actions for continuous integration and automated releases:

- **CI Pipeline**: Runs on every PR and push to `main`/`develop`
    - Linting with ESLint
    - Code formatting checks with Prettier
    - Full test suite execution
    - Production build validation
    - Build artifacts uploaded (retained for 7 days)

- **Release Pipeline**: Automatically triggered on version tags

#### Creating a Release

1. Update the version in `package.json`:

```bash
# Update version number manually in package.json
```

2. Commit the version change:

```bash
git add package.json
git commit -m "chore: bump version to 1.0.0"
```

3. Create and push a version tag:

```bash
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

4. GitHub Actions will automatically:
    - Run all tests
    - Build the production extension
    - Create a ZIP file (`block-me-daddy-v1.0.0.zip`)
    - Create a GitHub Release with auto-generated release notes
    - Attach the ZIP file to the release

5. Download the ZIP from the GitHub Release and upload it to your preferred extension store (Chrome Web Store, Edge Add-ons, etc.).

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests if applicable
4. Run tests: `bun run test`
5. Format code: `bun run prettify`
6. Commit your changes: `git commit -m "Add my feature"`
7. Push to your fork: `git push origin feature/my-feature`
8. Open a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

- **Author**: Michael Faisst
- **Website**: [michael.faisst.io](https://michael.faisst.io)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Radix Icons](https://www.radix-ui.com/icons) + [Lucide](https://lucide.dev/)

## Privacy

This extension does not collect, store, or transmit any personal data. All blocked sites and schedules are stored locally in your browser using the WebExtensions Storage API. Your data never leaves your device.

## Support

For bugs, feature requests, or questions, please [open an issue](https://github.com/michaelfaisst/block-me-daddy/issues) on GitHub.

---

Made with love by [Michael Faisst](https://michael.faisst.io)
