# 🌟 Sora CV Bot V2

Premium Telegram CV Generator with **HTML to PDF** rendering - 20 modern templates with circular photos, progress bars, and professional layouts.

## ✨ Features

### 🎨 **20 Premium Templates**
**Page 1:**
- 💙 Azure Professional
- 💚 Emerald Corporate  
- ❤️ Ruby Creative
- 💜 Violet Executive
- 🧡 Coral Modern
- 🪶 Slate Minimalist
- 💛 Amber Bold
- 🪵 Teal Tech
- ❤️‍🔥 Crimson Leader
- 🔵 Navy Professional

**Page 2:**
- 🌲 Forest Fresh
- 🍇 Plum Premium
- ☁️ Sky Light
- ⚫ Charcoal Power
- 🌸 Rose Elegant
- 🔮 Indigo Creative
- 🟤 Bronze Classic
- 🍃 Mint Fresh
- 🌅 Sunset Vibrant
- 🌊 Ocean Deep

### ✨ **Modern Design Elements**
- ✅ **Circular profile photos** with borders
- ✅ **Progress bars** for skills (visual percentages)
- ✅ **Sidebar layouts** with color accents
- ✅ **Icons** for contact info (📧📱📍)
- ✅ **Professional typography** & spacing
- ✅ **Color schemes** per template

### 📋 **Complete Sections**
- Personal info (name, title, email, phone, location)
- Professional summary
- Work experience
- Education
- Skills (with visual progress bars)
- Projects
- Certifications
- Languages

### 💾 **Additional Features**
- Save & load CV profiles
- SQLite database persistence
- Image processing (auto-crop photos)
- Multiple font styles
- Export high-quality PDFs

## 🚀 Quick Start

### Deploy to Railway

1. **Fork/Clone Repository**
```bash
git clone https://github.com/mToz123/sora-cv-bot-v2.git
cd sora-cv-bot-v2
```

2. **Deploy on Railway**
- Go to https://railway.app/new
- Click "Deploy from GitHub"
- Select `sora-cv-bot-v2` repository
- Add environment variable: `TELEGRAM_BOT_TOKEN=your_token_here`
- Click "Deploy"

3. **Done!** Bot will be live in 2-3 minutes ✅

### Local Development

1. **Install dependencies**
```bash
npm install
```

2. **Create .env file**
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

3. **Run bot**
```bash
npm start
```

## 📝 Usage

1. Start bot: `/start`
2. Choose template from 20 options (paginated)
3. Select font style
4. Pick color scheme  
5. Upload photo (optional)
6. Enter personal info
7. Add sections (experience, education, skills, etc.)
8. Generate PDF
9. Download your professional CV! 🎉

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Telegraf** - Telegram bot framework
- **html-pdf-node** - HTML to PDF conversion
- **Sharp** - Image processing
- **SQLite3** - Database
- **HTML/CSS** - Template rendering

## 📂 Project Structure

```
sora-cv-bot-v2/
├── src/
│   ├── index.js          # Main bot logic
│   ├── pdfGenerator.js   # HTML to PDF generator
│   ├── database.js       # SQLite handler
│   └── imageProcessor.js # Image processing
├── templates/
│   └── base.html         # HTML template with CSS
├── output/               # Generated PDFs
├── temp/                 # Temporary files
├── data/                 # SQLite database
├── package.json
├── Procfile             # Railway config
├── railway.json         # Railway settings
└── README.md
```

## 🎨 Template Preview

All templates feature:
- **35% sidebar** with primary color background
- **65% main content** with professional hierarchy
- **Circular photo** (120px diameter)
- **Progress bars** for skills (8px height, accent color)
- **Section headers** with color borders
- **Responsive A4 layout** (210mm x 297mm)

## 🔧 Customization

### Add New Template

1. Add color scheme to `pdfGenerator.js`:
```javascript
newtemplate: { 
  primary: '#hexcolor', 
  secondary: '#hexcolor', 
  accent: '#hexcolor' 
}
```

2. Add button to `index.js` template selection

3. Done! Template auto-uses shared HTML layout

### Modify Layout

Edit `templates/base.html` - Pure HTML/CSS, easy to customize!

## 🐛 Troubleshooting

### Bot not responding
- Check bot token in environment variables
- Verify Railway deployment logs
- Test bot with `/start` command

### PDF generation fails
- Ensure all required fields filled (name, title, email)
- Check image file paths (use absolute paths)
- Verify Chromium installed (auto-installed by html-pdf-node)

### Image not showing
- Photo must be JPG/PNG format
- Max size: 10MB
- Use absolute file paths

## 📄 License

MIT License

## 👨‍💻 Author

**Sora** - AI Assistant  
Built with ☁️ by Sora CV Bot

## 🙏 Acknowledgments

- Telegraf.js - Telegram bot framework
- html-pdf-node - HTML to PDF conversion
- Sharp - Image processing
- Railway - Deployment platform

## 📞 Support

For support, contact: @Kariskau on Telegram

---

**Repository:** https://github.com/mToz123/sora-cv-bot-v2  
**Live Demo:** Deploy to Railway and test!

Made with ❤️ by Sora
