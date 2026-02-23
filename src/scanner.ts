import * as fs from 'fs';
import * as path from 'path';

// Pattern to detect Ethereum private keys: 0x followed by 64 hex characters
// Using negative lookbehind and lookahead to avoid matching within identifiers
const PRIVATE_KEY_PATTERN = /(?<!\w)0x[a-fA-F0-9]{64}(?!\w)/g;

// File extensions to scan
const SCANNABLE_EXTENSIONS = ['.ts', '.js', '.sol', '.json', '.yml', '.yaml'];

// Specific filenames to scan (like dotfiles)
const SCANNABLE_FILES = ['.env'];

// Directories to ignore
const IGNORED_DIRS = ['node_modules', '.git', 'dist'];

export interface ScanResult {
  hasKeys: boolean;
  findings: Finding[];
}

export interface Finding {
  file: string;
  line: number;
  column: number;
  key: string;
}

/**
 * Check if a directory should be ignored
 */
function shouldIgnoreDir(dirName: string): boolean {
  return IGNORED_DIRS.includes(dirName);
}

/**
 * Check if a file should be scanned based on its extension or name
 */
function shouldScanFile(filePath: string): boolean {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  // Check for specific filenames (like .env)
  if (SCANNABLE_FILES.includes(fileName.toLowerCase())) {
    return true;
  }
  
  // Check for file extensions
  return SCANNABLE_EXTENSIONS.includes(ext);
}

/**
 * Scan a file for private keys
 */
function scanFile(filePath: string): Finding[] {
  const findings: Finding[] = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      let match;
      while ((match = PRIVATE_KEY_PATTERN.exec(line)) !== null) {
        findings.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          key: match[0]
        });
      }
    });
  } catch (error) {
    // Skip files that cannot be read
    console.error(`Error reading file ${filePath}: ${error}`);
  }
  
  return findings;
}

/**
 * Recursively scan a directory for private keys
 */
function scanDirectory(dirPath: string): Finding[] {
  const findings: Finding[] = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!shouldIgnoreDir(entry.name)) {
          findings.push(...scanDirectory(fullPath));
        }
      } else if (entry.isFile()) {
        if (shouldScanFile(fullPath)) {
          findings.push(...scanFile(fullPath));
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}: ${error}`);
  }
  
  return findings;
}

/**
 * Scan a path (file or directory) for private keys
 */
export function scan(targetPath: string): ScanResult {
  const findings: Finding[] = [];
  
  try {
    const stats = fs.statSync(targetPath);
    
    if (stats.isDirectory()) {
      findings.push(...scanDirectory(targetPath));
    } else if (stats.isFile()) {
      if (shouldScanFile(targetPath)) {
        findings.push(...scanFile(targetPath));
      }
    }
  } catch (error) {
    console.error(`Error accessing path ${targetPath}: ${error}`);
    return { hasKeys: false, findings: [] };
  }
  
  return {
    hasKeys: findings.length > 0,
    findings
  };
}
