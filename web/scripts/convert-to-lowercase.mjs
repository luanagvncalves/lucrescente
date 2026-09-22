import fs from 'fs';
import path from 'path';

// Files to convert
const filesToConvert = [
  'src/data/catalog.ts',
  'src/content/pt.ts',
  'src/content/en.ts',
  'src/content/fr.ts',
];

function convertToLowercase(text) {
  // Convert text to lowercase while preserving structure
  return text.toLowerCase();
}

filesToConvert.forEach(filePath => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const converted = convertToLowercase(content);
    fs.writeFileSync(fullPath, converted, 'utf-8');
    console.log(`✓ Converted: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error converting ${filePath}:`, error.message);
  }
});

console.log('\nAll files converted to lowercase!');
