const PDFGenerator = require('./src/pdfGenerator');

async function testBotGenerator() {
  const generator = new PDFGenerator();
  
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
        }
      ],
      education: [
        {
          degree: 'Sarjana Ilmu Komputer',
          institution: 'Universitas Indonesia',
          year: '2015-2019'
        }
      ],
      skills: [
        'JavaScript / TypeScript',
        'React / Next.js',
        'Node.js / Express',
        'Python / Django',
        'PostgreSQL / MongoDB',
        'AWS / Docker'
      ],
      projects: [
        {
          name: 'AI Chat Bot Platform',
          description: 'Platform chatbot berbasis AI dengan NLP dan machine learning untuk customer service automation.'
        }
      ],
      languages: [
        { name: 'Bahasa Indonesia', level: 'Penutur Asli' },
        { name: 'Bahasa Inggris', level: 'Profesional' }
      ],
      certifications: [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', year: '2023' }
      ]
    }
  };

  console.log('🔧 Testing BOT GENERATOR (production)...');
  
  try {
    const pdfPath = await generator.generate(testData, 'test-bot-production');
    console.log('✅ BOT GENERATOR SUCCESS:', pdfPath);
    
    // Open PDF
    const { exec } = require('child_process');
    exec(`start "" "${pdfPath}"`);
    
    console.log('\n✅ BOT PRODUCTION READY!');
    console.log('📦 Generator: pdfGenerator.js (compact version)');
    console.log('🎯 Features: v24 FINAL dengan all spacing fixes');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testBotGenerator();
