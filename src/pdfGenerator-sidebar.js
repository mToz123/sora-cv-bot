const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

class SidebarCVGenerator {
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
        format: [210, 350] // EXTRA LONG untuk 1 halaman
      });

      this.renderSidebar(doc, data, colors);
      doc.save(outputPath);
      
      console.log(`✅ CV sidebar berhasil: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }

  getColors() {
    return {
      sidebar: '#2C3E50',      // Dark blue-gray untuk sidebar
      sidebarAccent: '#3498DB', // Blue accent
      primary: '#2C3E50',
      secondary: '#34495E',
      accent1: '#3498DB',
      accent2: '#1ABC9C',
      text: '#2C3E50',
      textLight: '#7F8C8D',
      white: '#FFFFFF'
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

  renderSidebar(doc, data, colors) {
    const W = 210;
    const H = 350; // EXTRA LONG
    const sidebarW = 70; // Sidebar 70mm width
    const contentX = sidebarW + 5; // Content start after sidebar
    const M = 5; // Margin kecil untuk compact
    
    // SIDEBAR BACKGROUND (dark blue-gray)
    const sidebarRgb = this.hexToRgb(colors.sidebar);
    doc.setFillColor(sidebarRgb.r, sidebarRgb.g, sidebarRgb.b);
    doc.rect(0, 0, sidebarW, H, 'F');
    
    // === SIDEBAR CONTENT ===
    let sideY = 10;
    
    // FOTO COMPACT (50mm circular)
    const photoSize = 50;
    const photoX = (sidebarW - photoSize) / 2; // Center in sidebar
    
    if (data.photoPath && fs.existsSync(data.photoPath)) {
      try {
        const imgData = fs.readFileSync(data.photoPath);
        const isPng = data.photoPath.toLowerCase().endsWith('.png');
        const imgBase64 = `data:image/${isPng ? 'png' : 'jpeg'};base64,${imgData.toString('base64')}`;
        
        // White border
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(2);
        doc.circle(photoX + photoSize/2, sideY + photoSize/2, photoSize/2 + 1, 'S');
        
        doc.addImage(imgBase64, isPng ? 'PNG' : 'JPEG', photoX, sideY, photoSize, photoSize);
      } catch (e) {
        console.error('Error foto:', e);
      }
    }
    
    sideY += photoSize + 8;
    
    // NAMA (compact font, white)
    doc.setFont('times', 'bold');
    doc.setFontSize(16); // Compact
    doc.setTextColor(255, 255, 255);
    const nameLines = doc.splitTextToSize(data.name.toUpperCase(), sidebarW - 10);
    nameLines.forEach(line => {
      doc.text(line, sidebarW/2, sideY, { align: 'center' });
      sideY += 5;
    });
    
    sideY += 2;
    
    // JABATAN (compact, white)
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    const titleLines = doc.splitTextToSize(data.title, sidebarW - 10);
    titleLines.forEach(line => {
      doc.text(line, sidebarW/2, sideY, { align: 'center' });
      sideY += 4;
    });
    
    sideY += 5;
    
    // KONTAK (compact, white, left-aligned)
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    
    // Email
    doc.setFont('times', 'bold');
    doc.text('EMAIL', M + 3, sideY);
    sideY += 4;
    doc.setFont('times', 'normal');
    const emailLines = doc.splitTextToSize(data.email, sidebarW - 10);
    emailLines.forEach(line => {
      doc.text(line, M + 3, sideY);
      sideY += 3.5;
    });
    sideY += 2;
    
    // Phone
    doc.setFont('times', 'bold');
    doc.text('TELEPON', M + 3, sideY);
    sideY += 4;
    doc.setFont('times', 'normal');
    doc.text(data.phone, M + 3, sideY);
    sideY += 5;
    
    // Location
    doc.setFont('times', 'bold');
    doc.text('LOKASI', M + 3, sideY);
    sideY += 4;
    doc.setFont('times', 'normal');
    const locLines = doc.splitTextToSize(data.location, sidebarW - 10);
    locLines.forEach(line => {
      doc.text(line, M + 3, sideY);
      sideY += 3.5;
    });
    sideY += 3;
    
    // KETERAMPILAN (sidebar, compact)
    if (data.sections.skills && data.sections.skills.length > 0) {
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text('KETERAMPILAN', M + 3, sideY);
      sideY += 5;
      
      doc.setFont('times', 'normal');
      doc.setFontSize(8);
      data.sections.skills.forEach(skill => {
        const skillLines = doc.splitTextToSize('• ' + skill, sidebarW - 10);
        skillLines.forEach(line => {
          doc.text(line, M + 3, sideY);
          sideY += 3.5;
        });
      });
      sideY += 3;
    }
    
    // BAHASA (sidebar, compact)
    if (data.sections.languages && data.sections.languages.length > 0) {
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text('BAHASA', M + 3, sideY);
      sideY += 5;
      
      doc.setFont('times', 'normal');
      doc.setFontSize(8);
      data.sections.languages.forEach(lang => {
        doc.text(lang.name, M + 3, sideY);
        sideY += 3;
        doc.setFont('times', 'italic');
        doc.text(lang.level, M + 5, sideY);
        sideY += 4;
        doc.setFont('times', 'normal');
      });
    }
    
    // === MAIN CONTENT (right side) ===
    const txtRgb = this.hexToRgb(colors.text);
    let y = 10;
    
    const sectionHeader = (title, yPos) => {
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
      doc.text(title.toUpperCase(), contentX, yPos);
      
      // Underline
      const acc1 = this.hexToRgb(colors.accent1);
      doc.setDrawColor(acc1.r, acc1.g, acc1.b);
      doc.setLineWidth(0.5);
      doc.line(contentX, yPos + 1, W - M, yPos + 1);
      
      return yPos + 6;
    };
    
    // RINGKASAN
    if (data.summary) {
      y = sectionHeader('RINGKASAN PROFESIONAL', y);
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
      const sumLines = doc.splitTextToSize(data.summary, W - contentX - M - 3);
      sumLines.forEach(line => {
        doc.text(line, contentX, y);
        y += 4;
      });
      y += 3;
    }
    
    // PENGALAMAN
    if (data.sections.experience && data.sections.experience.length > 0) {
      y = sectionHeader('PENGALAMAN KERJA', y);
      data.sections.experience.forEach(exp => {
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
        doc.text(exp.title || 'Posisi', contentX, y);
        y += 4;
        
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        const lightRgb = this.hexToRgb(colors.textLight);
        doc.setTextColor(lightRgb.r, lightRgb.g, lightRgb.b);
        doc.text(`${exp.company || 'Perusahaan'} | ${exp.period || 'Periode'}`, contentX, y);
        y += 4;
        
        if (exp.description) {
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
          const descLines = doc.splitTextToSize('• ' + exp.description, W - contentX - M - 5);
          descLines.forEach(line => {
            doc.text(line, contentX + 2, y);
            y += 4;
          });
        }
        y += 3;
      });
      y += 2;
    }
    
    // PENDIDIKAN
    if (data.sections.education && data.sections.education.length > 0) {
      y = sectionHeader('PENDIDIKAN', y);
      data.sections.education.forEach(edu => {
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
        doc.text(edu.degree || 'Gelar', contentX, y);
        y += 4;
        
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        const lightRgb = this.hexToRgb(colors.textLight);
        doc.setTextColor(lightRgb.r, lightRgb.g, lightRgb.b);
        doc.text(`${edu.institution || 'Institusi'} | ${edu.year || 'Tahun'}`, contentX, y);
        y += 5;
      });
      y += 2;
    }
    
    // PROYEK
    if (data.sections.projects && data.sections.projects.length > 0) {
      y = sectionHeader('PROYEK', y);
      data.sections.projects.forEach(proj => {
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
        doc.text(proj.name || 'Proyek', contentX, y);
        y += 4;
        
        if (proj.description) {
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          const projLines = doc.splitTextToSize(proj.description, W - contentX - M - 3);
          projLines.forEach(line => {
            doc.text(line, contentX, y);
            y += 4;
          });
        }
        y += 3;
      });
      y += 2;
    }
    
    // SERTIFIKASI
    if (data.sections.certifications && data.sections.certifications.length > 0) {
      y = sectionHeader('SERTIFIKASI', y);
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(txtRgb.r, txtRgb.g, txtRgb.b);
      
      data.sections.certifications.forEach(cert => {
        doc.text(`• ${cert.name} - ${cert.issuer} (${cert.year})`, contentX, y);
        y += 4;
      });
    }
    
    // NO FOOTER - clean!
  }
}

module.exports = SidebarCVGenerator;
