const sharp = require('sharp');
const https = require('https');
const fs = require('fs');
const path = require('path');

class ImageProcessor {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async downloadAndProcess(url, userId) {
    const tempPath = path.join(this.tempDir, `photo_${userId}_${Date.now()}.jpg`);
    const processedPath = path.join(this.tempDir, `processed_${userId}_${Date.now()}.jpg`);

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(tempPath);
      
      https.get(url, (response) => {
        response.pipe(file);
        
        file.on('finish', async () => {
          file.close();
          
          try {
            // Process image: resize, crop to square, optimize
            await sharp(tempPath)
              .resize(300, 300, {
                fit: 'cover',
                position: 'center'
              })
              .jpeg({ quality: 85 })
              .toFile(processedPath);
            
            // Delete temp file
            fs.unlinkSync(tempPath);
            
            resolve(processedPath);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (err) => {
        fs.unlinkSync(tempPath);
        reject(err);
      });
    });
  }

  async cropCircle(inputPath, outputPath) {
    // Create circular crop
    const roundedCorners = Buffer.from(
      '<svg><rect x="0" y="0" width="300" height="300" rx="150" ry="150"/></svg>'
    );

    await sharp(inputPath)
      .composite([{
        input: roundedCorners,
        blend: 'dest-in'
      }])
      .png()
      .toFile(outputPath);

    return outputPath;
  }
}

module.exports = ImageProcessor;
