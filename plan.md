# Block Me Daddy - Development Plan

## Project Overview
A Chrome extension that helps users block distracting websites with schedule support and dark mode UI.

---

## Phase 1: UI & UX Improvements
**Goal**: Enhance visual design and user experience

### Tasks
- [x] Update dark mode colors to match shadcn/ui standards
- [x] Align card and dialog backgrounds
- [x] Improve contrast in dark mode for better accessibility
  - [x] Review text contrast ratios (WCAG AA compliance)
  - [x] Enhance button states (hover, active, focus)
  - [x] Improve form input visibility
  - [ ] Test with color blindness simulators
- [x] Add random "Hell no" GIF on blocked page
  - [x] Create array of curated GIF URLs (Giphy API or static list)
  - [x] Implement random selection logic
  - [x] Add fallback image if GIF fails to load
  - [x] Ensure GIFs are appropriate and motivational

**Deliverables**: Polished UI with better accessibility and engaging blocked page

**Status**: ✅ Completed (except color blindness testing)

---

## Phase 2: New Features
**Goal**: Add user-requested functionality

### Tasks
- [x] Implement impressum/about dialog
  - [x] Create impressum dialog component
  - [x] Add footer to options page with trigger button/link
  - [x] Include: "Made with love by Michael Faisst" + link to michael.faisst.io
  - [x] Add project description and privacy policy statement
- [x] Add preset site blocking list
  - [x] Create comprehensive list of common distracting sites
    - [x] Social media (Facebook, Instagram, Twitter/X, TikTok, Reddit, etc.)
    - [x] Video platforms (YouTube, Twitch, Netflix, etc.)
    - [x] News sites (CNN, BBC, etc.)
    - [x] Gaming sites (Steam, online games, etc.)
    - [x] Shopping (Amazon, eBay, etc.)
  - [x] Design UI for preset selection (checkbox list with categories)
  - [x] Add "Quick Add" button to blocked sites component
  - [x] Allow users to select/deselect presets
  - [x] Merge presets with existing custom sites
- [x] Add export/import functionality for blocked sites and schedules
  - [x] Export to JSON file
  - [x] Import from JSON file
  - [x] Add validation for imported data

**Deliverables**: About page, preset site selection, and data portability

**Status**: ✅ Completed

---

## Phase 3: Bug Fixes & Testing
**Goal**: Ensure reliability across all features

### Tasks
- [x] Audit background script (`src/background.ts`)
  - [x] Test tab update listener edge cases
  - [x] Verify blocked page redirect doesn't create loops
  - [x] Test with multiple tabs/windows
- [x] Audit blocking logic (`src/lib/blocking.ts`)
  - [x] Review URL matching (exact vs domain matching)
  - [x] Test overnight schedule edge cases
  - [x] Verify timezone handling
  - [x] Test www vs non-www URL matching
- [x] Audit UI components
  - [x] Test blocked sites CRUD operations
  - [x] Test schedule creation/editing
  - [x] Verify form validation
  - [x] Test theme persistence
- [ ] Browser compatibility testing
  - [ ] Test on Chrome
  - [ ] Test on Edge
  - [ ] Test on Brave
- [x] Add unit tests for critical functions
  - [x] `getSite()` - URL matching logic
  - [x] `isInSchedule()` - schedule validation (especially overnight)
  - [x] `shouldBlockSite()` - blocking decision logic
  - [x] `normalizeHostname()` - URL normalization
  - [x] `ensureProtocol()` - URL protocol handling
  - [x] Add tests for edge cases (empty arrays, invalid URLs, etc.)
  - [x] Add error handling for malformed URLs in storage
- [ ] Add integration tests
  - [ ] Test full blocking flow (add site → schedule → block)
  - [ ] Test storage persistence

**Deliverables**: Bug-free extension with comprehensive test coverage

**Status**: ✅ Mostly Completed (browser testing and integration tests pending)

---

## Phase 4: Code Quality & Performance
**Goal**: Optimize codebase for maintainability and speed

### Tasks
- [ ] Code optimization
  - [ ] Review and optimize re-renders in React components
  - [ ] Memoize expensive computations
  - [ ] Optimize Chrome storage access (batch reads/writes)
  - [ ] Review bundle size and lazy-load components if needed
- [ ] Code refactoring
  - [ ] Extract magic strings to constants
  - [ ] Improve TypeScript types (reduce `any`, add strict types)
  - [ ] Split large components into smaller, reusable pieces
  - [ ] Add JSDoc comments to complex functions
  - [ ] Ensure consistent code style (run prettier)
- [ ] Performance improvements
  - [ ] Minimize background script execution time
  - [ ] Optimize blocking check logic (early returns)
  - [ ] Cache frequently accessed storage data
  - [ ] Profile extension performance with Chrome DevTools
