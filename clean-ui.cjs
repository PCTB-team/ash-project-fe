const fs = require('fs');
const path = require('path');

const directoryToSearch = './src';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Typography - Tracking
  content = content.replace(/\btracking-tight(er)?\b/g, '');
  content = content.replace(/\btracking-wide(r|st)?\b/g, '');
  
  // Typography - Leading (Keep it simple)
  content = content.replace(/\bleading-tight\b/g, '');
  content = content.replace(/\bleading-none\b/g, '');
  content = content.replace(/\bleading-snug\b/g, '');
  
  // Font Weights (Tone down ultra-bolds)
  content = content.replace(/\bfont-extrabold\b/g, 'font-semibold');
  content = content.replace(/\bfont-black\b/g, 'font-bold');

  // Text Sizes (reduce everything up by 1-2 steps of Tailwind scale)
  content = content.replace(/\btext-\[120px\]\b/g, 'text-6xl');
  content = content.replace(/\btext-\[150px\]\b/g, 'text-6xl');
  content = content.replace(/\btext-\[50px\]\b/g, 'text-4xl');
  content = content.replace(/\btext-\[60px\]\b/g, 'text-5xl');
  content = content.replace(/\btext-\[40px\]\b/g, 'text-3xl');
  content = content.replace(/\btext-\[42px\]\b/g, 'text-3xl');
  content = content.replace(/\btext-\[38px\]\b/g, 'text-3xl');
  content = content.replace(/\btext-\[32px\]\b/g, 'text-2xl');
  content = content.replace(/\btext-\[30px\]\b/g, 'text-2xl');
  content = content.replace(/\btext-\[24px\]\b/g, 'text-xl');
  content = content.replace(/\btext-\[22px\]\b/g, 'text-xl');

  // Border Radius
  content = content.replace(/\brounded-\[32px\]\b/g, 'rounded-2xl');
  content = content.replace(/\brounded-\[24px\]\b/g, 'rounded-2xl');
  content = content.replace(/\brounded-\[20px\]\b/g, 'rounded-xl');
  content = content.replace(/\brounded-\[16px\]\b/g, 'rounded-xl');

  // Box Shadow
  content = content.replace(/\bshadow-xl\b/g, 'shadow-sm');
  content = content.replace(/\bshadow-2xl\b/g, 'shadow-md');
  content = content.replace(/\bdrop-shadow-md\b/g, 'drop-shadow-sm');
  content = content.replace(/\bshadow-\[0_[^\]]+\]\b/g, 'shadow-sm');
  // Also remove coloured shadows like shadow-[#ff5c00]/10 or shadow-[var(--color-primary)]/10
  content = content.replace(/\bshadow-\[[^\]]+\]\/[0-9]+\b/g, '');
  content = content.replace(/\bshadow-[a-zA-Z]+-[0-9]+\/[0-9]+\b/g, '');

  // Clean up double spaces in className
  content = content.replace(/className="([^"]+)"/g, (match, p1) => {
    return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
  });
  content = content.replace(/className=\{`([^`]+)`\}/g, (match, p1) => {
    return `className={\`${p1.replace(/\s+/g, ' ').trim()}\`}`;
  });

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
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  }
}

traverseDirectory(directoryToSearch);
console.log('Done!');
