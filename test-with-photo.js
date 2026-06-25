// Test PDF generation with photo
const PDFGenerator = require('./src/pdfGenerator');
const ImageProcessor = require('./src/imageProcessor');

const sampleData = {
  name: 'Anton Kariskau',
  title: 'Full Stack Developer',
  email: 'anton@example.com',
  phone: '+62 812-3456-7890',
  location: 'Jakarta, Indonesia',
  summary: 'Passionate developer with expertise in web development, AI integration, and modern JavaScript frameworks.',
  template: 'azure',
  font: 'helvetica',
  colorScheme: 'blue',
  photoPath: null, // Will be set after processing
  sections: {
    skills: [
      'JavaScript', 'React', 'Node.js', 'Python', 'Docker', 'PostgreSQL'
    ],
    languages: [
      { name: 'Bahasa Indonesia', level: 'Native' },
      { name: 'English', level: 'Professional' }
    ],
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Startup',
        period: '2022 - Present',
        description: 'Lead development of web applications using modern stack. Built scalable APIs and responsive frontends.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Computer Science',
        institution: 'University of Indonesia',
        year: '2018 - 2022'
      }
    ],
    projects: [
      {
        name: 'AI Chat Platform',
        description: 'Built conversational AI platform with natural language processing and real-time messaging.'
      }
    ],
    certifications: []
  }
};

async function testWithPhoto() {
  try {
    console.log('🔧 Testing PDF generation WITH PHOTO...');
    
    // Use a sample photo URL (public domain image)
    const photoUrl = 'https://randomuser.me/api/portraits/men/32.jpg';
    
    console.log('📥 Downloading and processing photo...');
    const imgProc = new ImageProcessor();
    const processedPath = await imgProc.downloadAndProcess(photoUrl, 'test-photo');
    
    console.log('✅ Photo processed:', processedPath);
    
    // Set photo path in data
    sampleData.photoPath = processedPath;
    
    console.log('📄 Generating PDF with photo...');
    const generator = new PDFGenerator();
    const outputPath = await generator.generate(sampleData, 'test-with-photo');
    
    console.log('✅ PDF with photo generated successfully!');
    console.log('📄 Output:', outputPath);
    console.log('📏 Photo size in PDF: 45x45mm (increased from 30x30mm)');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testWithPhoto();
