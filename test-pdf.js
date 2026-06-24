// Test PDF generation locally
const PDFGenerator = require('./src/pdfGenerator');

const sampleData = {
  name: 'John Anderson',
  title: 'Senior Software Engineer',
  email: 'john.anderson@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable solutions and mentoring junior developers.',
  template: 'azure',
  font: 'helvetica',
  colorScheme: 'blue',
  photoPath: null,
  sections: {
    skills: [
      'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'PostgreSQL', 'Git'
    ],
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Intermediate' },
      { name: 'Mandarin', level: 'Basic' }
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        period: '2020 - Present',
        description: 'Lead development of microservices architecture serving 10M+ users. Mentored team of 5 junior developers and improved deployment efficiency by 40%.'
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        period: '2017 - 2020',
        description: 'Built RESTful APIs and React frontends. Implemented CI/CD pipelines and reduced bug rate by 30%.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California',
        year: '2013 - 2017'
      }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Built scalable e-commerce platform handling 50k transactions/day using React, Node.js, and AWS.'
      },
      {
        name: 'AI Chatbot',
        description: 'Developed intelligent chatbot using NLP and machine learning for customer support automation.'
      }
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', year: '2022' },
      { name: 'Google Cloud Professional', issuer: 'Google', year: '2021' }
    ]
  }
};

async function testGenerate() {
  try {
    console.log('🔧 Testing PDF generation...');
    const generator = new PDFGenerator();
    const outputPath = await generator.generate(sampleData, 'test');
    console.log('✅ PDF generated successfully!');
    console.log('📄 Output:', outputPath);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGenerate();
