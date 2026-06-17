const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint.json', 'utf8'));
data.forEach(file => {
  if (file.errorCount > 0 || file.warningCount > 0) {
    console.log(file.filePath);
    file.messages.forEach(msg => {
      console.log(`  ${msg.line}:${msg.column}  ${msg.severity === 2 ? 'error' : 'warning'}  ${msg.message}  ${msg.ruleId}`);
    });
  }
});
