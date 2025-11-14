# Tag2Eat - IoT-Enabled Smart Canteen System

Tag2Eat is an IoT-enabled smart canteen system that streamlines the dining experience through NFC-based authentication and cashless transactions. By leveraging existing MIFARE college ID cards, ESP32 microcontrollers, and a modern web platform, the system eliminates long queues, reduces manual payment errors, and provides real-time transaction analytics.

### Key Features Implemented

- **NFC Authentication**: Tap-to-authenticate using existing college ID cards
- **Web Dashboard**: Real-time order management and transaction monitoring
- **Shopping Cart System**: Browse menu items and place orders
- **Order Tracking**: Live status updates for placed orders
- **User Authentication**: Secure login and profile management
- **ESP32 Integration**: Hardware communication with cloud platform

## System Architecture

### Hardware Components

- **ESP32**: Main microcontroller with WiFi connectivity
- **MFRC522 NFC Reader**: Reads MIFARE card UIDs via SPI communication
- **LCD Display (16x2)**: Shows authentication and payment status
- **Buzzer**: Audio feedback for transactions

### Software Stack

**Frontend & Backend:**
- **Next.js** - React framework for web dashboard
- **TypeScript** - Type-safe development
- **Supabase/Neon Postgres** - Database for users and transactions
- **Razorpay** - UPI payment integration
- **Vercel** - Deployment platform

**IoT Layer:**
- **Arduino/ESP32 Firmware** - NFC reading and WiFi communication
- **ThingSpeak MQTT** - IoT messaging protocol
- **REST APIs** - Bridge between hardware and cloud

**Development Tools:**
- **Biome.js** - Code formatting and linting
- **Husky** - Git hooks for code quality
- **pnpm** - Fast, disk space efficient package manager

## Features 

### Authentication System
- User registration with student ID linking
- Secure login with session management
- NFC card UID mapping to user profiles

### Dashboard
- Real-time order monitoring
- Menu item management
- Transaction history
- User profile management

### Order System
- Browse canteen menu
- Add items to cart
- Place orders with NFC authentication
- Track order status (Pending → Preparing → Ready → Completed)

### Payment Integration
- UPI payment via Razorpay
- Secure transaction processing
- Payment status tracking
- Transaction receipts


## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Supabase/Neon database account
- Razorpay API credentials (for payment integration)
- ESP32 development board with MFRC522 NFC reader (for hardware testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rev-sin/Tag2Eat.git
   cd Tag2Eat
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp example.env .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   # Database
   DATABASE_URL=your_postgres_connection_string
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   
   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_SECRET=your_razorpay_secret
   
   # ThingSpeak (optional)
   THINGSPEAK_API_KEY=your_thingspeak_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Hardware Setup

1. **Upload ESP32 Firmware**
   - Open `arduino/` directory in Arduino IDE
   - Configure WiFi credentials in the sketch
   - Upload to ESP32 board

2. **Wire the Components**
   - Connect MFRC522 to ESP32 via SPI pins
   - Connect LCD display (I2C or parallel)
   - Connect buzzer to GPIO pin
   - Refer to circuit diagram in project documentation


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
