// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'src', 'images');
const outputDir = path.join(__dirname, 'public', 'optimized');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(inputDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`Optimized: ${file} -> ${outputPath}`))
      .catch(err => console.error(`Error optimizing ${file}:`, err));
  }
});
