const PDFGenerator = require('./src/pdfGenerator');
const ImageProcessor = require('./src/imageProcessor');
const axios = require('axios');
const fs = require('fs');

const BOT_TOKEN = '8702712492:AAFgUKR85wVwVfm3ry-UJ9RsPV8vRMtbTjM';
const CHAT_ID = '6667623082';

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
  photoPath: null,
  sections: {
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Docker', 'PostgreSQL'],
    languages: [
      { name: 'Bahasa Indonesia', level: 'Native' },
      { name: 'English', level: 'Professional' }
    ],
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Startup',
        period: '2022 - Present',
        description: 'Lead development of web applications using modern stack.'
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
        description: 'Built conversational AI platform with NLP and real-time messaging.'
      }
    ],
    certifications: []
  }
};

async function testAndSend() {
  try {
    console.log('🔧 Generating CV...');
    
    // Generate PDF
    const generator = new PDFGenerator();
    const outputPath = await generator.generate(sampleData, 'test-telegram');
    
    console.log('✅ PDF generated:', outputPath);
    console.log('📤 Sending to Telegram...');
    
    // Send to Telegram using form-data
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('document', fs.createReadStream(outputPath), {
      filename: 'cv_sample.pdf',
      contentType: 'application/pdf'
    });
    formData.append('caption', '✅ Test CV dari Sora CV Bot (after rollback)');
    
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      formData,
      {
        headers: formData.getHeaders()
      }
    );
    
    console.log('✅ Sent to Telegram!');
    console.log('Message ID:', response.data.result.message_id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testAndSend();
