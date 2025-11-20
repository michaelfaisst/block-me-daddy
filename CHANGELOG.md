# Changelog

All notable changes to Block Me Daddy will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-20

### Added

#### Core Features
- Website blocking with URL and domain matching
- Customizable time-based schedules with support for overnight blocking
- Automatic www/non-www URL normalization
- Dark mode support with system preference detection
- Preset site selector with 60+ common distracting sites across 6 categories:
  - Social Media (Facebook, Instagram, Twitter/X, TikTok, Reddit, etc.)
  - Video Streaming (YouTube, Twitch, Netflix, etc.)
  - News & Media (CNN, BBC, Fox News, etc.)
  - Gaming (Steam, Epic Games, online games, etc.)
  - Shopping (Amazon, eBay, AliExpress, etc.)
  - Entertainment (9GAG, Imgur, Pinterest, etc.)

#### User Interface
- Modern, clean UI built with React and shadcn/ui
- Blocked sites management with pagination
- Schedule creator with day selection and time ranges
- Import/Export functionality for blocked sites and schedules (JSON format)
- About dialog with project information and impressum
- Random "Hell no!" GIFs on blocked pages (6 curated GIFs that tell users to go away)
- Responsive design that works at any screen size

#### Technical
- Chrome Manifest V3 compliant
- TypeScript throughout for type safety
- Comprehensive unit tests (52 tests covering all blocking logic)
- Zod schema validation for data integrity
- Local storage only - no data collection or tracking
- Optimized background script with batched storage reads
- CI/CD pipeline with GitHub Actions for automated testing and releases

#### Developer Experience
- ESLint configuration with TypeScript and React rules
- Prettier formatting with import sorting
- Pre-commit hooks with Husky and lint-staged
- Vitest for testing with coverage reports
- Hot module reloading in development

### Documentation
- Comprehensive README with installation and usage instructions
- Privacy policy (PRIVACY.md)
- Store listing description (STORE_DESCRIPTION.md)
- Release preparation checklist (RELEASE_CHECKLIST.md)
- Contributing guidelines
- MIT License

---

## Migration Guide

This is the first stable release. No migrations needed.

## Contributing

See [CONTRIBUTING](README.md#contributing) section in README for guidelines on submitting changes.

## License

MIT License - see [LICENSE](LICENSE) file for details.
