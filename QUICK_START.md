# 🚀 Quick Start Guide

## Get Your Portfolio Running in 30 Seconds!

### Step 1: Start the Development Server
```bash
cd portfolio-project
npm run dev
```

### Step 2: Open in Browser
Visit: **http://localhost:5173**

That's it! Your portfolio is now running! 🎉

---

## 🎨 What You'll See

### Hero Section
- **Character Image** with cursor reveal effect
- Move your cursor over the character to see the video animation appear in a circular mask
- Notice the custom cursor with ripple effects when you click

### About Section
- Smooth scroll animations
- Skills grid with hover effects
- Animated text reveals

### Projects Section
- Hover over project cards for 3D transform effects
- Each card has unique gradient colors

### Contact Section
- Email link with hover animations
- Social media links
- Availability status indicator

---

## ✏️ Quick Customization Tips

### 1. Update Your Name & Email
**File**: `src/components/Contact.jsx`
```jsx
<a href="mailto:YOUR_EMAIL@example.com" className="contact-email hoverable">
  YOUR_EMAIL@example.com
</a>
```

### 2. Change Hero Title
**File**: `src/components/CharacterReveal.jsx`
```jsx
<h1 className="hero-title">
  <span className="title-line">Your</span>
  <span className="title-line">Custom</span>
  <span className="title-line accent">Title</span>
</h1>
```

### 3. Update Projects
**File**: `src/components/Projects.jsx`
- Modify the `projects` array with your actual projects

### 4. Change Colors
**File**: `src/index.css`
- Edit CSS variables under `:root`

---

## 🎯 Interactive Features to Test

✅ **Custom Cursor**: Move your mouse around
✅ **Ripple Effect**: Click anywhere on the page
✅ **Video Reveal**: Hover over the character image
✅ **Project Cards**: Hover over project cards
✅ **Smooth Scroll**: Scroll through sections
✅ **Skill Items**: Hover over skills in About section
✅ **Social Links**: Hover over social buttons

---

## 📦 Build for Production

When ready to deploy:
```bash
npm run build
```

This creates an optimized `dist` folder ready for deployment!

---

## 🐛 Troubleshooting

**Video not playing?**
- Make sure `character-animation.mp4` is in the `public` folder
- Check browser console for any errors

**Cursor not showing?**
- Refresh the page
- Make sure you're not on a touch device

**Animations not working?**
- GSAP is installed - check browser console
- Try refreshing the page

---

## 🎨 Font Stack Used

1. **Geist** - Primary UI font
2. **Outfit** - Headings
3. **Playfair Display** - Accent/Serif
4. **Space Grotesk** - Monospace
5. **Inter** - Body text
6. **Syne** - Creative sections

All fonts are loaded from Google Fonts CDN.

---

**Need help? Check the full README.md for detailed documentation!**
