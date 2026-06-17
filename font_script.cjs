const fs = require('fs');
const path = require('path');

const dir = 'e:/AI-Study-Hub-FE/ash-project-fe/src/features/groups';
const files = [
  'pages/CommunityScreen.jsx',
  'pages/GroupDetailScreen.jsx',
  'components/GroupCard.jsx',
  'components/CreateGroupModal.jsx',
  'components/JoinGroupModal.jsx'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace font weights
    content = content.replace(/font-black/g, 'font-semibold');
    content = content.replace(/font-extrabold/g, 'font-medium');
    content = content.replace(/font-bold/g, 'font-medium');
    
    // Form labels
    content = content.replace(/text-\[12px\] font-bold text-black\/70/g, 'text-[10.5px] font-medium text-black/55 uppercase tracking-widest');
    content = content.replace(/text-\[12px\] font-medium text-black\/70/g, 'text-[10.5px] font-medium text-black/55 uppercase tracking-widest');
    
    // Inputs
    content = content.replace(/text-\[14px\] font-medium/g, 'text-[12.5px] font-semibold');
    
    // Adjust large text sizes to better match dashboard
    content = content.replace(/text-\[34px\]/g, 'text-[26px]');
    content = content.replace(/text-\[28px\]/g, 'text-[22px]');
    content = content.replace(/text-\[24px\]/g, 'text-[20px]');
    content = content.replace(/text-\[22px\]/g, 'text-[18px]');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('Not found', file);
  }
});
