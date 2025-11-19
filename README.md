# cRaZyTaLk markdown engine extension for Quarto

A demonstration of a Quarto extension that provides a custom engine for transforming regular text into AlTeRnAtInG cAsE (cRaZyTaLk). This extension uses the new `ExecutionEngineDiscovery` interface introduced in Quarto 1.9.

## How it Works

The cRaZyTaLk engine applies a simple transformation that makes every other letter uppercase or lowercase, creating a chaotic visual effect. It's the perfect way to express sarcasm, mockery, or simply add a touch of internet culture to your documents.

## Installation

This extension can be installed directly from GitHub:

```bash
quarto install extension gordonwoodhull/quarto-crazytalk-engine
```

This will install the extension in your project's `_extensions/` directory.

## Usage

In any Quarto document, set the engine to cRaZyTaLk:

```yaml
---
title: "My Document"
format: html
engine: cRaZyTaLk
---
```

The title and all content will be transformed into cRaZyTaLk.

## Development

This engine extension requires Quarto 1.9 or higher.

To build the extension:

```bash
quarto dev-call build-ts-extension
```

This will bundle `src/crazytalk-engine.ts` into `_extensions/crazytalk/crazytalk-engine.js`.

## Technical Notes

### Extension Structure

The extension is structured as follows:

```
src/
  └── crazytalk-engine.ts    # TypeScript source
_extensions/
  └── crazytalk/
      ├── _extension.yml      # Extension metadata
      └── crazytalk-engine.js # Bundled engine (built from src/)
```

The TypeScript source is bundled using `quarto dev-call build-ts-extension`.

## Example

See `example.qmd` for a demonstration of famous quotes transformed into cRaZyTaLk.