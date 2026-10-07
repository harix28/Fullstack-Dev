const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // For bg-gradient on dark backgrounds
  content = content.replace(/bg-gradient-to-[a-z]+ from-\[#[25A][^\]]+\] via-\[^\]]+\] to-\[^\]]+\]/g, 'bg-[#59463B]');
  content = content.replace(/bg-gradient-to-[a-z]+ from-\[#[25A][^\]]+\] to-\[^\]]+\]/g, 'bg-[#59463B]');
  
  // For text gradients (remove text-transparent, bg-clip-text, bg-gradient-to...)
  content = content.replace(/text-transparent bg-clip-text bg-gradient-to-[a-z]+ from-\[^\]]+\] via-\[^\]]+\] to-\[^\]]+\]/g, 'text-[#59463B]');
  content = content.replace(/text-transparent bg-clip-text bg-gradient-to-[a-z]+ from-\[^\]]+\] to-\[^\]]+\]/g, 'text-[#59463B]');
  
  // For other general backgrounds (white/light)
  content = content.replace(/bg-gradient-to-[a-z]+ from-white via-\[^\]]+\] to-\[^\]]+\]/g, 'bg-[#FAF7F2]');
  content = content.replace(/bg-gradient-to-[a-z]+ from-\[#FAF7F2\] to-\[^\]]+\]/g, 'bg-[#FAF7F2]');
  content = content.replace(/bg-gradient-to-[a-z]+ from-purple-50 via-\[^\]]+\] to-\[^\]]+\]/g, 'bg-[#FAF7F2]');
  
  // Catch any remaining bg-gradient-to-*
  content = content.replace(/bg-gradient-to-[a-z]+\s+from-\S+\s+via-\S+\s+to-\S+/g, 'bg-[#59463B]');
  content = content.replace(/bg-gradient-to-[a-z]+\s+from-\S+\s+to-\S+/g, 'bg-[#59463B]');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
