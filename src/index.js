const { Telegraf, Markup } = require('telegraf');
const Database = require('./database');
const PDFGenerator = require('./pdfGenerator');
const ImageProcessor = require('./imageProcessor');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const db = new Database();
const pdfGen = new PDFGenerator();
const imgProc = new ImageProcessor();

// User session storage
const userSessions = new Map();

// Helper: Get or create session
function getSession(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {
      step: 'idle',
      data: {},
      tempFiles: []
    });
  }
  return userSessions.get(userId);
}

// Helper: Clear temp files
function clearTempFiles(session) {
  session.tempFiles.forEach(file => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
  session.tempFiles = [];
}

// Start Command
bot.command('start', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.step = 'idle';
  
  await ctx.reply(
    `🌟 *Selamat Datang di Sora CV Bot!*\n\n` +
    `Bot profesional untuk membuat CV yang menarik dan ATS-friendly.\n\n` +
    `✨ *Fitur Unggulan:*\n` +
    `• 📸 Upload foto profile\n` +
    `• 🎨 5+ template layout (Professional, Modern, Creative, dll)\n` +
    `• 🔤 Multiple font styles\n` +
    `• 🎨 Custom color schemes\n` +
    `• 📄 Export PDF berkualitas tinggi\n` +
    `• 💾 Save & load profiles\n` +
    `• 👀 Preview sebelum download\n\n` +
    `Gunakan /newcv untuk mulai membuat CV baru!`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📝 Buat CV Baru', 'new_cv')],
        [Markup.button.callback('📋 Load Profile', 'load_profile')],
        [Markup.button.callback('ℹ️ Bantuan', 'help')]
      ])
    }
  );
});

// New CV Command
bot.command('newcv', (ctx) => {
  startNewCV(ctx);
});

bot.action('new_cv', (ctx) => {
  ctx.answerCbQuery();
  startNewCV(ctx);
});

async function startNewCV(ctx) {
  const session = getSession(ctx.from.id);
  session.step = 'choose_template';
  session.data = {};
  
  await ctx.reply(
    '🎨 *Pilih Template CV (Page 1/2):*\n\n' +
    'Semua template modern dengan progress bars, icons, & circular photo!',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('💙 Azure Professional', 'template_azure')],
        [Markup.button.callback('💚 Emerald Corporate', 'template_emerald')],
        [Markup.button.callback('❤️ Ruby Creative', 'template_ruby')],
        [Markup.button.callback('💜 Violet Executive', 'template_violet')],
        [Markup.button.callback('🧡 Coral Modern', 'template_coral')],
        [Markup.button.callback('🩶 Slate Minimalist', 'template_slate')],
        [Markup.button.callback('💛 Amber Bold', 'template_amber')],
        [Markup.button.callback('🩵 Teal Tech', 'template_teal')],
        [Markup.button.callback('❤️‍🔥 Crimson Leader', 'template_crimson')],
        [Markup.button.callback('🔵 Navy Professional', 'template_navy')],
        [Markup.button.callback('➡️ More Templates (Page 2)', 'templates_page2')]
      ])
    }
  );
}

// Template Page 2
bot.action('templates_page2', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    '🎨 *Pilih Template CV (Page 2/2):*',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🌲 Forest Fresh', 'template_forest')],
        [Markup.button.callback('🍇 Plum Premium', 'template_plum')],
        [Markup.button.callback('☁️ Sky Light', 'template_sky')],
        [Markup.button.callback('⚫ Charcoal Power', 'template_charcoal')],
        [Markup.button.callback('🌸 Rose Elegant', 'template_rose')],
        [Markup.button.callback('🔮 Indigo Creative', 'template_indigo')],
        [Markup.button.callback('🟤 Bronze Classic', 'template_bronze')],
        [Markup.button.callback('🍃 Mint Fresh', 'template_mint')],
        [Markup.button.callback('🌅 Sunset Vibrant', 'template_sunset')],
        [Markup.button.callback('🌊 Ocean Deep', 'template_ocean')],
        [Markup.button.callback('⬅️ Back to Page 1', 'templates_page1')]
      ])
    }
  );
});

