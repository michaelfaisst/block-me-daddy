# Privacy Policy for Block Me Daddy

**Last Updated: November 20, 2025**

## Overview

Block Me Daddy is committed to protecting your privacy. This privacy policy explains how the extension handles your data.

## Data Collection

**We do not collect, transmit, or share any of your personal data.**

### What Data is Stored Locally

The extension stores the following information locally on your device using Chrome's local storage API:

- **Blocked websites list**: URLs and domain names you choose to block
- **Blocking schedules**: Time-based rules you configure for blocking websites
- **Theme preference**: Your choice of light or dark mode
- **UI preferences**: Settings like current page in pagination

### Data Storage

All data is stored locally on your device using Chrome's `chrome.storage.local` API. This data:

- Never leaves your device
- Is not transmitted to any external servers
- Is not shared with third parties
- Is not used for analytics or tracking

### Data Access

The extension only accesses:

- **Tabs permission**: To check the URL of currently open tabs and redirect blocked sites
- **Storage permission**: To save and retrieve your blocked sites list and preferences locally
- **Host permissions (<all_urls>)**: Required to check if any website you visit should be blocked according to your configured rules

### Third-Party Services

The blocked page displays random GIFs from Giphy. When you visit a blocked site:

- Your browser loads an image from Giphy's CDN (media.giphy.com)
- This is a standard image request and Giphy may collect standard web analytics
- We do not control or have access to any data Giphy may collect
- No personal information from the extension is sent to Giphy

### Data Deletion

You can delete all extension data at any time by:

1. Uninstalling the extension (removes all local data)
2. Using the "Clear All" functionality in the extension settings (if implemented)
3. Using Chrome's extension management interface

### Updates to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date above.

### Contact

If you have questions about this privacy policy, please contact:

- **Developer**: Michael Faisst
- **Website**: https://michael.faisst.io
- **GitHub**: https://github.com/michaelfaisst/block-me-daddy

## Your Rights

Since we don't collect any data, there is no personal data to access, modify, or delete from our servers. All your data remains on your device under your control.

## Consent

By using Block Me Daddy, you consent to this privacy policy.
