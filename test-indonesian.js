const UltimateCVGenerator = require('./src/pdfGenerator-indonesian');

const sampleData = {
  name: 'Anton Kariskau',
  title: 'Pengembang Full Stack & Spesialis AI',
  email: 'anton.kariskau@example.com',
  phone: '+62 812-3456-7890',
  location: 'Jakarta, Indonesia',
  summary: 'Pengembang perangkat lunak yang berpengalaman dengan keahlian dalam membangun aplikasi web modern, integrasi kecerdasan buatan, dan arsitektur cloud. Berpengalaman 5+ tahun dalam pengembangan full-stack dengan rekam jejak yang terbukti dalam menghasilkan proyek berdampak tinggi yang mendorong pertumbuhan bisnis dan kepuasan pengguna.',
  template: 'profesional',
  photoPath: 'C:\\Users\\xraym\\.openclaw\\workspace\\sora-cv-bot\\temp\\processed_test-photo_1782354453668.png',
  sections: {
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django',
      'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git'
    ],
    languages: [
      { name: 'Bahasa Indonesia', level: 'Penutur Asli' },
      { name: 'Bahasa Inggris', level: 'Profesional' }
    ],
    experience: [
      {
        title: 'Pengembang Full Stack Senior',
        company: 'Tech Innovations Indonesia',
        period: '2022 - Sekarang',
        description: 'Memimpin pengembangan aplikasi web enterprise menggunakan React, Node.js, dan AWS. Mengimplementasikan pipeline CI/CD yang mengurangi waktu deployment sebesar 60%. Membimbing tim yang terdiri dari 5 pengembang junior.'
      },
      {
        title: 'Insinyur Perangkat Lunak',
        company: 'StartupXYZ Jakarta',
        period: '2019 - 2022',
        description: 'Membangun RESTful API dan arsitektur microservices. Mengoptimalkan query database yang meningkatkan performa sebesar 40%. Berkolaborasi dengan tim lintas fungsi dalam lingkungan agile.'
      }
    ],
    education: [
      {
        degree: 'Sarjana Ilmu Komputer',
        institution: 'Universitas Indonesia',
        year: '2015 - 2019'
      }
    ],
    projects: [
      {
        name: 'Bot Generator CV Berbasis AI',
        description: 'Bot Telegram yang menghasilkan CV profesional menggunakan AI dan template PDF kustom. Fitur desain premium 5 warna dan berbagai pilihan template.'
      },
      {
        name: 'Platform E-Commerce Terpadu',
        description: 'Marketplace full-stack dengan manajemen inventori real-time, integrasi payment gateway, dan dashboard admin yang komprehensif.'
      }
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
      { name: 'Professional Scrum Master', issuer: 'Scrum.org', year: '2022' }
    ]
  }
};

async function testIndonesian() {
  try {
    console.log('🔧 Membuat CV dengan Bahasa Indonesia...');
    
    const generator = new UltimateCVGenerator();
    const outputPath = await generator.generate(sampleData, 'test-indonesian');
    
    console.log('✅ CV berhasil dibuat:', outputPath);
    console.log('📂 Membuka PDF...');
    
    // Open PDF
    require('child_process').exec(`start "" "${outputPath}"`);
    
    console.log('\n🎉 Selesai! Cek PDF yang baru dibuka.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testIndonesian();
