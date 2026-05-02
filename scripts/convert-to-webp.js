const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directories to process
const directories = [
  'public/images/devex',
  'public/images/footer',
  'public/images/kasir',
  'public/images/landing',
  'public/images/pasar',
  'public/images/target',
  'public/logo'
];

// Files to update imports
const filesToUpdate = [
  'app/page.tsx',
  'components/business-type-cards.tsx',
  'components/devex-section.tsx',
  'components/mobile-nav.tsx'
];

// Track conversions for updating imports
const conversions = new Map();

async function convertImageToWebP(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  // Skip if already webp
  if (ext === '.webp') {
    console.log(`⏭️  Skipping (already WebP): ${filePath}`);
    return null;
  }
  
  // Only process image files
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return null;
  }
  
  const dir = path.dirname(filePath);
  const filename = path.basename(filePath, ext);
  const webpPath = path.join(dir, `${filename}.webp`);
  
  try {
    // Convert to WebP with quality 85
    await sharp(filePath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    
    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Converted: ${path.basename(filePath)} → ${path.basename(webpPath)} (${savings}% smaller)`);
    
    // Delete original file
    fs.unlinkSync(filePath);
    console.log(`🗑️  Deleted: ${path.basename(filePath)}`);
    
    // Track conversion for import updates
    const relativePath = filePath.replace(/\\/g, '/').replace('public/', '/');
    const relativeWebpPath = webpPath.replace(/\\/g, '/').replace('public/', '/');
    conversions.set(relativePath, relativeWebpPath);
    
    return { original: filePath, webp: webpPath, savings };
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
    return null;
  }
}

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return [];
  }
  
  const files = fs.readdirSync(dir);
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subResults = await processDirectory(filePath);
      results.push(...subResults);
    } else {
      const result = await convertImageToWebP(filePath);
      if (result) {
        results.push(result);
      }
    }
  }
  
  return results;
}

function updateImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Update all image paths
  conversions.forEach((webpPath, originalPath) => {
    const originalFilename = path.basename(originalPath);
    const webpFilename = path.basename(webpPath);
    
    // Replace with various patterns
    const patterns = [
      new RegExp(`"${originalPath.replace(/\//g, '\\/')}"`, 'g'),
      new RegExp(`'${originalPath.replace(/\//g, '\\/')}'`, 'g'),
      new RegExp(`src="${originalPath.replace(/\//g, '\\/')}"`, 'g'),
      new RegExp(`src='${originalPath.replace(/\//g, '\\/')}'`, 'g'),
      new RegExp(`image: "${originalPath.replace(/\//g, '\\/')}"`, 'g'),
      new RegExp(`image: '${originalPath.replace(/\//g, '\\/')}'`, 'g'),
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match) => {
          return match.replace(originalFilename, webpFilename);
        });
        updated = true;
      }
    });
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`📝 Updated imports in: ${filePath}`);
  }
}

async function main() {
  console.log('🚀 Starting image conversion to WebP...\n');
  
  let totalResults = [];
  
  // Process all directories
  for (const dir of directories) {
    console.log(`\n📁 Processing directory: ${dir}`);
    const results = await processDirectory(dir);
    totalResults.push(...results);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✨ Conversion complete! Converted ${totalResults.length} images`);
  
  if (totalResults.length > 0) {
    const totalOriginalSize = totalResults.reduce((sum, r) => {
      const originalSize = fs.existsSync(r.original) ? 0 : fs.statSync(r.webp).size;
      return sum + originalSize;
    }, 0);
    
    console.log('\n🔄 Updating imports in code files...\n');
    
    // Update imports in all files
    filesToUpdate.forEach(file => {
      updateImportsInFile(file);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All done! Your images are now optimized as WebP.');
    console.log('💡 Don\'t forget to test the website to ensure all images load correctly.');
  } else {
    console.log('\n⚠️  No images were converted. All images might already be in WebP format.');
  }
}

// Run the script
main().catch(console.error);
