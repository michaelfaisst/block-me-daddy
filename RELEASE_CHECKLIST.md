# Release Checklist for Block Me Daddy v1.0.0

## Completed Tasks

### Technical Preparation
- ✅ Version bumped to 1.0.0 in manifest.config.ts
- ✅ Version bumped to 1.0.0 in package.json
- ✅ Manifest enhanced with description field
- ✅ Privacy policy created (PRIVACY.md)
- ✅ Store description written (STORE_DESCRIPTION.md)
- ✅ Production build successful
- ✅ All tests passing (52/52)
- ✅ Linter checks passing (0 errors, 21 warnings - acceptable)

### Files to Review Before Submission

1. **dist/** folder - Contains the production build ready for Chrome Web Store
2. **PRIVACY.md** - Privacy policy to host on your website or reference in store listing
3. **STORE_DESCRIPTION.md** - Copy/paste content for Chrome Web Store listing

## Remaining Tasks

### Required for Chrome Web Store Submission

#### 1. Promotional Images & Screenshots
You'll need to create the following images:

**Screenshots** (at least 1, max 5):
- Size: 1280x800 or 640x400
- Suggested screenshots:
  1. Options page showing the blocked sites list
  2. Schedule configuration interface
  3. Preset site selector showing categories
  4. Blocked page with motivational GIF
  5. Dark mode showcase

**Promotional Images** (required):
- Small tile: 440x280
- Large tile: 920x680  
- Marquee (optional but recommended): 1400x560

**Tools for creating images:**
- Take screenshots of the extension running
- Use a tool like Figma, Canva, or Photoshop to create promotional tiles
- Add text overlays highlighting key features

#### 2. Demo Video (Optional but Recommended)
- 30-60 seconds showing:
  - Adding a site to the block list
  - Setting up a schedule
  - Getting blocked and seeing the motivational GIF
  - Using the preset selector
- Upload to YouTube as unlisted

#### 3. Support Email/Contact
- Set up a support email (e.g., support@michael.faisst.io or use personal email)
- Add this email to the Chrome Web Store listing
- Consider creating a GitHub Discussions or Issues section for user feedback

#### 4. Test Installation Flow
Steps to test:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder
5. Test all functionality:
   - Add a site to block list
   - Create a schedule
   - Navigate to a blocked site
   - Test preset selector
   - Test import/export
   - Test dark mode
   - Verify GIFs load on blocked page
6. Check for console errors
7. Test on different websites

## Chrome Web Store Submission Steps

### 1. Create Developer Account
- Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- Pay one-time $5 developer registration fee (if not already registered)

### 2. Create New Item
1. Click "New Item"
2. Upload the `dist/` folder as a ZIP file:
   ```bash
   cd dist
   zip -r block-me-daddy-v1.0.0.zip .
   ```
3. Fill out the store listing form

### 3. Store Listing Information

**Basic Information:**
- Extension name: Block me daddy
- Summary: (Use from STORE_DESCRIPTION.md - 132 chars max)
- Description: (Use detailed description from STORE_DESCRIPTION.md)
- Category: Productivity
- Language: English

**Privacy:**
- Privacy policy: Upload PRIVACY.md to your website (michael.faisst.io) and link it
- Or paste content in "Privacy practices" section

**Graphic Assets:**
- Upload screenshots (1-5 images)
- Upload small tile (440x280)
- Upload large tile (920x680)
- Upload marquee (optional, 1400x560)
- Icon: Already included in manifest (128x128)

**Distribution:**
- Visibility: Public
- Regions: All regions (or select specific ones)
- Pricing: Free

**Additional Information:**
- Official URL: https://github.com/michaelfaisst/block-me-daddy (or michael.faisst.io)
- Support email: (Your email)
- Single purpose description: "Helps users stay focused by blocking distracting websites with customizable time-based schedules"

### 4. Submit for Review
- Review all information
- Click "Submit for review"
- Review typically takes 1-3 business days
- You'll receive email updates about review status

### 5. Post-Submission
- Monitor reviews and respond to user feedback
- Track analytics in Developer Dashboard
- Plan for future updates based on user feedback

## Marketing & Promotion (Optional)

Consider these channels to promote your extension:

1. **Product Hunt** - Launch on Product Hunt for visibility
2. **Reddit** - Post in r/productivity, r/chrome, r/webdev
3. **Twitter/X** - Share with developer community
4. **Personal Website** - Add a project page on michael.faisst.io
5. **GitHub** - Add "Available on Chrome Web Store" badge to README
6. **Dev.to** - Write a blog post about building the extension

## Support Resources

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Chrome Extension Best Practices](https://developer.chrome.com/docs/extensions/mv3/quality_guidelines/)
- [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program-policies/)

## Version Management

For future releases:
1. Update version in manifest.config.ts
2. Update version in package.json  
3. Update CHANGELOG.md
4. Run tests: `bun run test`
5. Run build: `bun run build`
6. Create ZIP from dist/ folder
7. Upload to Chrome Web Store Dashboard

---

**Good luck with the launch! 🚀**
