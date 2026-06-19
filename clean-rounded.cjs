const fs = require('fs');
const path = require('path');

const directoryToSearch = './src';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  content = content.replace(/rounded-\[32px\]/g, 'rounded-2xl');
  content = content.replace(/rounded-\[24px\]/g, 'rounded-2xl');
  content = content.replace(/rounded-\[20px\]/g, 'rounded-xl');
  content = content.replace(/rounded-\[16px\]/g, 'rounded-xl');
  content = content.replace(/tracking-widest/g, '');
  content = content.replace(/tracking-wider/g, '');
  content = content.replace(/tracking-tight/g, '');
  content = content.replace(/shadow-\[0_8px_40px_rgba\(0,0,0,0\.06\)\]/g, 'shadow-md');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

traverseDirectory(directoryToSearch);
console.log('Done!');
