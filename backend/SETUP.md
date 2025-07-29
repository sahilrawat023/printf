# PrintEase Backend Setup Guide

## 🔧 Environment Variables Setup

Create a `.env` file in the backend folder with:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/printease

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 🔐 Clerk Setup

### 1. Create Clerk Account
1. Go to [clerk.com](https://clerk.com)
2. Sign up and create a new application
3. Choose "Next.js" or "React" as your framework

### 2. Get API Keys
1. In Clerk Dashboard → **API Keys**
2. Copy the keys:
   - **Secret Key** → `CLERK_SECRET_KEY`
   - **Publishable Key** → `CLERK_PUBLISHABLE_KEY`

### 3. Configure Authentication Methods
1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable email/password authentication
3. Go to **Social Connections** to enable Google, GitHub, etc.

### 4. Set Up User Roles (Optional)
1. Go to **User & Authentication** → **User Management**
2. Create custom user properties for role management
3. Or handle roles in your application logic

## 💳 Razorpay Setup

### 1. Create Razorpay Account
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up for a business account
3. Complete KYC verification

### 2. Get API Keys
1. Go to **Settings** → **API Keys**
2. Generate new API keys:
   - **Key ID** → `RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

### 3. Configure Webhooks
1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`

### 4. Test Mode vs Live Mode
- **Test Mode**: Use `rzp_test_` keys for development
- **Live Mode**: Use `rzp_live_` keys for production

## ☁️ Cloudinary Setup

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account

### 2. Get Credentials
1. Go to **Dashboard**
2. Copy your credentials:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

## 🚀 Running the Backend

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 📱 Frontend Integration

### Clerk Frontend Setup
```javascript
// In your React app
import { ClerkProvider } from '@clerk/clerk-react';

<ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
  <App />
</ClerkProvider>
```

### Razorpay Frontend Integration
```javascript
// Load Razorpay script
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
document.body.appendChild(script);

// Create payment
const options = {
  key: 'rzp_test_your_key_id',
  amount: 50000, // 500 INR in paise
  currency: 'INR',
  name: 'PrintEase',
  description: 'Print Order',
  order_id: 'order_id_from_backend',
  handler: function(response) {
    // Handle payment success
  }
};
const rzp = new Razorpay(options);
rzp.open();
```

## 🔒 Security Notes

1. **Never commit `.env` files** to version control
2. **Use environment variables** for all sensitive data
3. **Verify webhook signatures** (already implemented)
4. **Use HTTPS** in production
5. **Validate all inputs** (already implemented)

## 🧪 Testing

### Test Clerk Authentication
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/users/me
```

### Test Razorpay Webhook
```bash
curl -X POST http://localhost:5000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"payment.captured","payload":{}}'
``` 