// Back to Page 1
bot.action('templates_page1', async (ctx) => {
  await ctx.answerCbQuery();
  const session = getSession(ctx.from.id);
  await ctx.reply(
    '🎨 *Pilih Template CV (Page 1/2):*\n\n' +
    'Semua template modern dengan progress bars, icons, & circular photo!',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('💙 Azure Professional', 'template_azure')],
        [Markup.button.callback('💚 Emerald Corporate', 'template_emerald')],
        [Markup.button.callback('❤️ Ruby Creative', 'template_ruby')],
        [Markup.button.callback('💜 Violet Executive', 'template_violet')],
        [Markup.button.callback('🧡 Coral Modern', 'template_coral')],
        [Markup.button.callback('🩶 Slate Minimalist', 'template_slate')],
        [Markup.button.callback('💛 Amber Bold', 'template_amber')],
        [Markup.button.callback('🩵 Teal Tech', 'template_teal')],
        [Markup.button.callback('❤️‍🔥 Crimson Leader', 'template_crimson')],
        [Markup.button.callback('🔵 Navy Professional', 'template_navy')],
        [Markup.button.callback('➡️ More Templates (Page 2)', 'templates_page2')]
      ])
    }
  );
});

// Template Selection
bot.action(/template_(.+)/, async (ctx) => {
  const template = ctx.match[1];
  const session = getSession(ctx.from.id);
  session.data.template = template;
  session.step = 'choose_font';
  
  await ctx.answerCbQuery(`Template ${template} dipilih! ✅`);
  await ctx.reply(
    '🔤 *Pilih Font Style:*',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Helvetica (Modern)', 'font_helvetica')],
        [Markup.button.callback('Times (Classic)', 'font_times')],
        [Markup.button.callback('Courier (Monospace)', 'font_courier')],
        [Markup.button.callback('Georgia (Elegant)', 'font_georgia')]
      ])
    }
  );
});

// Font Selection
bot.action(/font_(.+)/, async (ctx) => {
  const font = ctx.match[1];
  const session = getSession(ctx.from.id);
  session.data.font = font;
  session.step = 'choose_color';
  
  await ctx.answerCbQuery(`Font ${font} dipilih! ✅`);
  await ctx.reply(
    '🎨 *Pilih Color Scheme:*',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🔵 Blue Professional', 'color_blue')],
        [Markup.button.callback('🟢 Green Fresh', 'color_green')],
        [Markup.button.callback('🔴 Red Bold', 'color_red')],
        [Markup.button.callback('🟣 Purple Creative', 'color_purple')],
        [Markup.button.callback('⚫ Black & White', 'color_bw')]
      ])
    }
  );
});

// Color Selection
bot.action(/color_(.+)/, async (ctx) => {
  const color = ctx.match[1];
  const session = getSession(ctx.from.id);
  session.data.colorScheme = color;
  session.step = 'upload_photo';
  
  await ctx.answerCbQuery(`Color ${color} dipilih! ✅`);
  await ctx.reply(
    '📸 *Upload Foto Profile*\n\n' +
    'Kirim foto kamu (opsional, bisa skip dengan /skip)\n\n' +
    '💡 Tips: Gunakan foto formal dengan background polos',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('⏭️ Skip (Tanpa Foto)', 'skip_photo')]
      ])
    }
  );
});

// Photo Upload Handler
bot.on('photo', async (ctx) => {
  const session = getSession(ctx.from.id);
  
  if (session.step === 'upload_photo') {
    try {
      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      const file = await ctx.telegram.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      
      // Download and process image
      const processedPath = await imgProc.downloadAndProcess(fileUrl, ctx.from.id);
      session.data.photoPath = processedPath;
      session.tempFiles.push(processedPath);
      
      await ctx.reply('✅ Foto berhasil diupload!');
      askPersonalInfo(ctx);
    } catch (error) {
      await ctx.reply('❌ Gagal memproses foto. Coba lagi atau /skip');
    }
  }
});

