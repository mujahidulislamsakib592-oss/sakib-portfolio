# sakib Portfolio CMS

This is the editable live version of the portfolio website.

## What You Can Change From Admin

- Website name
- Your name
- Bio
- Email
- Phone
- WhatsApp
- Social links
- Hero text
- Portfolio projects
- Project categories
- Project images
- Services

## Important

Do not put your password inside the code. Create your admin email and password in Supabase Auth. Then you can log in at:

```text
/admin
```

Your requested admin email:

```text
mujahidulislamsakib592@gamil.com
```

Please check the spelling. If you meant Gmail, use:

```text
mujahidulislamsakib592@gmail.com
```

## Setup Steps

1. Create a free account at Supabase.
2. Create a new project.
3. Open the SQL Editor.
4. Paste and run the SQL from `supabase/schema.sql`.
5. Go to Authentication > Users and create your admin user.
6. Go to Project Settings > API.
7. Copy Project URL and anon key.
8. Create `.env.local` using `.env.example`.
9. Run:

```bash
npm install
npm run dev
```

10. Open:

```text
http://localhost:3000
http://localhost:3000/admin
```

## Deploy Live

Upload this project to Vercel and add the same environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

After deployment, your site will be live and editable from `/admin`.
