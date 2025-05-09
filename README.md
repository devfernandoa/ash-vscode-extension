# Ash VS Code Extension

This extension adds syntax highlighting and live linting for the Ash scripting language.
Ash is a statically typed language that compiles to clean, portable Bash scripts.

## Features

- Syntax highlighting for `.ash` files
- Live linting using the `ash` parser binary
- File icon support
- Lightweight and configurable

## Installation

1. Download or clone this repository
2. Run the following commands to package the extension:

```bash
npm install
vsce package
```

3. Install the extension in VS Code:

```bash
code --install-extension ash-lang-0.0.1.vsix
```

Or drag and drop the generated `.vsix` file into the VS Code window.

## Configuration

This extension requires the `ash` binary to perform syntax checking.

### Option 1: Use a system-wide path

Make sure `ash` is executable and installed somewhere in your PATH:

```bash
chmod +x /path/to/ash
sudo mv /path/to/ash /usr/local/bin/ash
```

Then in VS Code settings, add this:

```json
{
  "ash.path": "ash"
}
```

### Option 2: Use a custom path

If you prefer not to install globally, point directly to the binary:

```json
{
  "ash.path": "/absolute/path/to/ash"
}
```

## Linting Behavior

- Linting runs automatically when an `.ash` file is saved
- If a syntax error is detected by the `ash` binary, it will appear as a red underline with a tooltip
- The linter uses the `ash` binary by piping the file contents into its standard input

## File Icon

The extension includes a custom Ash icon displayed next to `.ash` files in the VS Code file explorer.
