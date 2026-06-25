const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

class UltimateCVGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, '../output');
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generate(data, userId) {
    const outputPath = path.join(this.outputDir, `cv_${userId}_${Date.now()}.pdf`);
    
    // Validate
    if (!data.name || !data.title || !data.email) {
      throw new Error('Data tidak lengkap: nama, jabatan, atau email kosong');
    }
    
    // Defaults dalam Bahasa Indonesia
    data.phone = data.phone || 'Tidak ada';
    data.location = data.location || 'Tidak disebutkan';
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
      // 5 color palette (gradient + accents)
      const colors = this.getColorPalette(data.template || 'profesional');
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      this.renderUltimateTemplate(doc, data, colors);
      doc.save(outputPath);
      
      console.log(`✅ CV berhasil dibuat: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('❌ Error membuat PDF:', error);
      throw error;
    }
  }

  getColorPalette(template) {
    const palettes = {
      profesional: {
        primary: '#2C3E50',      // Dark Blue-Gray
        secondary: '#34495E',    // Medium Blue-Gray
        accent1: '#3498DB',      // Bright Blue
        accent2: '#1ABC9C',      // Turquoise
        accent3: '#F39C12',      // Orange
        text: '#2C3E50',
        textLight: '#7F8C8D'
      },
      kreatif: {
        primary: '#8E44AD',      // Purple
        secondary: '#9B59B6',
        accent1: '#E74C3C',      // Red
        accent2: '#F39C12',      // Orange
        accent3: '#1ABC9C',      // Turquoise
        text: '#2C3E50',
        textLight: '#7F8C8D'
      },
      modern: {
        primary: '#16A085',      // Teal
        secondary: '#1ABC9C',
        accent1: '#3498DB',      // Blue
        accent2: '#9B59B6',      // Purple
        accent3: '#E67E22',      // Orange
        text: '#2C3E50',
        textLight: '#7F8C8D'
      }
    };
    
    return palettes[template] || palettes.profesional;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  drawGradient(doc, x, y, width, height, color1, color2) {
    // Simple gradient with 20 steps
    const steps = 20;
    const stepHeight = height / steps;
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
      const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
      const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
      
      doc.setFillColor(r, g, b);
      doc.rect(x, y + i * stepHeight, width, stepHeight, 'F');
    }
  }

  renderUltimateTemplate(doc, data, colors) {
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    
    // === HEADER DENGAN GRADIENT ===
    const headerHeight = 70;
    this.drawGradient(doc, 0, 0, pageWidth, headerHeight, colors.primary, colors.secondary);
    
    // Decorative accent strip di bottom header (centered & straight)
    const accent1Rgb = this.hexToRgb(colors.accent1);
    doc.setFillColor(accent1Rgb.r, accent1Rgb.g, accent1Rgb.b);
    doc.rect(0, headerHeight - 2, pageWidth, 2, 'F');
    
    // Garis outline di top & bottom accent strip untuk ketajaman
    doc.setDrawColor(accent1Rgb.r - 20, accent1Rgb.g - 20, accent1Rgb.b - 20);
    doc.setLineWidth(0.2);
    doc.line(0, headerHeight - 2, pageWidth, headerHeight - 2);
    doc.line(0, headerHeight, pageWidth, headerHeight);
    
    // === FOTO BESAR 60MM ===
    const photoSize = 60;
    const photoX = margin;
    const photoY = margin - 5;
    
    if (data.photoPath && fs.existsSync(data.photoPath)) {
      try {
        const imgData = fs.readFileSync(data.photoPath);
        const isPng = data.photoPath.toLowerCase().endsWith('.png');
        const imgBase64 = `data:image/${isPng ? 'png' : 'jpeg'};base64,${imgData.toString('base64')}`;
        
        // Border decorative
        const accent2Rgb = this.hexToRgb(colors.accent2);
        doc.setDrawColor(accent2Rgb.r, accent2Rgb.g, accent2Rgb.b);
        doc.setLineWidth(3);
        doc.circle(photoX + photoSize/2, photoY + photoSize/2, photoSize/2 + 2, 'S');
        
        doc.addImage(imgBase64, isPng ? 'PNG' : 'JPEG', photoX, photoY, photoSize, photoSize);
      } catch (e) {
        console.error('Error foto:', e);
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(2);
        doc.circle(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 'S');
      }
    }
    
    // === NAMA & JABATAN (kanan foto) ===
    const textX = photoX + photoSize + 15;
    let textY = photoY + 15;
    
    // Nama dengan shadow effect
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    // Shadow
    doc.setTextColor(50, 50, 50);
    doc.text(data.name.toUpperCase(), textX + 0.5, textY + 0.5);
    // Main text
    doc.setTextColor(255, 255, 255);
    doc.text(data.name.toUpperCase(), textX, textY);
    
    // Decorative line bawah nama (presisi dengan width yang fix)
    const accent3Rgb = this.hexToRgb(colors.accent3);
    doc.setDrawColor(accent3Rgb.r, accent3Rgb.g, accent3Rgb.b);
    doc.setLineWidth(1.5);
    const nameWidth = doc.getTextWidth(data.name.toUpperCase());
    const maxLineWidth = pageWidth - textX - margin - 5; // Prevent overflow
    const actualLineWidth = Math.min(nameWidth, maxLineWidth);
    doc.line(textX, textY + 2, textX + actualLineWidth, textY + 2);
    
    textY += 12;
    
    // Jabatan
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(data.title, textX, textY);
    
    textY += 10;
    
    // Box kontak dengan background
    const contactBoxY = textY;
    const contactBoxWidth = pageWidth - textX - margin;
    const contactBoxHeight = 20;
    
    // Background box dengan shadow yang presisi
    // Shadow (darker, offset lebih kecil untuk ketajaman)
    doc.setFillColor(50, 50, 50, 0.15);
    doc.roundedRect(textX + 0.5, contactBoxY + 0.5, contactBoxWidth, contactBoxHeight, 2, 2, 'F');
    // Main box (crisp edges)
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(textX, contactBoxY, contactBoxWidth, contactBoxHeight, 2, 2, 'F');
    // Border outline untuk ketajaman
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(textX, contactBoxY, contactBoxWidth, contactBoxHeight, 2, 2, 'S');
    
    // Kontak details
    const textRgb = this.hexToRgb(colors.text);
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    
    let contactY = contactBoxY + 5;
    doc.text('EMAIL:', textX + 3, contactY);
    doc.setFont('times', 'normal');
    doc.text(data.email, textX + 18, contactY);
    
    contactY += 5;
    doc.setFont('times', 'bold');
    doc.text('TELEPON:', textX + 3, contactY);
    doc.setFont('times', 'normal');
    doc.text(data.phone, textX + 18, contactY);
    
    contactY += 5;
    doc.setFont('times', 'bold');
    doc.text('LOKASI:', textX + 3, contactY);
    doc.setFont('times', 'normal');
    doc.text(data.location, textX + 18, contactY);
    
    // === KONTEN UTAMA ===
    let y = headerHeight + 12;
    
    // Helper untuk section header dengan garis pemisah yang rapi
    const drawSectionHeader = (title, yPos) => {
      // Garis pemisah tipis di atas section (subtle separator)
      const separatorRgb = this.hexToRgb(colors.textLight);
      doc.setDrawColor(separatorRgb.r, separatorRgb.g, separatorRgb.b);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos - 3, pageWidth - margin, yPos - 3);
      
      yPos += 2;
      
      // Background dengan gradient
      this.drawGradient(doc, margin, yPos - 2, pageWidth - 2*margin, 10, 
                       colors.accent1, colors.accent2);
      
      // Border outline untuk section header (clean & straight)
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPos - 2, pageWidth - 2*margin, 10, 'S');
      
      // Triangle decorative corner (aligned dengan presisi)
      const triangleRgb = this.hexToRgb(colors.accent3);
      doc.setFillColor(triangleRgb.r, triangleRgb.g, triangleRgb.b);
      // Triangle path yang presisi
      doc.setDrawColor(triangleRgb.r, triangleRgb.g, triangleRgb.b);
      doc.setLineWidth(0.1);
      doc.triangle(margin, yPos - 2, margin + 8, yPos - 2, margin, yPos + 6, 'FD');
      
      // Title text
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), margin + 10, yPos + 5);
      
      // Garis bawah section header yang halus
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.3);
      doc.line(margin + 10, yPos + 7, pageWidth - margin, yPos + 7);
      
      return yPos + 14;
    };
    
    // === RINGKASAN PROFESIONAL ===
    if (data.summary) {
      y = drawSectionHeader('RINGKASAN PROFESIONAL', y);
      
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      
      const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 2*margin - 5);
      summaryLines.forEach(line => {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin + 3, y);
        y += 5;
      });
      
      y += 8;
    }
    
    // === PENGALAMAN KERJA ===
    if (data.sections.experience && data.sections.experience.length > 0) {
      y = drawSectionHeader('PENGALAMAN KERJA', y);
      
      data.sections.experience.forEach((exp, idx) => {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        
        // Square bullet dengan accent color
        const bulletRgb = this.hexToRgb(colors.accent2);
        doc.setFillColor(bulletRgb.r, bulletRgb.g, bulletRgb.b);
        doc.rect(margin + 3, y - 2, 3, 3, 'F');
        
        // Job title (bold, besar)
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        doc.text(exp.title || 'Posisi', margin + 10, y);
        
        y += 6;
        
        // Company & period dengan styling
        doc.setFont('times', 'italic');
        doc.setFontSize(10);
        const lightRgb = this.hexToRgb(colors.textLight);
        doc.setTextColor(lightRgb.r, lightRgb.g, lightRgb.b);
        doc.text(exp.company || 'Perusahaan', margin + 10, y);
        
        // Bullet separator
        doc.setFillColor(bulletRgb.r, bulletRgb.g, bulletRgb.b);
        doc.circle(margin + 10 + doc.getTextWidth(exp.company || 'Perusahaan') + 2, y - 1, 0.8, 'F');
        
        doc.text(exp.period || 'Periode', margin + 10 + doc.getTextWidth(exp.company || 'Perusahaan') + 5, y);
        
        y += 6;
        
        // Description
        if (exp.description) {
          doc.setFont('times', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          
          const descLines = doc.splitTextToSize(exp.description, pageWidth - 2*margin - 15);
          descLines.forEach(line => {
            if (y > pageHeight - 30) {
              doc.addPage();
              y = margin;
            }
            // Small circle bullet untuk description
            doc.setFillColor(bulletRgb.r, bulletRgb.g, bulletRgb.b);
            doc.circle(margin + 12, y - 1.5, 1, 'F');
            doc.text(line, margin + 16, y);
            y += 5;
          });
        }
        
        y += 6;
      });
      
      y += 5;
    }
    
    // === PENDIDIKAN ===
    if (data.sections.education && data.sections.education.length > 0) {
      if (y > pageHeight - 50) {
        doc.addPage();
        y = margin;
      }
      
      y = drawSectionHeader('PENDIDIKAN', y);
      
      data.sections.education.forEach(edu => {
        // Square bullet
        const bulletRgb = this.hexToRgb(colors.accent3);
        doc.setFillColor(bulletRgb.r, bulletRgb.g, bulletRgb.b);
        doc.rect(margin + 3, y - 2, 3, 3, 'F');
        
        // Degree
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        doc.text(edu.degree || 'Gelar', margin + 10, y);
        
        y += 6;
        
        // Institution & year
        doc.setFont('times', 'italic');
        doc.setFontSize(10);
        const lightRgb = this.hexToRgb(colors.textLight);
        doc.setTextColor(lightRgb.r, lightRgb.g, lightRgb.b);
        doc.text(edu.institution || 'Institusi', margin + 10, y);
        
        doc.setFillColor(bulletRgb.r, bulletRgb.g, bulletRgb.b);
        doc.circle(margin + 10 + doc.getTextWidth(edu.institution || 'Institusi') + 2, y - 1, 0.8, 'F');
        
        doc.text(edu.year || 'Tahun', margin + 10 + doc.getTextWidth(edu.institution || 'Institusi') + 5, y);
        
        y += 8;
      });
      
      y += 5;
    }
    
    // === KETERAMPILAN ===
    if (data.sections.skills && data.sections.skills.length > 0) {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = margin;
      }
      
      y = drawSectionHeader('KETERAMPILAN', y);
      
      // Grid layout untuk skills (3 kolom)
      const colWidth = (pageWidth - 2*margin - 10) / 3;
      let col = 0;
      let skillY = y;
      
      data.sections.skills.forEach((skill, idx) => {
        const xPos = margin + 3 + (col * colWidth);
        
        // Skill dengan bullet
        const bulletRgb = this.hexToRgb(colors.accent1);
        doc.setFillColor(bulletRgb.r, bulletRgb.g, bulletRgb.b);
        doc.circle(xPos, skillY - 1, 1.2, 'F');
        
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        doc.text(skill, xPos + 3, skillY);
        
        col++;
        if (col >= 3) {
          col = 0;
          skillY += 6;
        }
      });
      
      y = skillY + (col > 0 ? 12 : 6);
    }
    
    // === PROYEK ===
    if (data.sections.projects && data.sections.projects.length > 0) {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = margin;
      }
      
      y = drawSectionHeader('PROYEK', y);
      
      data.sections.projects.forEach(proj => {
        // Square bullet
        const bulletRgb = this.hexToRgb(colors.accent1);
        doc.setFillColor(bulletRgb.r, bulletRgb.g, bulletRgb.b);
        doc.rect(margin + 3, y - 2, 3, 3, 'F');
        
        // Project name
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        doc.text(proj.name || 'Proyek', margin + 10, y);
        
        y += 6;
        
        // Description
        if (proj.description) {
          doc.setFont('times', 'normal');
          doc.setFontSize(10);
          
          const projLines = doc.splitTextToSize(proj.description, pageWidth - 2*margin - 15);
          projLines.forEach(line => {
            if (y > pageHeight - 30) {
              doc.addPage();
              y = margin;
            }
            doc.text(line, margin + 10, y);
            y += 5;
          });
        }
        
        y += 6;
      });
      
      y += 5;
    }
    
    // === BAHASA ===
    if (data.sections.languages && data.sections.languages.length > 0) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
      
      y = drawSectionHeader('BAHASA', y);
      
      data.sections.languages.forEach(lang => {
        const bulletRgb = this.hexToRgb(colors.accent2);
        doc.setFillColor(bulletRgb.r, bulletRgb.g, bulletRgb.b);
        doc.circle(margin + 5, y - 1, 1.2, 'F');
        
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        doc.text(lang.name, margin + 8, y);
        
        doc.setFont('times', 'normal');
        const lightRgb = this.hexToRgb(colors.textLight);
        doc.setTextColor(lightRgb.r, lightRgb.g, lightRgb.b);
        doc.text(' - ' + lang.level, margin + 8 + doc.getTextWidth(lang.name), y);
        
        y += 6;
      });
      
      y += 5;
    }
    
    // === SERTIFIKASI ===
    if (data.sections.certifications && data.sections.certifications.length > 0) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
      
      y = drawSectionHeader('SERTIFIKASI', y);
      
      data.sections.certifications.forEach(cert => {
        const bulletRgb = this.hexToRgb(colors.accent3);
        doc.setFillColor(bulletRgb.r, bulletRgb.g, bulletRgb.b);
        doc.circle(margin + 5, y - 1, 1.2, 'F');
        
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        doc.text(cert.name, margin + 8, y);
        
        doc.setFont('times', 'normal');
        const lightRgb = this.hexToRgb(colors.textLight);
        doc.setTextColor(lightRgb.r, lightRgb.g, lightRgb.b);
        const details = ` - ${cert.issuer} (${cert.year})`;
        doc.text(details, margin + 8 + doc.getTextWidth(cert.name), y);
        
        y += 6;
      });
    }
    
    // === FOOTER dengan page number ===
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('times', 'italic');
      doc.setFontSize(8);
      const lightRgb = this.hexToRgb(colors.textLight);
      doc.setTextColor(lightRgb.r, lightRgb.g, lightRgb.b);
      doc.text(`Halaman ${i} dari ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
    }
  }
}

module.exports = UltimateCVGenerator;
