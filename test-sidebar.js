const SidebarCVGenerator = require('./src/pdfGenerator-sidebar');

async function testSidebar() {
  const generator = new SidebarCVGenerator();
  
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

  console.log('🔧 Generating SIDEBAR CV (seperti screenshot Boss)...');
  
  try {
    const pdfPath = await generator.generate(testData, 'test-sidebar');
    console.log('✅ SIDEBAR CV created:', pdfPath);
    
    // Open PDF
    const { exec } = require('child_process');
    exec(`start "" "${pdfPath}"`);
    
    console.log('\n📊 SIDEBAR DESIGN FEATURES:');
    console.log('✅ Layout: SIDEBAR (70mm) + CONTENT (140mm)');
    console.log('✅ Sidebar: Dark blue-gray background');
    console.log('✅ Foto: 50mm circular di sidebar (centered)');
    console.log('✅ Kontak: Email/Phone/Location di sidebar (white text)');
    console.log('✅ Skills & Bahasa: Di sidebar (compact)');
    console.log('✅ Main content: Summary, Experience, Education, Projects, Certs');
    console.log('✅ Font sizes: 16/12/10/9/8pt (compact untuk 1 halaman)');
    console.log('✅ Format: 210×350mm (EXTRA LONG untuk fit 1 halaman)');
    console.log('✅ Clean professional look');
    console.log('\n🎯 TARGET: LAYOUT SEPERTI SCREENSHOT + 1 HALAMAN!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSidebar();
