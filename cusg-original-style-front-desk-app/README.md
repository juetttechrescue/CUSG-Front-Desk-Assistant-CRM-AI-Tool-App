# CUSG Front Desk Assistant - Original Style App

This is the CU-themed React version based on the original app structure:
- CU gold/off-white design
- Identikey login
- Approved user list
- CUSG front desk chatbot guide
- Daily tasks
- Jade admin task assignment
- Teams & Tools page
- Contacts page

## Login Identikeys
- Natalie: naju1401
- Sania: sabi7853
- Levi: lesc6672
- Jade: joke4446

Jade has admin access and can create/delete daily tasks.

## Deploy to Netlify
1. Upload this whole folder to GitHub, or drag it into Netlify after running build.
2. Netlify build command: `npm run build`
3. Publish directory: `dist`

## Run locally
```bash
npm install
npm run dev
```

## Important
This version works immediately without a backend. Tasks are saved in browser localStorage.

Real @colorado.edu profile pictures require Google OAuth/Workspace Directory access. Do not put a Claude or Google API key directly in browser code. Use a serverless function for that.
