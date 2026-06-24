const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, '../output');
    
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
      
      // Create PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Render template
      this.renderModernTemplate(doc, data, colors);

      // Save PDF
      doc.save(outputPath);

      return outputPath;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }

  renderModernTemplate(doc, data, colors) {
    const pageWidth = 210;
    const pageHeight = 297;
    const sidebarWidth = 70;
    const margin = 10;

    // === SIDEBAR ===
    // Sidebar background
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

    let sideY = 15;

    // Photo placeholder (circular simulation with square)
    if (data.photoPath && fs.existsSync(data.photoPath)) {
      try {
        const imgData = fs.readFileSync(data.photoPath);
        const imgBase64 = `data:image/jpeg;base64,${imgData.toString('base64')}`;
        doc.addImage(imgBase64, 'JPEG', 15, sideY, 40, 40);
        sideY += 45;
      } catch (e) {
        // Photo placeholder circle
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1);
        doc.circle(35, sideY + 20, 20, 'S');
        sideY += 45;
      }
    }

    // Contact Section
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTACT', margin, sideY);
    sideY += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    // Email
    doc.text('📧', margin, sideY);
    doc.text(data.email, margin + 8, sideY, { maxWidth: sidebarWidth - 20 });
    sideY += 10;

    // Phone
    doc.text('📱', margin, sideY);
    doc.text(data.phone, margin + 8, sideY, { maxWidth: sidebarWidth - 20 });
    sideY += 10;

    // Location
    doc.text('📍', margin, sideY);
    doc.text(data.location, margin + 8, sideY, { maxWidth: sidebarWidth - 20 });
    sideY += 15;

    // Skills with progress bars
    if (data.sections.skills && data.sections.skills.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('SKILLS', margin, sideY);
      sideY += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      data.sections.skills.slice(0, 8).forEach(skill => {
        // Skill name
        doc.text(skill, margin, sideY, { maxWidth: sidebarWidth - 20 });
        sideY += 5;

        // Progress bar background
        doc.setFillColor(255, 255, 255, 0.2);
        doc.rect(margin, sideY, sidebarWidth - 20, 3, 'F');

        // Progress bar fill (85% default)
        doc.setFillColor(colors.accent);
        doc.rect(margin, sideY, (sidebarWidth - 20) * 0.85, 3, 'F');
        
        sideY += 7;
      });

      sideY += 5;
    }

    // Languages
    if (data.sections.languages && data.sections.languages.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('LANGUAGES', margin, sideY);
      sideY += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      data.sections.languages.forEach(lang => {
        doc.text(`• ${lang.name}`, margin, sideY, { maxWidth: sidebarWidth - 20 });
        sideY += 4;
        doc.setTextColor(220, 220, 220);
        doc.setFontSize(8);
        doc.text(lang.level, margin + 3, sideY, { maxWidth: sidebarWidth - 20 });
        sideY += 7;
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
      });
    }

    // === MAIN CONTENT ===
    let mainY = 15;
    const mainX = sidebarWidth + margin;
    const mainWidth = pageWidth - sidebarWidth - margin * 2;

    // Name
    doc.setTextColor(colors.primaryRGB);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(data.name, mainX, mainY, { maxWidth: mainWidth });
    mainY += 10;

    // Title
    doc.setTextColor(colors.secondaryRGB);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(data.title, mainX, mainY, { maxWidth: mainWidth });
    mainY += 12;

    // Summary
    if (data.summary) {
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(data.summary, mainWidth);
      doc.text(summaryLines, mainX, mainY);
      mainY += summaryLines.length * 5 + 8;
    }

    // Experience
    if (data.sections.experience && data.sections.experience.length > 0) {
      doc.setTextColor(colors.primaryRGB);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EXPERIENCE', mainX, mainY);
      mainY += 7;

      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);

      data.sections.experience.forEach(exp => {
        doc.setFont('helvetica', 'bold');
        doc.text(exp.title, mainX, mainY, { maxWidth: mainWidth });
        mainY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.secondaryRGB);
        doc.text(`${exp.company} | ${exp.period}`, mainX, mainY, { maxWidth: mainWidth });
        mainY += 5;

        if (exp.description) {
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          const descLines = doc.splitTextToSize(exp.description, mainWidth);
          doc.text(descLines, mainX, mainY);
          mainY += descLines.length * 4 + 5;
        }

        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        mainY += 3;
      });

      mainY += 5;
    }

    // Education
    if (data.sections.education && data.sections.education.length > 0) {
      doc.setTextColor(colors.primaryRGB);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EDUCATION', mainX, mainY);
      mainY += 7;

      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);

      data.sections.education.forEach(edu => {
        doc.setFont('helvetica', 'bold');
        doc.text(edu.degree, mainX, mainY, { maxWidth: mainWidth });
        mainY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.secondaryRGB);
        doc.text(`${edu.institution} | ${edu.year}`, mainX, mainY, { maxWidth: mainWidth });
        mainY += 8;

        doc.setTextColor(30, 30, 30);
      });

      mainY += 5;
    }

    // Projects
    if (data.sections.projects && data.sections.projects.length > 0) {
      doc.setTextColor(colors.primaryRGB);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PROJECTS', mainX, mainY);
      mainY += 7;

      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);

      data.sections.projects.forEach(proj => {
        doc.setFont('helvetica', 'bold');
        doc.text(proj.name, mainX, mainY, { maxWidth: mainWidth });
        mainY += 5;

        if (proj.description) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          const projLines = doc.splitTextToSize(proj.description, mainWidth);
          doc.text(projLines, mainX, mainY);
          mainY += projLines.length * 4 + 5;
        }

        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        mainY += 3;
      });

      mainY += 5;
    }

    // Certifications
    if (data.sections.certifications && data.sections.certifications.length > 0) {
      doc.setTextColor(colors.primaryRGB);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICATIONS', mainX, mainY);
      mainY += 7;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);

      data.sections.certifications.forEach(cert => {
        doc.text(`• ${cert.name} - ${cert.issuer} (${cert.year})`, mainX, mainY, { maxWidth: mainWidth });
        mainY += 5;
      });
    }

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('Generated by Sora CV Bot', pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
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

    const colors = colorMap[template] || colorMap.azure;
    
    // Convert hex to RGB for jsPDF
    const primaryRgb = this.hexToRgb(colors.primary);
    const secondaryRgb = this.hexToRgb(colors.secondary);
    const accentRgb = this.hexToRgb(colors.accent);

    return {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      primaryRGB: [primaryRgb.r, primaryRgb.g, primaryRgb.b],
      secondaryRGB: [secondaryRgb.r, secondaryRgb.g, secondaryRgb.b],
      accentRGB: [accentRgb.r, accentRgb.g, accentRgb.b]
    };
  }
}

module.exports = PDFGenerator;
