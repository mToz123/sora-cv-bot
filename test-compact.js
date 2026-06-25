const CompactCVGenerator = require('./src/pdfGenerator-compact');

async function testCompact() {
  const generator = new CompactCVGenerator();
  
  const testData = {
    name: 'Anton Kariskau',
    title: 'Pengembang Full Stack',
    email: 'anton@example.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    summary: 'Pengembang berpengalaman dengan keahlian dalam membangun aplikasi web modern, integrasi AI, dan arsitektur cloud. Passionate dalam teknologi dan inovasi.',
    template: 'profesional',
    photoPath: 'C:\\Users\\xraym\\.openclaw\\workspace\\sora-cv-bot\\temp\\processed_test-photo_1782354453668.png',
    sections: {
      experience: [
        {
          title: 'Senior Full Stack Developer',
          company: 'Tech Indonesia',
          period: '2022 - Sekarang',
          description: 'Memimpin pengembangan aplikasi web menggunakan React, Node.js, dan AWS. Meningkatkan performa aplikasi hingga 40% dan mengelola tim developer.'
        },
        {
          title: 'Full Stack Developer',
          company: 'Digital Solutions',
          period: '2020 - 2022',
          description: 'Mengembangkan dan maintain aplikasi e-commerce dengan traffic tinggi. Implementasi CI/CD pipeline dan automated testing.'
        },
        {
          title: 'Junior Developer',
          company: 'Startup Tech',
          period: '2018 - 2020',
          description: 'Belajar dan berkontribusi dalam pengembangan aplikasi mobile dan web. Kolaborasi dengan tim design dan product.'
        }
      ],
      education: [
        {
          degree: 'Sarjana Ilmu Komputer',
          institution: 'Universitas Indonesia',
          year: '2015-2019'
        },
        {
          degree: 'SMA IPA',
          institution: 'SMAN 1 Jakarta',
          year: '2012-2015'
        }
      ],
      skills: [
        'JavaScript / TypeScript',
        'React / Next.js',
        'Node.js / Express',
        'Python / Django',
        'PostgreSQL / MongoDB',
        'AWS / Docker',
        'Git / CI/CD',
        'REST API / GraphQL'
      ],
      projects: [
        {
          name: 'AI Chat Bot Platform',
          description: 'Platform chatbot berbasis AI dengan NLP dan machine learning untuk customer service automation.'
        },
        {
          name: 'E-Commerce Dashboard',
          description: 'Real-time analytics dashboard untuk monitoring penjualan dan inventory dengan visualisasi data interaktif.'
        },
        {
          name: 'Mobile Banking App',
          description: 'Aplikasi mobile banking dengan fitur transfer, pembayaran, dan investment portfolio management.'
        }
      ],
      languages: [
        { name: 'Bahasa Indonesia', level: 'Penutur Asli' },
        { name: 'Bahasa Inggris', level: 'Profesional' },
        { name: 'Bahasa Mandarin', level: 'Dasar' }
      ],
      certifications: [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', year: '2023' },
        { name: 'Professional Scrum Master', issuer: 'Scrum.org', year: '2022' },
        { name: 'Google Cloud Professional', issuer: 'Google', year: '2021' }
      ]
    }
  };

  console.log('🔧 Generating COMPACT CV...');
  
  try {
    const pdfPath = await generator.generate(testData, 'test-compact');
    console.log('✅ COMPACT CV created:', pdfPath);
    
    // Open PDF
    const { exec } = require('child_process');
    exec(`start "" "${pdfPath}"`);
    
    console.log('\n📊 COMPACT DESIGN FEATURES:');
    console.log('✅ Font sizes reduced: 22pt nama, 11pt section, 9-10pt content');
    console.log('✅ Line height compact: 4mm spacing (dari 5-6mm)');
    console.log('✅ Photo compact: 45mm (dari 50-60mm)');
    console.log('✅ Header compact: 65mm (dari 75mm)');
    console.log('✅ Contact box compact: 16mm (dari 20mm)');
    console.log('✅ Skills 2-column layout (space efficient)');
    console.log('✅ NO FOOTER (clean professional)');
    console.log('✅ Custom format: 210×350mm (EXTRA LONG)');
    console.log('\n🎯 TARGET: 1 HALAMAN dengan semua content READABLE!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testCompact();