// Skip Photo
bot.action('skip_photo', async (ctx) => {
  await ctx.answerCbQuery('Foto diskip');
  askPersonalInfo(ctx);
});

// Ask Personal Info
async function askPersonalInfo(ctx) {
  const session = getSession(ctx.from.id);
  session.step = 'input_name';
  
  await ctx.reply(
    '📝 *Sekarang masukkan data diri kamu:*\n\n' +
    'Kirim *Nama Lengkap* kamu:',
    { parse_mode: 'Markdown' }
  );
}

// Text Input Handler
bot.on('text', async (ctx) => {
  const session = getSession(ctx.from.id);
  const text = ctx.message.text;
  
  // Skip commands
  if (text.startsWith('/')) return;
  
  switch (session.step) {
    case 'input_name':
      session.data.name = text;
      session.step = 'input_title';
      await ctx.reply('👔 Kirim *Job Title* / Profesi kamu:', { parse_mode: 'Markdown' });
      break;
      
    case 'input_title':
      session.data.title = text;
      session.step = 'input_email';
      await ctx.reply('📧 Kirim *Email* kamu:', { parse_mode: 'Markdown' });
      break;
      
    case 'input_email':
      session.data.email = text;
      session.step = 'input_phone';
      await ctx.reply('📱 Kirim *Nomor Telepon* kamu:', { parse_mode: 'Markdown' });
      break;
      
    case 'input_phone':
      session.data.phone = text;
      session.step = 'input_location';
      await ctx.reply('📍 Kirim *Lokasi* kamu (Kota, Negara):', { parse_mode: 'Markdown' });
      break;
      
    case 'input_location':
      session.data.location = text;
      session.step = 'input_summary';
      await ctx.reply(
        '💬 Kirim *Professional Summary* kamu:\n\n' +
        '(2-3 kalimat tentang background & keahlian)',
        { parse_mode: 'Markdown' }
      );
      break;
      
    case 'input_summary':
      session.data.summary = text;
      session.step = 'choose_sections';
      await showSectionMenu(ctx);
      break;
      
    // Experience handlers
    case 'add_exp_title':
      if (!session.data.tempExp) session.data.tempExp = {};
      session.data.tempExp.title = text;
      session.step = 'add_exp_company';
      await ctx.reply('🏢 *Company Name:*', { parse_mode: 'Markdown' });
      break;
      
    case 'add_exp_company':
      session.data.tempExp.company = text;
      session.step = 'add_exp_period';
      await ctx.reply('📅 *Period* (e.g. Jan 2020 - Present):', { parse_mode: 'Markdown' });
      break;
      
    case 'add_exp_period':
      session.data.tempExp.period = text;
      session.step = 'add_exp_description';
      await ctx.reply('📝 *Job Description* (optional, /skip to skip):', { parse_mode: 'Markdown' });
      break;
      
    case 'add_exp_description':
      session.data.tempExp.description = text;
      session.data.sections.experience.push(session.data.tempExp);
      delete session.data.tempExp;
      await ctx.reply('✅ Experience added!');
      await showSectionMenu(ctx);
      break;
      
    // Education handlers
    case 'add_edu_degree':
      if (!session.data.tempEdu) session.data.tempEdu = {};
      session.data.tempEdu.degree = text;
      session.step = 'add_edu_institution';
      await ctx.reply('🏫 *Institution Name:*', { parse_mode: 'Markdown' });
      break;
      
    case 'add_edu_institution':
      session.data.tempEdu.institution = text;
      session.step = 'add_edu_year';
      await ctx.reply('📅 *Year* (e.g. 2018-2022):', { parse_mode: 'Markdown' });
      break;
      
    case 'add_edu_year':
      session.data.tempEdu.year = text;
      session.data.sections.education.push(session.data.tempEdu);
      delete session.data.tempEdu;
      await ctx.reply('✅ Education added!');
      await showSectionMenu(ctx);
      break;
      
    // Skills handler
    case 'add_skills_input':
      const skills = text.split(',').map(s => s.trim());
      session.data.sections.skills.push(...skills);
      await ctx.reply(`✅ Added ${skills.length} skills!`);
      await showSectionMenu(ctx);
      break;
      
    // Projects handler
    case 'add_proj_name':
      if (!session.data.tempProj) session.data.tempProj = {};
      session.data.tempProj.name = text;
      session.step = 'add_proj_description';
      await ctx.reply('📝 *Project Description* (optional, /skip to skip):', { parse_mode: 'Markdown' });
      break;
      
    case 'add_proj_description':
      session.data.tempProj.description = text;
      session.data.sections.projects.push(session.data.tempProj);
      delete session.data.tempProj;
      await ctx.reply('✅ Project added!');
      await showSectionMenu(ctx);
      break;
      
    // Certifications handler
    case 'add_cert_name':
      if (!session.data.tempCert) session.data.tempCert = {};
      session.data.tempCert.name = text;
      session.step = 'add_cert_issuer';
      await ctx.reply('🏢 *Issuer/Organization:*', { parse_mode: 'Markdown' });
      break;
      
    case 'add_cert_issuer':
      session.data.tempCert.issuer = text;
      session.step = 'add_cert_year';
      await ctx.reply('📅 *Year:*', { parse_mode: 'Markdown' });
      break;
      
    case 'add_cert_year':
      session.data.tempCert.year = text;
      session.data.sections.certifications.push(session.data.tempCert);
      delete session.data.tempCert;
      await ctx.reply('✅ Certification added!');
      await showSectionMenu(ctx);
      break;
      
    // Languages handler
    case 'add_lang_name':
      if (!session.data.tempLang) session.data.tempLang = {};
      session.data.tempLang.name = text;
      session.step = 'add_lang_level';
      await ctx.reply('📊 *Proficiency Level* (e.g. Native, Fluent, Intermediate):', { parse_mode: 'Markdown' });
      break;
      
    case 'add_lang_level':
      session.data.tempLang.level = text;
      session.data.sections.languages.push(session.data.tempLang);
      delete session.data.tempLang;
      await ctx.reply('✅ Language added!');
      await showSectionMenu(ctx);
      break;
  }
});

