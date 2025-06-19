# 🎨 Warung Warga Frontend

Frontend application untuk platform jual beli dan borongan bareng untuk warga sekitar.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS dengan design system kustom
- **HTTP Client**: Axios
- **Font**: Inter (Google Fonts)
- **Package Manager**: npm

## 🎯 Status Development

**✅ Phase 0 - Foundation (COMPLETED)**
- ✅ Proyek Next.js dengan TypeScript, ESLint, Tailwind CSS
- ✅ Struktur direktori yang rapi (`src/app`, `src/components`, `src/lib`, dll)
- ✅ Konfigurasi Tailwind CSS sesuai UI/UX Guide
- ✅ Setup font Inter untuk seluruh aplikasi
- ✅ Sistem design tokens (warna, tipografi, spacing)
- ✅ API client terpusat dengan axios
- ✅ Environment variables configuration

**🔄 Phase 1 - Authentication & User Management (NEXT)**
- ⏳ Setup Supabase Auth integration
- ⏳ Implementasi halaman login/register
- ⏳ Protected routes dan state management
- ⏳ Halaman profil pengguna

## 📁 Struktur Direktori

```
src/
├── app/                 # App Router (pages & layouts)
│   ├── layout.tsx      # Root layout dengan Inter font
│   └── page.tsx        # Homepage
├── components/         # React components
├── constants/          # Constants & configuration
├── hooks/             # Custom React hooks
├── lib/               # Utilities & configurations
│   └── api.ts         # Centralized API client
└── styles/            # CSS files
    └── globals.css    # Global styles & design system
```

## 🎨 Design System

Proyek ini mengimplementasikan design system lengkap berdasarkan **UI/UX Guide** dengan:

### Warna
- **Primary**: `#26A69A` (Community Teal)
- **Accent**: `#FFCA28` (Warm Amber) 
- **Background**: `#F8F9FA` (Off-white)
- **Surface**: `#FFFFFF` (Pure White)
- **Text Primary**: `#212529` (Dark Gray)
- **Text Secondary**: `#6C757D` (Medium Gray)

### Tipografi (Inter Font)
- **Display**: 28px/Bold - Onboarding titles
- **Heading 1**: 22px/Bold - Page titles
- **Heading 2**: 18px/SemiBold - Section titles
- **Body Large**: 16px/Regular - Main text
- **Body Small**: 14px/Regular - Secondary text
- **Label**: 14px/Medium - Buttons & form labels
- **Caption**: 12px/Regular - Metadata

### Spacing System
- **Grid Unit**: 8px base
- **Common Values**: 1u (8px), 2u (16px), 3u (24px), 4u (32px), 5u (40px)

## 🔧 Instalasi & Development

### Prerequisites
- Node.js 18+ 
- npm

### Setup
```bash
# Clone repository
cd warung-warga-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local dengan konfigurasi yang sesuai

# Run development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Backend Integration

Frontend ini terhubung dengan backend API yang sudah production-deployed:

- **API URL**: `https://warungwarga-api.azurewebsites.net`
- **Documentation**: `https://warungwarga-api.azurewebsites.net/docs`
- **Health Check**: `https://warungwarga-api.azurewebsites.net/health`

API client sudah dikonfigurasi di `src/lib/api.ts` dengan:
- Automatic token management
- Request/response interceptors
- Error handling
- Base URL configuration

## 📱 Fitur yang Akan Diimplementasikan

### Phase 1 - Authentication & User Management
- [ ] Login/Register dengan Supabase Auth
- [ ] Protected routes
- [ ] User profile management
- [ ] Location-based services

### Phase 2 - Lapak Warga (Hyperlocal Marketplace)
- [ ] Product listing creation dengan AI analysis
- [ ] Map-based discovery
- [ ] Product detail pages
- [ ] Image upload & management

### Phase 3 - Borongan Bareng (Group Buying)
- [ ] Group buy creation
- [ ] Participation flow
- [ ] Payment integration dengan Tripay
- [ ] Progress tracking

### Phase 4 - Enhancement & Polish
- [ ] Push notifications
- [ ] Performance optimization
- [ ] PWA features
- [ ] Admin dashboard

## 🎯 Design Philosophy

> **"Calm, Organized, Trusted"** - UI yang tenang dan dapat diandalkan. Setiap pilihan desain melayani kejelasan dan kemudahan penggunaan.

Mengikuti prinsip:
- **Zero Friction**: Pengguna fokus pada komunitas dan perdagangan
- **Clarity First**: Setiap elemen memiliki tujuan yang jelas
- **Mobile-First**: Optimized untuk penggunaan mobile
- **Accessibility**: Dapat diakses oleh semua pengguna

## 📚 Resources

- **UI/UX Guide**: Lihat `WARUNG_WARGA_UI_UX_GUIDE.md`
- **Development Checklist**: Lihat `WARUNG_WARGA_MVP_DEVELOPMENT_CHECKLIST.md`
- **Backend API**: https://warungwarga-api.azurewebsites.net/docs

## Troubleshooting

### Issue: Newly created lapaks not appearing in "Lapak Terdekat" section

**Root Cause**: Missing location coordinates during lapak creation.

**Solution Implemented**:
1. **Location Capture**: Frontend now captures user's GPS coordinates when creating lapaks
2. **Coordinate Inclusion**: Latitude/longitude are included in the lapak creation payload
3. **Backend Update**: Backend modified to accept and use coordinates from frontend
4. **Auto-Refresh**: Homepage automatically refreshes nearby lapaks after creation
5. **Manual Refresh**: Added refresh button for nearby lapaks section

**Backend Changes**: 
- Modified `/lapak` POST endpoint to accept optional `latitude` and `longitude` form fields
- Updated logic to prioritize frontend coordinates over seller profile location
- Enhanced location validation and error messaging

**Debug Logs to Check**:
```
🚀 Calling API: POST /lapak {lapakData: {...}, imageCount: 1, hasLocation: true, coordinates: {...}}
📝 FormData: latitude = -6.3990337
📝 FormData: longitude = 106.8207875
📍 Using frontend coordinates: lat=-6.3990337, lon=106.8207875
✅ Lapak created with ID: 162d17ef-6abe-4c8e-8a7f-e4c85343fbcd
```

**User Flow**:
1. User visits `/lapak/buat` (lapak creation page)
2. Browser requests location permission
3. User uploads photos and fills product details
4. Frontend captures GPS coordinates automatically
5. On form submission, coordinates are included in the request
6. Backend creates lapak with specific coordinates (not profile location)
7. User is redirected to homepage with `?refresh=lapak` parameter
8. Homepage automatically refreshes nearby lapaks to show the new listing

**Dependencies**:
- Browser Geolocation API support
- Backend handling of latitude/longitude fields in POST /lapak
- PostGIS/GeoAlchemy2 for spatial queries

---

**🇮🇩 Built with ❤️ for Indonesian Local Communities** 