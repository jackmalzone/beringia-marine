# Email Setup Guide for Job Applications

## Quick Setup (EmailJS - Recommended)

### Step 1: Install EmailJS

```bash
npm install @emailjs/browser
```

### Step 2: Create EmailJS Account

1. Go to [emailjs.com](https://emailjs.com)
2. Sign up for a free account
3. Verify your email address

### Step 3: Set Up Email Service

1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (or your email provider)
4. Connect your email account (careers@vitalicesf.com)

### Step 4: Create Email Template

1. Click "Email Templates"
2. Click "Create New Template"
3. Name: "Job Application"
4. Subject: `New Job Application: {{job_title}}`
5. Body:

```
New job application received:

Position: {{job_title}}
Name: {{first_name}} {{last_name}}
Email: {{email}}
Phone: {{phone}}

Experience:
{{experience}}

Why they want to join:
{{why_join}}
```

### Step 5: Get Your Keys

1. **Service ID**: Copy from Email Services page
2. **Template ID**: Copy from Email Templates page
3. **Public Key**: Copy from Account > API Keys page

### Step 6: Update the Code

Replace the placeholders in `src/lib/email.ts`:

- `YOUR_SERVICE_ID` → Your actual Service ID
- `YOUR_TEMPLATE_ID` → Your actual Template ID
- `YOUR_PUBLIC_KEY` → Your actual Public Key

### Step 7: Test

1. Run `npm run dev`
2. Go to `/careers`
3. Submit a test application
4. Check your email!

---

## Alternative: Gmail Direct Setup

### Step 1: Create Gmail Account

1. Create `careers@vitalicesf.com` on Gmail
2. Enable 2-Factor Authentication

### Step 2: Create App Password

1. Go to Google Account > Security > 2-Step Verification > App passwords
2. Select "Mail" and generate password
3. Copy the 16-character password

### Step 3: Environment Variables

Create `.env.local` file:

```
EMAIL_USER=careers@vitalicesf.com
EMAIL_PASSWORD=your_16_char_app_password
```

### Step 4: Test

1. Run `npm run dev`
2. Go to `/careers`
3. Submit test application
4. Check email!

---

## Troubleshooting

### EmailJS Issues:

- **"Service not found"**: Check Service ID
- **"Template not found"**: Check Template ID
- **"Invalid key"**: Check Public Key
- **Email not received**: Check spam folder

### Gmail Issues:

- **"Authentication failed"**: Check app password
- **"Less secure apps"**: Use app password instead
- **Email not received**: Check spam folder

### General Issues:

- **Form not submitting**: Check browser console
- **"Module not found"**: Run `npm install`
- **Environment variables not working**: Restart dev server

## Need Help?

1. Check browser console for errors
2. Verify all IDs and keys are correct
3. Test with a simple email first
4. Check spam/junk folders