// Section Menu
async function showSectionMenu(ctx) {
  const session = getSession(ctx.from.id);
  const data = session.data;
  
  // Initialize sections if not exists
  if (!data.sections) {
    data.sections = {
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    };
  }
  
  await ctx.reply(
    '📋 *Pilih Section untuk ditambahkan:*\n\n' +
    `✅ Experience: ${data.sections.experience.length} items\n` +
    `✅ Education: ${data.sections.education.length} items\n` +
    `✅ Skills: ${data.sections.skills.length} items\n` +
    `✅ Projects: ${data.sections.projects.length} items\n` +
    `✅ Certifications: ${data.sections.certifications.length} items\n` +
    `✅ Languages: ${data.sections.languages.length} items`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('💼 Add Experience', 'add_experience')],
        [Markup.button.callback('🎓 Add Education', 'add_education')],
        [Markup.button.callback('⚡ Add Skills', 'add_skills')],
        [Markup.button.callback('🚀 Add Projects', 'add_projects')],
        [Markup.button.callback('📜 Add Certifications', 'add_certs')],
        [Markup.button.callback('🌍 Add Languages', 'add_languages')],
        [Markup.button.callback('✅ Generate CV', 'generate_cv')]
      ])
    }
  );
}

// Add Experience
bot.action('add_experience', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.step = 'add_exp_title';
  
  await ctx.answerCbQuery();
  await ctx.reply('💼 *Job Title:*', { parse_mode: 'Markdown' });
});

// Add Education
bot.action('add_education', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.step = 'add_edu_degree';
  
  await ctx.answerCbQuery();
  await ctx.reply('🎓 *Degree/Major:*', { parse_mode: 'Markdown' });
});

