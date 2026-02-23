# key-safe

A TypeScript npm package that detects Ethereum private keys in your codebase before they get committed to git.

## Features

- 🔍 **Scanner CLI**: Scan directories and files for Ethereum private keys
- 🛡️ **Git Hook**: Automatically installs a pre-commit hook to prevent committing private keys
- 🚫 **Smart Filtering**: Ignores `node_modules`, `.git`, and `dist` directories
- 📁 **File Type Support**: Scans `.ts`, `.js`, `.sol`, `.json`, `.env`, `.yml` files
- 🎯 **Accurate Detection**: Uses regex pattern `/(?<!\w)0x[a-fA-F0-9]{64}(?!\w)/g` to detect Ethereum private keys
- 🔒 **Zero Dependencies**: Built with TypeScript, no runtime dependencies
- 🌍 **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

```bash
npm install key-safe
```

During installation, key-safe will automatically set up a pre-commit git hook in your repository.

## Usage

### Command Line

Scan the current directory:
```bash
key-safe
```

Scan a specific directory or file:
```bash
key-safe ./src
key-safe ./config.json
```

### Exit Codes

- `0`: No private keys found (clean)
- `1`: Private keys detected

### Git Hook

The pre-commit hook is automatically installed during `npm install`. It will:
- Run before every commit
- Scan all files in your repository
- Block the commit if private keys are detected
- Allow the commit to proceed if no keys are found

## What is an Ethereum Private Key?

An Ethereum private key is a 64-character hexadecimal string prefixed with `0x`. For example:
```
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## Development

Build the project:
```bash
npm run build
```

## License

ISC
