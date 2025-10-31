# 🔐 Environment Variables Setup Guide

## Quick Setup

### 1. Create `.env.local` file
```bash
# In project root directory
touch .env.local
```

### 2. Add the following content to `.env.local`
```env
# OMDb API Configuration
# Get your FREE API key from: https://www.omdbapi.com/apikey.aspx
NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
NEXT_PUBLIC_API_BASE_URL=https://www.omdbapi.com/
```

### 3. Get Your Free API Key

1. Visit: https://www.omdbapi.com/apikey.aspx
2. Select "FREE" plan (1,000 daily limit)
3. Enter your email
4. Verify your email
5. Copy your API key
6. Replace `your_api_key_here` with your actual API key

### 4. Verify Setup

```bash
# Run development server
npm run dev

# If you see API errors, check your .env.local file
```

---

## Environment Variables Explained

### `NEXT_PUBLIC_OMDB_API_KEY`
- **Required:** Yes
- **Type:** String
- **Description:** Your OMDb API key for accessing movie data
- **Example:** `a1b2c3d4`
- **Get it from:** https://www.omdbapi.com/apikey.aspx

### `NEXT_PUBLIC_API_BASE_URL`
- **Required:** Yes
- **Type:** URL
- **Description:** Base URL for OMDb API
- **Default:** `https://www.omdbapi.com/`
- **Note:** Don't change unless you know what you're doing

---

## Common Issues

### ❌ "API Key Missing" Error
**Problem:** `.env.local` file not created or API key not set

**Solution:**
```bash
# Check if file exists
ls -la .env.local

# If not, create it
echo "NEXT_PUBLIC_OMDB_API_KEY=your_key_here" > .env.local
echo "NEXT_PUBLIC_API_BASE_URL=https://www.omdbapi.com/" >> .env.local
```

### ❌ "Invalid API Key" Error
**Problem:** API key is incorrect or not activated

**Solution:**
1. Check your email for activation link
2. Verify the key in .env.local matches the one from OMDb
3. Make sure there are no extra spaces or quotes

### ❌ ".env.local not loading" Error
**Problem:** Next.js not detecting environment variables

**Solution:**
```bash
# Restart development server
# Press Ctrl+C then:
npm run dev
```

### ❌ "Daily Limit Exceeded" Error
**Problem:** Free plan allows 1,000 requests per day

**Solution:**
- Wait until next day (limit resets at midnight UTC)
- Or upgrade to paid plan at https://www.omdbapi.com/

---

## Security Best Practices

### ✅ DO
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use different API keys for dev/prod
- ✅ Rotate API keys periodically
- ✅ Never commit `.env.local` to version control

### ❌ DON'T
- ❌ Share your API key publicly
- ❌ Commit `.env.local` to Git
- ❌ Hardcode API keys in source code
- ❌ Use production keys in development

---

## Production Deployment

### Vercel
```bash
# Add environment variables in Vercel dashboard:
# Settings > Environment Variables

NEXT_PUBLIC_OMDB_API_KEY=your_production_key
NEXT_PUBLIC_API_BASE_URL=https://www.omdbapi.com/
```

### Netlify
```bash
# Site settings > Build & deploy > Environment

NEXT_PUBLIC_OMDB_API_KEY=your_production_key
NEXT_PUBLIC_API_BASE_URL=https://www.omdbapi.com/
```

### Docker
```dockerfile
# Use build args
ARG NEXT_PUBLIC_OMDB_API_KEY
ARG NEXT_PUBLIC_API_BASE_URL

ENV NEXT_PUBLIC_OMDB_API_KEY=$NEXT_PUBLIC_OMDB_API_KEY
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
```

---

## Testing

### Verify API Connection
```bash
# Test in browser console (after starting dev server)
fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&t=Matrix`)
  .then(res => res.json())
  .then(console.log)
```

### Expected Response
```json
{
  "Title": "The Matrix",
  "Year": "1999",
  "Response": "True",
  ...
}
```

---

## Additional Resources

- 📖 [OMDb API Documentation](http://www.omdbapi.com/)
- 🔐 [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- 🚀 [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated:** October 6, 2025

