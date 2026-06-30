const fs = require('fs');
const path = require('path');

// Read original routes.js (with existing endpoints)
const originalPath = path.join(__dirname, 'routes.js');
const originalContent = fs.readFileSync(originalPath, 'utf-8');

// Clean up the line at character 0 that was accidentally corrupted by earlier replace_in_file (which removed const router and requires). We need to add it back if missing.
const hasRequires = originalContent.includes("require('express')");
if (!hasRequires) {
  console.log('routes.js is missing requires - restoring from git...');
  // Try git checkout first
  const { execSync } = require('child_process');
  try {
    execSync('git checkout HEAD -- routes.js', { cwd: __dirname, stdio: 'ignore' });
    console.log('Restored routes.js from git.');
  } catch (e) {
    // If restore fails, prepend needed lines
    fs.writeFileSync(originalPath, "const express = require('express');\nconst db = require('./db');\n\n" + originalContent);
    console.log('Prepended missing requires to routes.js.');
}
  }

// Read AI endpoints  
const aiPath = path.join(__dirname, 'routes-new.js');
let aiContent = fs.readFileSync(aiPath, 'utf-8');

// Remove the module.exports line from AI file (since original has export)
aiContent = aiContent.replace(/\nmodule\.exports = router;\s*$/, '');

// Append AI endpoints before module.exports in the final merged file
const mergePoint = originalContent.lastIndexOf('module.exports');
if (mergePoint === -1) {
  console.error('ERROR: Could not find module.exports in routes.js!');
  process.exit(1);
}

let merged = originalContent.substring(0, mergePoint) + '\n\n' + 
             '// ====== NEW AI ENDPOINTS ======\n\n' +
             aiContent + '\n';

fs.writeFileSync(originalPath, merged);
console.log('Successfully merged routes.js with AI endpoints.');