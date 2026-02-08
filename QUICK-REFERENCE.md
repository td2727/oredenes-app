# Quick Reference Card

## 🚀 Instant Start

```bash
npm run dev
```
Visit: http://localhost:3000

## 🔑 Demo Login

**Admin**
```
Email: admin@medical.com
Password: admin123
```

**User**
```
Email: any@email.com
Password: anything
```

## 📱 Install on Phone

### iPhone
1. Safari → Share → Add to Home Screen

### Android
1. Chrome → Menu → Add to Home Screen

## 🎨 File Locations

### Main App
- `src/pages/index.astro` - Entry point
- `src/components/MedicalOrdersApp.tsx` - Main app

### Features
- `src/components/LoginForm.tsx` - Login screen
- `src/components/CreateOrderForm.tsx` - Create orders
- `src/components/OrdersList.tsx` - View orders
- `src/components/InstallPrompt.tsx` - PWA install

### Logic
- `src/lib/auth.ts` - Authentication
- `src/lib/orders.ts` - Order management
- `src/types/order.ts` - TypeScript types

### PWA
- `public/manifest.json` - App manifest
- `public/sw.js` - Service worker
- `public/icon-*.png` - App icons (add these!)

## 📝 Common Tasks

### Create New Order
1. Click "Create New Order"
2. Fill patient details
3. Select order type
4. Set urgency
5. Submit

### Change Status (Admin)
1. View order
2. Select new status from dropdown
3. Auto-saves

### Filter Orders
1. Use status dropdown
2. Select: All, Pending, In Progress, Completed, Cancelled

## 🎯 Order Types

- 💊 **Prescription** - Medication orders
- 🔬 **Lab Test** - Laboratory tests
- 🏥 **Imaging** - X-ray, MRI, CT scan
- 👨‍⚕️ **Consultation** - Doctor visits

## ⚡ Urgency Levels

- 🟢 **Routine** - Standard
- 🟡 **Urgent** - Priority
- 🔴 **Emergency** - Immediate

## 📊 Status Workflow

```
Pending → In Progress → Completed
         ↓
       Cancelled
```

## 🛠️ Development

### Build
```bash
npm run build
```

### Type Check
```bash
npx astro check
```

### Deploy
Click "Deploy" in Webflow

## 📦 Key Dependencies

- Astro 5.x
- React 19
- TypeScript
- Tailwind CSS 4.x
- shadCN UI
- Lucide Icons

## 🎨 Icons Needed

Create and save to `/public`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `icon-1024.png` (1024x1024)

Tool: https://www.pwabuilder.com/imageGenerator

## 🌐 App Store Links

### iOS
- Developer: https://developer.apple.com
- Cost: $99/year
- Tool: Xcode (Mac only)

### Android
- Developer: https://play.google.com/console
- Cost: $25 one-time
- Tool: Android Studio

## 🚀 Deployment Options

### 1. PWA (Free)
- Deploy to Webflow
- Share URL
- Users install via browser

### 2. PWABuilder (Easy)
- https://www.pwabuilder.com
- Enter deployed URL
- Generate packages

### 3. Capacitor (Advanced)
```bash
npm i @capacitor/core @capacitor/cli
npx cap init
npx cap add ios android
```

## 📚 Documentation Files

- `README.md` - Overview
- `QUICKSTART.md` - Get started
- `FEATURES.md` - Features list
- `DEPLOYMENT.md` - Deploy guide
- `NATIVE-APP-GUIDE.md` - App stores
- `SUMMARY.md` - Project summary
- `QUICK-REFERENCE.md` - This file

## ⚠️ Remember

### Demo Mode
- Data in localStorage
- Simple auth
- No backend
- Not production-secure

### Production Needs
- Real backend
- Secure auth
- Database
- HIPAA compliance

## 🎯 Next Steps

1. ✅ Test locally
2. ✅ Deploy to Webflow
3. ✅ Test on mobile
4. ⬜ Create icons
5. ⬜ Submit to stores (optional)

## 📞 Get Help

- Docs: Check .md files
- Webflow: webflow.com/support
- PWA: pwabuilder.com

---

**Keep this handy!** 📌