- [ ] Security review
  - [ ] Validate all user inputs
  - [ ] Review manifest permissions (principle of least privilege)
  - [ ] Sanitize URLs before storage
  - [ ] Add CSP headers if needed

**Deliverables**: Clean, performant, maintainable codebase

---

## Phase 5: Documentation
**Goal**: Create comprehensive documentation

### Tasks
- [ ] Create README.md
  - [ ] Project overview and features
  - [ ] Screenshots/GIFs of extension in action
  - [ ] Installation instructions (development & production)
  - [ ] Usage guide
  - [ ] Development setup
    - [ ] Prerequisites (Node.js, Bun, etc.)
    - [ ] Install dependencies
    - [ ] Run development server
    - [ ] Build for production
    - [ ] Load unpacked extension in Chrome
  - [ ] Testing instructions
  - [ ] Contributing guidelines
  - [ ] License (add LICENSE file)
  - [ ] Credits and acknowledgments
- [ ] Add inline code documentation
  - [ ] Document complex functions
  - [ ] Add JSDoc for public APIs
  - [ ] Document data structures (Site, Schedule DTOs)
- [ ] Create CHANGELOG.md
  - [ ] Document version history
  - [ ] Follow semantic versioning

**Deliverables**: Professional documentation for users and developers

---

## Phase 6: Polish & Release Preparation
**Goal**: Prepare extension for public release

### Tasks
- [ ] User experience enhancements
  - [ ] Add onboarding flow for first-time users
  - [ ] Add empty states with helpful messages
  - [ ] Add loading states for async operations
  - [ ] Add success/error toast notifications
  - [ ] Improve error messages (user-friendly)
- [ ] Extension store preparation
  - [ ] Create promotional images (1280x800, 640x400, etc.)
  - [ ] Write compelling store description
  - [ ] Create demo video/screenshots
  - [ ] Prepare privacy policy page
  - [ ] Set up support email/contact
- [ ] Final checks
  - [ ] Bump version to 1.0.0
  - [ ] Final build and smoke test
  - [ ] Review all manifest settings
  - [ ] Test installation flow
- [ ] Optional: Analytics setup
  - [ ] Add privacy-respecting analytics (optional)
  - [ ] Track basic usage metrics (respecting user privacy)

**Deliverables**: Production-ready extension for Chrome Web Store

---

## Additional Suggestions

### Feature Ideas (Future Phases)
- [ ] **Statistics Dashboard**: Show blocked attempts, most blocked sites, productivity metrics
- [ ] **Password Protection**: Require password to edit blocked sites (prevent self-sabotage)
- [ ] **Break Reminders**: Allow sites for X minutes every Y hours
- [ ] **Focus Mode**: One-click enable all blocking during work hours
- [ ] **Sync Across Devices**: Use Chrome sync storage for multi-device support
- [ ] **Custom Block Messages**: Let users customize the blocked page message
- [ ] **Whitelist Mode**: Block all sites except allowed ones
- [ ] **Temporary Unblock**: Allow unblock for 5/10/15 minutes
- [ ] **Browser Notification**: Notify when attempting to visit blocked site

### Technical Improvements
- [ ] Add CI/CD pipeline (GitHub Actions)
  - [ ] Automated testing on PR
  - [ ] Automated builds
  - [ ] Automated releases
- [ ] Add linting (ESLint)
- [ ] Add commit hooks (Husky + lint-staged)
- [ ] Set up Dependabot for dependency updates

---

## Progress Tracking

**Current Phase**: Phase 3 (Bug Fixes & Testing)
**Completed Phases**: Phase 1 ✅, Phase 2 ✅
**Overall Progress**: ~30%

### Notes
- Phases should be completed sequentially
- Each phase can be broken down into smaller PRs/commits
- User feedback should be incorporated throughout
- Performance testing should be done in Phase 3 & 4

### Phase 1 Summary (Completed)
- ✅ Improved dark mode contrast (muted-foreground: 70%, borders: 20%, secondary/accent: 18%)
- ✅ Enhanced button/input hover and focus states for better visibility
- ✅ Added random GIF selection on blocked page (8 curated GIFs)
- ✅ Added fallback emoji if GIF fails to load
- ✅ Improved accessibility with better focus outlines and input states

### Phase 2 Summary (Completed)
- ✅ Created about dialog with impressum and project info
- ✅ Built preset site selector with 6 categories (~60 sites)
  - Social Media, Video Streaming, News & Media, Gaming, Shopping, Entertainment
  - Category-level and individual site checkboxes
  - Duplicate detection and disabled state for already-blocked sites
- ✅ Implemented export/import functionality
  - JSON export with timestamped filenames
  - Import with Zod schema validation
  - Error handling for invalid files
