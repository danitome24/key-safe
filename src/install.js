#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findGitRoot(startPath) {
  let currentPath = startPath;
  
  while (currentPath !== path.parse(currentPath).root) {
    const gitPath = path.join(currentPath, '.git');
    
    if (fs.existsSync(gitPath)) {
      return currentPath;
    }
    
    currentPath = path.dirname(currentPath);
  }
  
  return null;
}

function installHook() {
  // Don't install hooks if we're installing globally or in CI
  if (process.env.npm_config_global || process.env.CI) {
    console.log('Skipping git hook installation (global install or CI environment)');
    return;
  }
  
  const gitRoot = findGitRoot(process.cwd());
  
  if (!gitRoot) {
    console.log('Not in a git repository. Skipping git hook installation.');
    return;
  }
  
  const hooksDir = path.join(gitRoot, '.git', 'hooks');
  const preCommitPath = path.join(hooksDir, 'pre-commit');
  
  // Ensure hooks directory exists
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
  
  // Read the hook template
  const hookTemplate = fs.readFileSync(
    path.join(__dirname, '..', 'hooks', 'pre-commit'),
    'utf-8'
  );
  
  // Check if pre-commit hook already exists
  if (fs.existsSync(preCommitPath)) {
    const existingHook = fs.readFileSync(preCommitPath, 'utf-8');
    
    // Check if our hook is already installed
    if (existingHook.includes('key-safe')) {
      console.log('key-safe pre-commit hook already installed');
      return;
    }
    
    // Append to existing hook
    console.log('Existing pre-commit hook found. Appending key-safe check...');
    fs.writeFileSync(preCommitPath, existingHook + '\n' + hookTemplate, { mode: 0o755 });
  } else {
    // Create new hook
    fs.writeFileSync(preCommitPath, hookTemplate, { mode: 0o755 });
  }
  
  console.log('✓ key-safe pre-commit hook installed successfully');
}

try {
  installHook();
} catch (error) {
  console.error('Failed to install git hook:', error.message);
  // Don't fail the installation if hook setup fails
  process.exit(0);
}
