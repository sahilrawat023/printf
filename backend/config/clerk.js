import { Clerk } from '@clerk/clerk-sdk-node';

let clerkClient = null;

if (process.env.CLERK_SECRET_KEY) {
  clerkClient = Clerk({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });
}

export default clerkClient; 