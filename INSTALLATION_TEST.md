# Installation Testing Guide

## Pre-Installation Checklist

- [x] Production build exists in `dist/` folder (147.55 kB gzipped)
- [x] manifest.json present with version 1.0.0
- [x] All icons present (16x16, 32x32, 48x48, 128x128)
- [x] HTML pages present (options.html, blocked.html)
- [x] Service worker present

## Chrome Extension Installation Steps

### 1. Load Unpacked Extension

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `/Users/michaelfaisst/Work/Private/block-me-daddy/dist` folder
6. Extension should appear in the list with:
    - Name: "Block me daddy"
    - Version: 1.0.0
    - Description: "Stop procrastinating and get things done by blocking distracting websites."
    - Icon visible

### 2. Initial Functionality Tests

#### Test Extension Icon

- [x] Extension icon appears in Chrome toolbar
- [x] Clicking icon shows "Block me daddy" tooltip
- [x] Icon displays correctly (not broken image)

#### Test Options Page

- [x] Right-click extension icon → "Options" opens settings page
- [x] Or visit `chrome://extensions/` → Click "Extension options"
- [x] Options page loads without errors
- [x] Theme toggle works (light/dark mode)
- [x] All UI components render correctly

#### Test Blocked Sites Management

- [x] Add a new site (e.g., `facebook.com`)
- [x] Verify site appears in the list
- [x] Edit the site entry
- [x] Delete the site
- [x] Add multiple sites
- [x] Test preset selection (Social Media, Entertainment, etc.)

#### Test Schedule Configuration

- [x] Create a new schedule with specific days and times
- [x] Edit an existing schedule
- [x] Delete a schedule
- [x] Toggle schedule on/off
- [x] Verify multiple schedules can coexist

### 3. Blocking Functionality Tests

#### Test Active Blocking

1. Add `reddit.com` to blocked sites
2. Set schedule to "Always" or current time
3. Try to visit `https://reddit.com`
4. Expected result:
    - [x] Blocked page displays with GIF
    - [ ] Page shows blocked site name
    - [ ] Page shows reason (scheduled/always blocked)
    - [x] Page styling matches theme

#### Test Subdomain Matching

1. Add `example.com` to blocked sites
2. Try to visit `https://www.example.com`
3. Try to visit `https://subdomain.example.com`
4. Expected result:
    - [ ] All variations are blocked
    - [ ] Blocking works consistently

#### Test Schedule Timing

1. Create schedule: Mon-Fri, 9:00 AM - 5:00 PM
2. During schedule time:
    - [ ] Sites are blocked
    - [ ] Blocked page shows schedule info
3. Outside schedule time:
    - [ ] Sites are accessible
    - [ ] No blocking occurs

#### Test "Always" Blocking

1. Set a site to "Always" schedule
2. Expected result:
    - [ ] Site blocked at all times
    - [ ] Blocked page shows "always blocked" message

### 4. Data Persistence Tests

1. Add several sites and schedules
2. Close and reopen browser
3. Expected result:
    - [ ] All settings persist
    - [ ] Blocked sites list intact
    - [ ] Schedules remain configured

4. Disable extension from `chrome://extensions/`
5. Re-enable extension
6. Expected result:
    - [ ] All data still present
    - [ ] No data loss

### 5. Console Error Check

1. Open Developer Tools (F12)
2. Check Console tab
3. Navigate through extension features
4. Expected result:
    - [ ] No red errors in console
    - [ ] No warnings about missing resources
    - [ ] Background service worker running without errors

### 6. Edge Cases & Error Handling

#### Test Invalid URLs

- [ ] Try to add invalid URL (e.g., "not a url")
- [ ] Verify validation error appears
- [ ] Cannot save invalid entries

#### Test Duplicate Sites

- [ ] Add `youtube.com`
- [ ] Try to add `youtube.com` again
- [ ] Verify duplicate detection message

#### Test Empty States

- [ ] Remove all blocked sites
- [ ] Verify empty state message appears
- [ ] Remove all schedules
- [ ] Verify UI handles empty state gracefully

#### Test Import/Export

- [ ] Export settings to JSON file
- [ ] Clear all settings
- [ ] Import previously exported file
- [ ] Verify all settings restored correctly

### 7. Performance Tests

- [ ] Add 50+ sites to blocked list
- [ ] Verify UI remains responsive
- [ ] Navigation to blocked site is fast (< 100ms redirect)
- [ ] Options page loads quickly with many sites

### 8. Cross-Tab Testing

1. Open options page in Tab 1
2. Open options page in Tab 2
3. Make changes in Tab 1
4. Expected result:
    - [ ] Changes sync to Tab 2 (Chrome storage sync)

### 9. Browser Action Tests

- [ ] Click extension icon (should show tooltip only, no popup)
- [ ] Right-click icon shows context menu
- [ ] "Options" menu item works

## Known Issues / Acceptable Warnings

- Fast Refresh warnings in console (development-related, not affecting production)
- ESLint warnings for shadcn components (21 warnings, not affecting functionality)

## Post-Testing Checklist

After all tests pass:

- [ ] No console errors
- [ ] All core features work
- [ ] Blocking is reliable
- [ ] Data persists correctly
- [ ] UI is polished and responsive
- [ ] Extension is ready for Chrome Web Store submission

## Testing Complete

Date tested: **\*\***\_\_\_**\*\***
Tested by: **\*\***\_\_\_**\*\***
Chrome version: **\*\***\_\_\_**\*\***

Notes:
