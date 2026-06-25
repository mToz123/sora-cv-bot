const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

class CompactCVGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generate(data, userId) {
    const outputPath = path.join(this.outputDir, `cv_${userId}_${Date.now()}.pdf`);
    
    if (!data.name || !data.title || !data.email) {
      throw new Error('Data tidak lengkap');
    }
    
    data.phone = data.phone || 'Tidak ada';
    data.location = data.location || 'Tidak disebutkan';
    data.summary = data.summary || '';
    data.sections = data.sections || {};

    try {
      const colors = this.getColors();
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 350] // EXTRA LONG custom format
      });

      this.render(doc, data, colors);
      doc.save(outputPath);
      
      console.log(`✅ CV compact berhasil: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }

  getColors() {
    return {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent1: '#3498DB',
      accent2: '#1ABC9C',
      accent3: '#F39C12',
      text: '#2C3E50',
      textLight: '#7F8C8D'
    };
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  drawGradient(doc, x, y, w, h, c1, c2) {
    const steps = 15;
    const stepH = h / steps;
    const rgb1 = this.hexToRgb(c1);
    const rgb2 = this.hexToRgb(c2);
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
      const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
      const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
      doc.setFillColor(r, g, b);
      doc.rect(x, y + i * stepH, w, stepH, 'F');
    }
  }

  render(doc, data, colors) {
    const W = 210;
    const H = 350;
    const M = 15;
    
    // HEADER COMPACT (65mm untuk semua fit)
    const headerH = 65;
    this.drawGradient(doc, 0, 0, W, headerH, colors.primary, colors.secondary);
    
    // Accent line
    const acc1 = this.hexToRgb(colors.accent1);
    doc.setFillColor(acc1.r, acc1.g, acc1.b);
    doc.rect(0, headerH - 2, W, 2, 'F');
    
    // FOTO COMPACT (45mm)
    const photoSize = 45;
    const photoX = M;
    const photoY = 10;
    
    if (data.photoPath && fs.existsSync(data.photoPath)) {
      try {
        const imgData = fs.readFileSync(data.photoPath);
        const isPng = data.photoPath.toLowerCase().endsWith('.png');
        const imgBase64 = `data:image/${isPng ? 'png' : 'jpeg'};base64,${imgData.toString('base64')}`;
        
        const acc2 = this.hexToRgb(colors.accent2);
        doc.setDrawColor(acc2.r, acc2.g, acc2.b);
        doc.setLineWidth(1);
        doc.circle(photoX + photoSize/2, photoY + photoSize/2, photoSize/2 + 1, 'S');
        
        doc.addImage(imgBase64, isPng ? 'PNG' : 'JPEG', photoX, photoY, photoSize, photoSize);
      } catch (e) {
        console.error('Error foto:', e);
      }
    }
    
    // TEXT COMPACT (font sizes smaller, spacing dari foto)
    const textX = photoX + photoSize + 12; // Increased dari 10 supaya tidak bersentuhan border
    let textY = photoY + 6;
    
    // Nama (22pt, compact)
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(data.name.toUpperCase(), textX, textY);
    
    textY += 6; // Increased spacing dari nama ke jabatan
    
    // Jabatan (11pt)
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.text(data.title, textX, textY);
    
    textY += 7; // Increased dari 6mm supaya contact box BENAR-BENAR tidak nyentuh garis biru
    
    // Contact box compact
    const boxY = textY;
    const boxW = W - textX - M;
    const boxH = 16; // Compact dari 20
    
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(textX, boxY, boxW, boxH, 2, 2, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.roundedRect(textX, boxY, boxW, boxH, 2, 2, 'S');
    
    const txtRgb = this.hexToRgb(colors.text);
    doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    
    let cy = boxY + 4;
    doc.text('EMAIL:', textX + 2, cy);
    doc.setFont('times', 'normal');
    doc.text(data.email, textX + 14, cy);
    
    cy += 4;
    doc.setFont('times', 'bold');
    doc.text('TELEPON:', textX + 2, cy);
    doc.setFont('times', 'normal');
    doc.text(data.phone, textX + 14, cy);
    
    cy += 4;
    doc.setFont('times', 'bold');
    doc.text('LOKASI:', textX + 2, cy);
    doc.setFont('times', 'normal');
    doc.text(data.location, textX + 14, cy);
    
    // CONTENT COMPACT
    let y = headerH + 3;
    
    const sectionHeader = (title, yPos) => {
      this.drawGradient(doc, M, yPos, W - 2*M, 8, colors.accent1, colors.accent2);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), M + 5, yPos + 5.5);
      return yPos + 11; // Increased dari 10 supaya tidak tabrakan dengan content
    };
    
    // Summary compact
    if (data.summary) {
      y = sectionHeader('RINGKASAN PROFESIONAL', y);
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
      const sumLines = doc.splitTextToSize(data.summary, W - 2*M - 3);
      sumLines.forEach(line => {
        doc.text(line, M + 2, y);
        y += 4.5;
      });
      y += 2;
    }
    
    // Experience compact
    if (data.sections.experience && data.sections.experience.length > 0) {
      y = sectionHeader('PENGALAMAN KERJA', y);
      data.sections.experience.forEach(exp => {
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
        doc.text(exp.title || 'Posisi', M + 5, y);
        y += 4;
        
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        const lightRgb = this.hexToRgb(colors.textLight);
        doc.setTextColor(lightRgb.r, lightRgb.g, lightRgb.b);
        doc.text(`${exp.company || 'Perusahaan'} • ${exp.period || 'Periode'}`, M + 5, y);
        y += 4;
        
        if (exp.description) {
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
          const descLines = doc.splitTextToSize(exp.description, W - 2*M - 10);
          descLines.forEach(line => {
            doc.text('• ' + line, M + 7, y);
            y += 4.5;
          });
        }
        y += 3;
      });
      y += 2;
    }
    
    // Education compact
    if (data.sections.education && data.sections.education.length > 0) {
      y = sectionHeader('PENDIDIKAN', y);
      data.sections.education.forEach(edu => {
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
        doc.text(edu.degree || 'Gelar', M + 5, y);
        y += 4;
        
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        const lightRgb = this.hexToRgb(colors.textLight);
        doc.setTextColor(lightRgb.r, lightRgb.g, lightRgb.b);
        doc.text(`${edu.institution || 'Institusi'} • ${edu.year || 'Tahun'}`, M + 5, y);
        y += 4.5;
      });
      y += 2;
    }
    
    // Skills compact (2 columns)
    if (data.sections.skills && data.sections.skills.length > 0) {
      y = sectionHeader('KETERAMPILAN', y);
      const colW = (W - 2*M - 5) / 2;
      let col = 0;
      let skillY = y;
      
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
      
      data.sections.skills.forEach(skill => {
        const xPos = M + 3 + (col * colW);
        doc.text('• ' + skill, xPos, skillY);
        col++;
        if (col >= 2) {
          col = 0;
          skillY += 5;
        }
      });
      
      y = skillY + (col > 0 ? 5 : 2);
    }
    
    // Projects compact
    if (data.sections.projects && data.sections.projects.length > 0) {
      y = sectionHeader('PROYEK', y);
      data.sections.projects.forEach(proj => {
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
        doc.text(proj.name || 'Proyek', M + 5, y);
        y += 4;
        
        if (proj.description) {
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          const projLines = doc.splitTextToSize(proj.description, W - 2*M - 8);
          projLines.forEach(line => {
            doc.text(line, M + 5, y);
            y += 4.5;
          });
        }
        y += 3;
      });
      y += 2;
    }
    
    // Languages compact
    if (data.sections.languages && data.sections.languages.length > 0) {
      y = sectionHeader('BAHASA', y);
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
      
      data.sections.languages.forEach(lang => {
        doc.text(`• ${lang.name} - ${lang.level}`, M + 3, y);
        y += 4.5;
      });
      y += 2;
    }
    
    // Certifications compact
    if (data.sections.certifications && data.sections.certifications.length > 0) {
      y = sectionHeader('SERTIFIKASI', y);
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
      
      data.sections.certifications.forEach(cert => {
        doc.text(`• ${cert.name} - ${cert.issuer} (${cert.year})`, M + 3, y);
        y += 4.5;
      });
    }
    
    // NO FOOTER - clean!
  }
}

module.exports = CompactCVGenerator;

