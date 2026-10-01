# ShuttleX — Smart Campus Ride-Hailing & AI Voice Dispatcher (Flutter)

[![Build ShuttleX Flutter APK](https://github.com/tolu3025/shuttlex/actions/workflows/build_flutter_apk.yml/badge.svg)](https://github.com/tolu3025/shuttlex/actions/workflows/build_flutter_apk.yml)

**ShuttleX** is a production-ready, AI-powered campus motorcycle ride-hailing mobile application built with **Flutter & Dart**, designed for university students and campus motorcycle riders in Nigeria.

---

## 🚀 Key Features

- **Student Ride Booking**: Instant pickup and destination selection across campus landmarks with live route estimation and Nigerian Naira fares (₦).
- **Interactive Mapbox & Isometric City Maps**: Real-time GPS rider tracking, pickup pins, and custom 3D OBJ motorcycle model integration.
- **Rider AI Voice Dispatcher**: Voice-first digital dispatcher communicating ride requests in **English**, **Nigerian Pidgin**, and **Yorubá**, automatically launching Google Maps turn-by-turn navigation on acceptance.
- **Campus Wallet & Paystack Integration**: Real-time balance ledger, fund top-up, trip debit history, and driver earnings.
- **Resilient Supabase Backend**: Integrated with Supabase PostgreSQL, Authentication, and Realtime with local campus landmark fallback.

---

## 🎨 Visual Identity

- **Primary Green**: `#0B6B4B`
- **Deep Forest**: `#071F17`
- **Main Background**: `#F7F8F5`
- **Soft Green**: `#DFF5EA`
- **Accent Amber**: `#F4B740`
- **Typography**: Google Fonts (Inter)

---

## 🛠️ Getting Started

### Prerequisites
- [Flutter SDK](https://flutter.dev/docs/get-started/install) (v3.24+)
- Android Studio / Android SDK (API 34)

### Installation
```bash
# Clone the repository
git clone https://github.com/tolu3025/shuttlex.git
cd shuttlex

# Get Flutter packages
flutter pub get

# Run on connected device / emulator
flutter run
```

### Build Android Release APK
```bash
flutter build apk --release
```
The generated APK will be available at `build/app/outputs/flutter-apk/app-release.apk`.

---

## 🗄️ Database Setup (Supabase)
The complete PostgreSQL migration schema is located in:
`supabase/schema.sql`

Run this script in your Supabase SQL editor to provision all required tables (`profiles`, `campus_locations`, `rides`, `bikes`, `wallets`, `voice_agent_events`).