// Add Skills
bot.action('add_skills', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.step = 'add_skills_input';
  
  await ctx.answerCbQuery();
  await ctx.reply('⚡ *Skills* (comma separated, e.g. JavaScript, Python, React):', { parse_mode: 'Markdown' });
});

// Add Projects
bot.action('add_projects', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.step = 'add_proj_name';
  
  await ctx.answerCbQuery();
  await ctx.reply('🚀 *Project Name:*', { parse_mode: 'Markdown' });
});

// Add Certifications
bot.action('add_certs', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.step = 'add_cert_name';
  
  await ctx.answerCbQuery();
  await ctx.reply('📜 *Certification Name:*', { parse_mode: 'Markdown' });
});

// Add Languages
bot.action('add_languages', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.step = 'add_lang_name';
  
  await ctx.answerCbQuery();
  await ctx.reply('🌍 *Language Name:*', { parse_mode: 'Markdown' });
});

// Skip handler
bot.command('skip', async (ctx) => {
  const session = getSession(ctx.from.id);
  
  if (session.step === 'add_exp_description') {
    session.data.tempExp.description = '';
    session.data.sections.experience.push(session.data.tempExp);
    delete session.data.tempExp;
    await ctx.reply('✅ Experience added (no description)');
    await showSectionMenu(ctx);
  } else if (session.step === 'add_proj_description') {
    session.data.tempProj.description = '';
    session.data.sections.projects.push(session.data.tempProj);
    delete session.data.tempProj;
    await ctx.reply('✅ Project added (no description)');
    await showSectionMenu(ctx);
  } else {
    await ctx.reply('❌ Cannot skip this step');
  }
});

// Generate CV
bot.action('generate_cv', async (ctx) => {
  await ctx.answerCbQuery('Generating CV...');
  const session = getSession(ctx.from.id);
  
  try {
    await ctx.reply('⏳ Sedang membuat CV kamu...');
    
    // Generate PDF
    const pdfPath = await pdfGen.generate(session.data, ctx.from.id);
    session.tempFiles.push(pdfPath);
    
    // Send PDF
    await ctx.replyWithDocument(
      { source: pdfPath, filename: `CV_${session.data.name.replace(/\s/g, '_')}.pdf` },
      {
        caption: '✅ *CV kamu sudah jadi!*\n\n' +
          `📄 Template: ${session.data.template}\n` +
          `🔤 Font: ${session.data.font}\n` +
          `🎨 Color: ${session.data.colorScheme}`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('💾 Save Profile', 'save_profile')],
          [Markup.button.callback('📝 Edit CV', 'edit_cv')],
          [Markup.button.callback('🆕 New CV', 'new_cv')]
        ])
      }
    );
    
    // Clear temp files after sending
    setTimeout(() => clearTempFiles(session), 5000);
    
  } catch (error) {
    console.error('Generate error:', error);
    await ctx.reply('❌ Gagal membuat CV. Coba lagi!');
  }
});

// Help Command
bot.command('help', async (ctx) => {
  await ctx.reply(
    '📚 *Bantuan Sora CV Bot*\n\n' +
    '*Commands:*\n' +
    '/start - Mulai bot\n' +
    '/newcv - Buat CV baru\n' +
    '/help - Bantuan\n' +
    '/cancel - Cancel proses\n\n' +
    '*Tips:*\n' +
    '• Gunakan foto formal untuk hasil terbaik\n' +
    '• Isi semua section untuk CV lengkap\n' +
    '• Preview sebelum download\n' +
    '• Save profile untuk edit nanti',
    { parse_mode: 'Markdown' }
  );
});

// Cancel Command
bot.command('cancel', async (ctx) => {
  const session = getSession(ctx.from.id);
  clearTempFiles(session);
  session.step = 'idle';
  session.data = {};
  
  await ctx.reply('❌ Proses dibatalkan. Gunakan /start untuk mulai lagi.');
});

// Error Handler
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('❌ Terjadi error. Gunakan /cancel dan coba lagi.');
});

// Launch Bot
bot.launch().then(() => {
  console.log('🚀 Sora CV Bot is running!');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
