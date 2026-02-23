#!/usr/bin/env node

import * as path from 'path';
import { scan } from './scanner';

function printUsage(): void {
  console.log('Usage: key-safe [path]');
  console.log('');
  console.log('Scan a directory or file for Ethereum private keys.');
  console.log('');
  console.log('Arguments:');
  console.log('  path    Path to scan (defaults to current directory)');
}

function main(): void {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }
  
  const targetPath = args[0] || '.';
  const absolutePath = path.resolve(targetPath);
  
  console.log(`Scanning ${absolutePath} for Ethereum private keys...`);
  console.log('');
  
  const result = scan(absolutePath);
  
  if (result.hasKeys) {
    console.error('⚠️  WARNING: Private keys detected!');
    console.error('');
    
    result.findings.forEach((finding) => {
      console.error(`  ${finding.file}:${finding.line}:${finding.column}`);
      console.error(`    Found: ${finding.key}`);
      console.error('');
    });
    
    console.error(`Total: ${result.findings.length} private key(s) found`);
    process.exit(1);
  } else {
    console.log('✓ No private keys detected');
    process.exit(0);
  }
}

main();
