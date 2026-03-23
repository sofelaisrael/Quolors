# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or sign in
3. Create a new organization (if needed)
4. Create a new project:
   - Choose a name (e.g., "quolors")
   - Choose a database password
   - Choose a region closest to your users
   - Click "Create new project"

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to:
   - **Project Settings** (gear icon in left sidebar)
   - **API** section

2. Copy these values:
   - **Project URL** (looks like `https://your-project-id.supabase.co`)
   - **anon public** key (looks like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Configure the App

1. Open `src/utils/supabase.js`

2. Replace the placeholder values:

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co'; // Replace with your Project URL
const supabaseAnonKey = 'your-anon-key'; // Replace with your anon public key
```

## 4. Configure Authentication

1. In Supabase dashboard, go to **Authentication** section
2. Under **Settings**, configure:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/*` and your production URL
3. Under **Providers**, ensure **Email** is enabled

## 5. Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test signup:
   - Go to `http://localhost:5173/Signup`
   - Create a new account
   - Check your email for confirmation (if email verification is enabled)

3. Test login:
   - Go to `http://localhost:5173/Login`
   - Sign in with your credentials

## 6. Production Setup

When deploying to production:

1. Update the **Site URL** in Supabase to your production URL
2. Add your production URL to the **Redirect URLs**
3. Update the Supabase credentials in your production environment variables

## Environment Variables (Optional)

For better security, you can use environment variables:

1. Create `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Update `src/utils/supabase.js`:
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## Features

The authentication system includes:
- ✅ User registration with email confirmation
- ✅ User login with password
- ✅ Session persistence across page refreshes
- ✅ Automatic logout on session expiration
- ✅ Protected routes (you can add route guards)
- ✅ User profile management
- ✅ Error handling with user-friendly messages

## Troubleshooting

### "Invalid login credentials"
- Check that the user has confirmed their email (if email verification is enabled)
- Verify the email and password are correct

### "User already registered"
- The email is already in use
- Try logging in instead or use a different email

### Network errors
- Check your Supabase URL and API key
- Ensure your Supabase project is active
- Check your internet connection

### CORS errors
- Make sure your development URL (`http://localhost:5173`) is in the Redirect URLs
- Add any additional URLs you're using for development
