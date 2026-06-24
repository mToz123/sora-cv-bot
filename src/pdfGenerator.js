const htmlPdf = require('html-pdf-node');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, '../output');
    this.templatesDir = path.join(__dirname, '../templates');
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generate(data, userId) {
    const outputPath = path.join(this.outputDir, `cv_${userId}_${Date.now()}.pdf`);
    
    // Validate required fields
    if (!data.name || !data.title || !data.email) {
      throw new Error('Missing required fields: name, title, or email');
    }
    
    // Set defaults
    data.phone = data.phone || 'N/A';
    data.location = data.location || 'N/A';
    data.summary = data.summary || '';
    data.sections = data.sections || {
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    };

    try {
      // Get template colors
      const colors = this.getTemplateColors(data.template);
      
      // Load HTML template
      const templatePath = path.join(this.templatesDir, 'base.html');
      let html = fs.readFileSync(templatePath, 'utf8');
      
      // Replace colors
      html = html.replace(/{{primaryColor}}/g, colors.primary);
      html = html.replace(/{{secondaryColor}}/g, colors.secondary);
      html = html.replace(/{{accentColor}}/g, colors.accent);
      
      // Prepare data for template
      const templateData = {
        name: data.name,
        jobTitle: data.title,
        email: data.email,
        phone: data.phone,
        location: data.location,
        summary: data.summary,
        photoPath: data.photoPath ? `file://${data.photoPath.replace(/\\/g, '/')}` : null,
        skills: data.sections.skills.map(skill => ({
          name: skill,
          level: 85 // Default skill level
        })),
        languages: data.sections.languages || [],
        experience: data.sections.experience || [],
        education: data.sections.education || [],
        projects: data.sections.projects || [],
        certifications: data.sections.certifications || []
      };

      // Simple template replacement
      html = this.replaceTemplate(html, templateData);

      // Generate PDF with html-pdf-node
      const options = {
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
        path: outputPath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      };

      const file = { content: html };
      
      await htmlPdf.generatePdf(file, options);

      return outputPath;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }

  replaceTemplate(html, data) {
    // Replace simple variables
    html = html.replace(/{{name}}/g, this.escapeHtml(data.name || ''));
    html = html.replace(/{{jobTitle}}/g, this.escapeHtml(data.jobTitle || ''));
    html = html.replace(/{{email}}/g, this.escapeHtml(data.email || ''));
    html = html.replace(/{{phone}}/g, this.escapeHtml(data.phone || ''));
    html = html.replace(/{{location}}/g, this.escapeHtml(data.location || ''));
    html = html.replace(/{{summary}}/g, this.escapeHtml(data.summary || ''));

    // Photo
    if (data.photoPath) {
      html = html.replace(/{{#if photoPath}}[\s\S]*?{{\/if}}/g, (match) => {
        return match
          .replace(/{{#if photoPath}}/g, '')
          .replace(/{{\/if}}/g, '')
          .replace(/{{photoPath}}/g, data.photoPath);
      });
    } else {
      html = html.replace(/{{#if photoPath}}[\s\S]*?{{\/if}}/g, '');
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      let skillsHtml = '';
      data.skills.forEach(skill => {
        skillsHtml += `
          <div class="skill-item">
            <div class="skill-name">${this.escapeHtml(skill.name)}</div>
            <div class="skill-bar">
              <div class="skill-progress" style="width: ${skill.level}%"></div>
            </div>
          </div>
        `;
      });
      html = html.replace(/{{#if skills}}[\s\S]*?{{\/if}}/g, (match) => {
        return match
          .replace(/{{#if skills}}/g, '')
          .replace(/{{#each skills}}[\s\S]*?{{\/each}}/g, skillsHtml)
          .replace(/{{\/if}}/g, '');
      });
    } else {
      html = html.replace(/{{#if skills}}[\s\S]*?{{\/if}}/g, '');
    }

    // Languages
    if (data.languages && data.languages.length > 0) {
      let langsHtml = '';
      data.languages.forEach(lang => {
        langsHtml += `
          <div class="language-item">
            <div class="language-name">${this.escapeHtml(lang.name)}</div>
            <div class="language-level">${this.escapeHtml(lang.level)}</div>
          </div>
        `;
      });
      html = html.replace(/{{#if languages}}[\s\S]*?{{\/if}}/g, (match) => {
        return match
          .replace(/{{#if languages}}/g, '')
          .replace(/{{#each languages}}[\s\S]*?{{\/each}}/g, langsHtml)
          .replace(/{{\/if}}/g, '');
      });
    } else {
      html = html.replace(/{{#if languages}}[\s\S]*?{{\/if}}/g, '');
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
      let expHtml = '';
      data.experience.forEach(exp => {
        expHtml += `
          <div class="experience-item">
            <div class="item-title">${this.escapeHtml(exp.title)}</div>
            <div class="item-subtitle">${this.escapeHtml(exp.company)} | ${this.escapeHtml(exp.period)}</div>
            ${exp.description ? `<div class="item-description">${this.escapeHtml(exp.description)}</div>` : ''}
          </div>
        `;
      });
      html = html.replace(/{{#if experience}}[\s\S]*?{{\/if}}/g, `
        <div class="content-section">
          <div class="content-section-title">Experience</div>
          ${expHtml}
        </div>
      `);
    } else {
      html = html.replace(/{{#if experience}}[\s\S]*?{{\/if}}/g, '');
    }

    // Education
    if (data.education && data.education.length > 0) {
      let eduHtml = '';
      data.education.forEach(edu => {
        eduHtml += `
          <div class="education-item">
            <div class="item-title">${this.escapeHtml(edu.degree)}</div>
            <div class="item-subtitle">${this.escapeHtml(edu.institution)} | ${this.escapeHtml(edu.year)}</div>
          </div>
        `;
      });
      html = html.replace(/{{#if education}}[\s\S]*?{{\/if}}/g, `
        <div class="content-section">
          <div class="content-section-title">Education</div>
          ${eduHtml}
        </div>
      `);
    } else {
      html = html.replace(/{{#if education}}[\s\S]*?{{\/if}}/g, '');
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      let projHtml = '';
      data.projects.forEach(proj => {
        projHtml += `
          <div class="project-item">
            <div class="item-title">${this.escapeHtml(proj.name)}</div>
            ${proj.description ? `<div class="item-description">${this.escapeHtml(proj.description)}</div>` : ''}
          </div>
        `;
      });
      html = html.replace(/{{#if projects}}[\s\S]*?{{\/if}}/g, `
        <div class="content-section">
          <div class="content-section-title">Projects</div>
          ${projHtml}
        </div>
      `);
    } else {
      html = html.replace(/{{#if projects}}[\s\S]*?{{\/if}}/g, '');
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      let certHtml = '';
      data.certifications.forEach(cert => {
        certHtml += `
          <div class="certification-item">
            ${this.escapeHtml(cert.name)} - ${this.escapeHtml(cert.issuer)} (${this.escapeHtml(cert.year)})
          </div>
        `;
      });
      html = html.replace(/{{#if certifications}}[\s\S]*?{{\/if}}/g, `
        <div class="content-section">
          <div class="content-section-title">Certifications</div>
          ${certHtml}
        </div>
      `);
    } else {
      html = html.replace(/{{#if certifications}}[\s\S]*?{{\/if}}/g, '');
    }

    return html;
  }

  escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  getTemplateColors(template) {
    const colorMap = {
      azure: { primary: '#3b82f6', secondary: '#2563eb', accent: '#60a5fa' },
      emerald: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
      ruby: { primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' },
      violet: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
      coral: { primary: '#f97316', secondary: '#ea580c', accent: '#fb923c' },
      slate: { primary: '#64748b', secondary: '#475569', accent: '#94a3b8' },
      amber: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
      teal: { primary: '#14b8a6', secondary: '#0d9488', accent: '#2dd4bf' },
      crimson: { primary: '#be123c', secondary: '#9f1239', accent: '#e11d48' },
      navy: { primary: '#1e40af', secondary: '#1e3a8a', accent: '#3b82f6' },
      forest: { primary: '#16a34a', secondary: '#15803d', accent: '#22c55e' },
      plum: { primary: '#a21caf', secondary: '#86198f', accent: '#c026d3' },
      sky: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8' },
      charcoal: { primary: '#374151', secondary: '#1f2937', accent: '#6b7280' },
      rose: { primary: '#f43f5e', secondary: '#e11d48', accent: '#fb7185' },
      indigo: { primary: '#6366f1', secondary: '#4f46e5', accent: '#818cf8' },
      bronze: { primary: '#92400e', secondary: '#78350f', accent: '#b45309' },
      mint: { primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee' },
      sunset: { primary: '#f97316', secondary: '#dc2626', accent: '#fb923c' },
      ocean: { primary: '#0e7490', secondary: '#155e75', accent: '#06b6d4' }
    };
    return colorMap[template] || colorMap.azure;
  }
}

module.exports = PDFGenerator;
