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

      // Render new hybrid modern template
      this.renderHybridModernTemplate(doc, data, colors);

      // Save PDF
      doc.save(outputPath);
      
      console.log(`✅ PDF generated: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  getTemplateColors(template) {
    const colorSchemes = {
      azure: {
        primary: [101, 67, 33],       // Dark Brown #654321 (header bg)
        secondary: [139, 90, 43],     // Medium Brown #8b5a2b (section headers)
        accent: [0, 0, 0],            // Black #000000 (titles, emphasis)
        highlight: [205, 133, 63],    // Light Brown/Peru #cd853f (subtle accents)
        background: [245, 245, 220],  // Beige #f5f5dc (soft background for sections)
        text: [0, 0, 0],              // Black text
        subtext: [64, 64, 64]         // Dark gray
      },
      emerald: {
        primary: [101, 67, 33],
        secondary: [139, 90, 43],
        accent: [0, 0, 0],
        highlight: [205, 133, 63],
        background: [245, 245, 220],
        text: [0, 0, 0],
        subtext: [64, 64, 64]
      },
      ruby: {
        primary: [101, 67, 33],
        secondary: [139, 90, 43],
        accent: [0, 0, 0],
        highlight: [205, 133, 63],
        background: [245, 245, 220],
        text: [0, 0, 0],
        subtext: [64, 64, 64]
      },
      violet: {
        primary: [101, 67, 33],
        secondary: [139, 90, 43],
        accent: [0, 0, 0],
        highlight: [205, 133, 63],
        background: [245, 245, 220],
        text: [0, 0, 0],
        subtext: [64, 64, 64]
      },
      slate: {
        primary: [101, 67, 33],
        secondary: [139, 90, 43],
        accent: [0, 0, 0],
        highlight: [205, 133, 63],
        background: [245, 245, 220],
        text: [0, 0, 0],
        subtext: [64, 64, 64]
      }
    };

    return colorSchemes[template] || colorSchemes.azure;
  }

  renderHybridModernTemplate(doc, data, colors) {
    const pageWidth = 210;  // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 20;      // Generous margins (2026 trend)
    const contentWidth = pageWidth - (margin * 2);
    
    let y = margin;

    // ========================================
    // HEADER ACCENT BLOCK (Top 25%)
    // ========================================
    const headerHeight = 70;
    
    // Gradient background (primary → secondary)
    this.drawGradientRect(doc, 0, 0, pageWidth, headerHeight, colors.primary, colors.secondary);
    
    // Decorative border at bottom of header (highlight color)
    doc.setFillColor(...colors.highlight);
    doc.rect(0, headerHeight - 3, pageWidth, 3, 'F');
    
    // Photo (BIGGER - 60mm)
    const photoSize = 60;
    const photoX = margin;
    const photoY = margin - 5;
    
    if (data.photoPath && fs.existsSync(data.photoPath)) {
      try {
        const photoData = fs.readFileSync(data.photoPath);
        const base64 = photoData.toString('base64');
        const isPng = data.photoPath.toLowerCase().endsWith('.png');
        const imgBase64 = `data:image/${isPng ? 'png' : 'jpeg'};base64,${base64}`;
        
        // Render circular photo
        doc.addImage(imgBase64, isPng ? 'PNG' : 'JPEG', photoX, photoY, photoSize, photoSize);
      } catch (err) {
        console.error('Error loading photo:', err);
        // Draw placeholder circle
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(2);
        doc.circle(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 'S');
      }
    }
    
    // Name & Title (right of photo)
    const textX = photoX + photoSize + 12;
    const textY = photoY + 15;
    
    // Name in BLACK with white shadow effect (stand out on brown background)
    doc.setFont('times', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.text(data.name.toUpperCase(), textX + 0.5, textY + 0.5); // Shadow
    doc.setTextColor(0, 0, 0);
    doc.text(data.name.toUpperCase(), textX, textY);
    
    // Decorative line under name (highlight color)
    const nameWidth = doc.getTextWidth(data.name.toUpperCase());
    doc.setDrawColor(...colors.highlight);
    doc.setLineWidth(1);
    doc.line(textX, textY + 2, textX + nameWidth, textY + 2);
    
    // Title in white italic
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(data.title, textX, textY + 10);
    
    // Contact info box (beige background)
    const contactBoxY = textY + 16;
    const contactBoxHeight = 18;
    doc.setFillColor(...colors.background);
    doc.roundedRect(textX - 2, contactBoxY - 4, contentWidth - photoSize - 8, contactBoxHeight, 2, 2, 'F');
    
    // Contact details with icons (text format)
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...colors.accent);
    doc.text('EMAIL:', textX, contactBoxY);
    doc.setFont('times', 'normal');
    doc.setTextColor(...colors.text);
    doc.text(data.email, textX + 14, contactBoxY);
    
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.accent);
    doc.text('PHONE:', textX, contactBoxY + 5);
    doc.setFont('times', 'normal');
    doc.setTextColor(...colors.text);
    doc.text(data.phone, textX + 14, contactBoxY + 5);
    
    doc.setFont('times', 'bold');
    doc.setTextColor(...colors.accent);
    doc.text('LOCATION:', textX, contactBoxY + 10);
    doc.setFont('times', 'normal');
    doc.setTextColor(...colors.text);
    doc.text(data.location, textX + 20, contactBoxY + 10);
    
    // Reset Y position after header
    y = headerHeight + 15;

    // ========================================
    // PROFESSIONAL SUMMARY (with background box)
    // ========================================
    if (data.summary && data.summary.trim()) {
      y = this.renderSectionWithBackground(doc, 'PROFESSIONAL SUMMARY', y, margin, contentWidth, colors, () => {
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        
        const lines = doc.splitTextToSize(data.summary, contentWidth - 10);
        doc.text(lines, margin + 5, y + 8);
        return lines.length * 5 + 10;
      });
      
      y += 10;
    }

    // ========================================
    // EXPERIENCE
    // ========================================
    if (data.sections.experience && data.sections.experience.length > 0) {
      y = this.renderSectionWithBackground(doc, 'EXPERIENCE', y, margin, contentWidth, colors, () => {
        let sectionY = y + 8;
        
        data.sections.experience.forEach((exp, idx) => {
          // Check page break
          if (sectionY > pageHeight - 40) {
            doc.addPage();
            sectionY = margin;
          }
          
          // Decorative square bullet (highlight color)
          doc.setFillColor(...colors.highlight);
          doc.rect(margin + 5, sectionY - 3, 2, 2, 'F');
          
          // Job title (BLACK bold uppercase)
          doc.setFont('times', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(...colors.accent);
          doc.text((exp.title || 'Position').toUpperCase(), margin + 10, sectionY);
          sectionY += 6;
          
          // Company & period
          doc.setFont('times', 'italic');
          doc.setFontSize(10);
          doc.setTextColor(...colors.subtext);
          doc.text(exp.company || 'Company', margin + 5, sectionY);
          doc.setFont('times', 'normal');
          doc.text(` • ${exp.period || 'N/A'}`, margin + 5 + doc.getTextWidth(exp.company || 'Company'), sectionY);
          sectionY += 6;
          
          // Description
          if (exp.description) {
            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...colors.text);
            
            const descLines = doc.splitTextToSize(exp.description, contentWidth - 15);
            descLines.forEach(line => {
              // Bullet point
              doc.setFillColor(...colors.accent);
              doc.circle(margin + 7, sectionY - 1.5, 0.8, 'F');
              
              doc.text(line, margin + 12, sectionY);
              sectionY += 5;
            });
          }
          
          sectionY += 5; // Gap between entries
        });
        
        return sectionY - y;
      });
      
      y += 10;
    }

    // ========================================
    // EDUCATION
    // ========================================
    if (data.sections.education && data.sections.education.length > 0) {
      y = this.renderSectionWithBackground(doc, 'EDUCATION', y, margin, contentWidth, colors, () => {
        let sectionY = y + 8;
        
        data.sections.education.forEach((edu, idx) => {
          if (sectionY > pageHeight - 40) {
            doc.addPage();
            sectionY = margin;
          }
          
          // Decorative square bullet (highlight color)
          doc.setFillColor(...colors.highlight);
          doc.rect(margin + 5, sectionY - 3, 2, 2, 'F');
          
          // Degree (BLACK bold uppercase)
          doc.setFont('times', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(...colors.accent);
          doc.text((edu.degree || 'Degree').toUpperCase(), margin + 10, sectionY);
          sectionY += 6;
          
          // Institution & year
          doc.setFont('times', 'italic');
          doc.setFontSize(10);
          doc.setTextColor(...colors.subtext);
          doc.text(edu.institution || 'Institution', margin + 5, sectionY);
          doc.setFont('times', 'normal');
          doc.text(` • ${edu.year || 'N/A'}`, margin + 5 + doc.getTextWidth(edu.institution || 'Institution'), sectionY);
          sectionY += 8;
        });
        
        return sectionY - y;
      });
      
      y += 10;
    }

    // ========================================
    // SKILLS (Clean inline format, no bars)
    // ========================================
    if (data.sections.skills && data.sections.skills.length > 0) {
      y = this.renderSectionWithBackground(doc, 'SKILLS', y, margin, contentWidth, colors, () => {
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        
        // Join skills with bullets
        const skillsText = data.sections.skills.join('  •  ');
        const lines = doc.splitTextToSize(skillsText, contentWidth - 10);
        
        doc.text(lines, margin + 5, y + 8);
        return lines.length * 5 + 8;
      });
      
      y += 10;
    }

    // ========================================
    // PROJECTS
    // ========================================
    if (data.sections.projects && data.sections.projects.length > 0) {
      y = this.renderSectionWithBackground(doc, 'PROJECTS', y, margin, contentWidth, colors, () => {
        let sectionY = y + 8;
        
        data.sections.projects.forEach((proj, idx) => {
          if (sectionY > pageHeight - 40) {
            doc.addPage();
            sectionY = margin;
          }
          
          // Decorative square bullet (highlight color)
          doc.setFillColor(...colors.highlight);
          doc.rect(margin + 5, sectionY - 3, 2, 2, 'F');
          
          // Project name (BLACK bold uppercase)
          doc.setFont('times', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(...colors.accent);
          doc.text((proj.name || 'Project').toUpperCase(), margin + 10, sectionY);
          sectionY += 6;
          
          // Description
          if (proj.description) {
            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...colors.text);
            
            const lines = doc.splitTextToSize(proj.description, contentWidth - 15);
            lines.forEach(line => {
              doc.setFillColor(...colors.accent);
              doc.circle(margin + 7, sectionY - 1.5, 0.8, 'F');
              doc.text(line, margin + 12, sectionY);
              sectionY += 5;
            });
          }
          
          sectionY += 5;
        });
        
        return sectionY - y;
      });
      
      y += 10;
    }

    // ========================================
    // LANGUAGES
    // ========================================
    if (data.sections.languages && data.sections.languages.length > 0) {
      y = this.renderSectionWithBackground(doc, 'LANGUAGES', y, margin, contentWidth, colors, () => {
        let sectionY = y + 8;
        
        data.sections.languages.forEach((lang, idx) => {
          doc.setFont('times', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(...colors.text);
          doc.text(lang.name || 'Language', margin + 5, sectionY);
          
          doc.setFont('times', 'normal');
          doc.text(` - ${lang.level || 'N/A'}`, margin + 5 + doc.getTextWidth(lang.name || 'Language'), sectionY);
          sectionY += 6;
        });
        
        return sectionY - y;
      });
      
      y += 10;
    }

    // ========================================
    // CERTIFICATIONS
    // ========================================
    if (data.sections.certifications && data.sections.certifications.length > 0) {
      y = this.renderSectionWithBackground(doc, 'CERTIFICATIONS', y, margin, contentWidth, colors, () => {
        let sectionY = y + 8;
        
        data.sections.certifications.forEach((cert, idx) => {
          doc.setFont('times', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(...colors.text);
          doc.text(cert.name || 'Certification', margin + 5, sectionY);
          
          doc.setFont('times', 'normal');
          const details = `${cert.issuer || 'Issuer'} (${cert.year || 'N/A'})`;
          doc.text(` - ${details}`, margin + 5 + doc.getTextWidth(cert.name || 'Certification'), sectionY);
          sectionY += 6;
        });
        
        return sectionY - y;
      });
    }
  }

  renderSection(doc, title, y, margin, contentWidth, colors, contentRenderer) {
    const pageHeight = 297;
    
    // Check page break
    if (y > pageHeight - 50) {
      doc.addPage();
      y = 20;
    }
    
    // Section header (secondary color)
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...colors.secondary);
    doc.text(title.toUpperCase(), margin, y);
    
    // Underline (accent color)
    doc.setDrawColor(...colors.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    
    // Render content
    const contentHeight = contentRenderer();
    
    return y + contentHeight;
  }

  renderSectionWithBackground(doc, title, y, margin, contentWidth, colors, contentRenderer) {
    const pageHeight = 297;
    
    // Check page break
    if (y > pageHeight - 50) {
      doc.addPage();
      y = 20;
    }
    
    // Beige background box for section
    doc.setFillColor(...colors.background);
    doc.roundedRect(margin - 2, y - 3, contentWidth + 4, 10, 1, 1, 'F');
    
    // Section header (secondary color with highlight)
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...colors.secondary);
    doc.text(title.toUpperCase(), margin + 2, y + 4);
    
    // Decorative corner accent (highlight color)
    doc.setFillColor(...colors.highlight);
    doc.triangle(margin - 2, y - 3, margin + 5, y - 3, margin - 2, y + 4, 'F');
    
    // Underline (dual color: secondary + highlight)
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(1);
    doc.line(margin, y + 6, margin + contentWidth, y + 6);
    
    doc.setDrawColor(...colors.highlight);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);
    
    y += 10;
    
    // Render content
    const contentHeight = contentRenderer();
    
    return y + contentHeight;
  }

  drawGradientRect(doc, x, y, width, height, color1, color2) {
    // Simulate gradient with horizontal strips
    const steps = 20;
    const stripHeight = height / steps;
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const r = Math.round(color1[0] + (color2[0] - color1[0]) * ratio);
      const g = Math.round(color1[1] + (color2[1] - color1[1]) * ratio);
      const b = Math.round(color1[2] + (color2[2] - color1[2]) * ratio);
      
      doc.setFillColor(r, g, b);
      doc.rect(x, y + (i * stripHeight), width, stripHeight, 'F');
    }
  }
}

module.exports = PDFGenerator;
