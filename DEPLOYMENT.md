# Medical Orders Manager - Deployment Guide

## Overview
This is a Progressive Web App (PWA) for managing medical orders. Users can create orders, and admins can view and manage all orders.

## Features
- ✅ User authentication (demo mode)
- ✅ Role-based access (Admin & User)
- ✅ Create medical orders with patient details
- ✅ Track order status (Pending, In Progress, Completed, Cancelled)
- ✅ Admin dashboard to view and manage all orders
- ✅ Mobile-first responsive design
- ✅ PWA support for app store deployment
- ✅ Offline capability with service worker

## Demo Credentials
- **Admin**: admin@medical.com / admin123
- **User**: Any email / any password

## App Store Deployment

### Prerequisites for App Stores
1. **Apple App Store** - Requires:
   - Apple Developer Account ($99/year)
   - Mac computer with Xcode
   - App icons (192x192, 512x512, 1024x1024)
   - App screenshots

2. **Google Play Store** - Requires:
   - Google Play Developer Account ($25 one-time)
   - App icons (192x192, 512x512)
   - App screenshots
   - Privacy policy URL

### Option 1: PWA Distribution (Recommended)
Since this is a web app, the easiest path is PWA distribution:

1. **Deploy to Webflow Cloud** (already configured)
   - Click "Deploy" in Webflow
   - Your app will be live with HTTPS

2. **PWA Installation**
   - Users can "Add to Home Screen" on iOS/Android
   - Works like a native app
   - No app store required

### Option 2: Native App Wrappers
To publish to App Stores, wrap the PWA:

#### Using PWABuilder (Free & Easy)
1. Go to https://www.pwabuilder.com
2. Enter your deployed app URL
3. Download iOS and Android packages
4. Submit to app stores

#### Using Capacitor (More Control)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Initialize
npx cap init

# Add platforms
npx cap add ios
npx cap add android

# Build and copy
npm run build
npx cap copy
npx cap open ios
npx cap open android
```

## Production Considerations

### 1. Authentication
Currently using localStorage for demo. For production:
- Implement proper backend authentication (Firebase, Auth0, Supabase)
- Add JWT tokens
- Secure API endpoints

### 2. Data Storage
Currently using localStorage. For production:
- Use a real database (PostgreSQL, MongoDB, Firestore)
- Add API routes for CRUD operations
- Implement data validation

### 3. Security
- Add HTTPS (automatic with Webflow Cloud)
- Implement CORS properly
- Add rate limiting
- Validate all inputs
- Add HIPAA compliance if needed (for real medical data)

### 4. Icons & Assets
Replace placeholder icons:
```bash
# Create icons at these sizes:
- icon-192.png (192x192)
- icon-512.png (512x512)
- icon-1024.png (1024x1024 for iOS)
- favicon.ico

# Use tools:
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/
```

### 5. Screenshots for App Stores
Required sizes:
- **iOS**: 1242x2688, 1242x2208
- **Android**: 1080x1920, 1080x2340

## Environment Variables
For production, set these in your Webflow deployment:

```env
# Add when implementing real auth
VITE_API_URL=your-api-url
VITE_AUTH_DOMAIN=your-auth-domain
```

## Testing PWA Locally
1. Build the app: `npm run build`
2. Preview: `npm run preview`
3. Test on mobile:
   - Use ngrok or similar to expose localhost
   - Test "Add to Home Screen"

## App Store Submission Checklist

### iOS App Store
- [ ] Apple Developer Account
- [ ] App icons (all sizes)
- [ ] Screenshots (all device sizes)
- [ ] Privacy policy
- [ ] App description
- [ ] Support URL
- [ ] Build with Xcode or PWABuilder
- [ ] Submit for review

### Google Play Store
- [ ] Google Play Developer Account
- [ ] App icons
- [ ] Feature graphic (1024x500)
- [ ] Screenshots
- [ ] Privacy policy
- [ ] App description
- [ ] Content rating questionnaire
- [ ] Build APK/AAB
- [ ] Submit for review

## Support & Maintenance
- Monitor app reviews
- Update regularly
- Fix bugs promptly
- Add new features based on feedback

## Resources
- [PWABuilder](https://www.pwabuilder.com)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/guidelines/)
- [Google Play Guidelines](https://play.google.com/console/about/guides/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
