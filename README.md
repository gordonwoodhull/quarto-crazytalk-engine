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

## Development Setup

This engine extension requires Quarto 1.9 (currently in development).

For development:

1. Place this directory adjacent to the `quarto-cli` directory, maintaining the relative paths.
2. Ensure the `@quarto/types` package is built:

```bash
cd ../quarto-cli/packages/quarto-types
npm install
npm run build
```

## Technical Notes

This engine implements the new `ExecutionEngineDiscovery` interface with a `_discovery` flag:

```typescript
const crazyTalkEngineDiscovery: ExecutionEngineDiscovery & {
  _discovery: boolean;
} = {
  _discovery: true,
  // ...
};
```

This is a temporary flag that indicates the engine supports the new Quarto 1.9 ExecutionEngineDiscovery interface. This flag likely won't be needed when version 1.9 becomes the stable release.

### Extension Structure

The extension is structured as follows:

```
_extensions/
  └── crazytalk/
      ├── _extension.yml      # Extension metadata
      └── crazytalk-engine.ts # Engine implementation
```

### @quarto/types Package

**Important**: This engine imports types from the `@quarto/types` package using a relative path to the built distribution:

```typescript
import {
  ExecutionEngineDiscovery,
  // Other types...
} from "../../../quarto-cli/packages/quarto-types/dist/index.js";
```

The `@quarto/types` package must be built before using this engine. See [Development Setup](#development-setup).

Note that `@quarto/types` is not yet published as an npm package because its API is still in flux. Using it directly like this is experimental and may break with future Quarto updates. Use at your own risk.

## Example

See `example.qmd` for a demonstration of famous quotes transformed into cRaZyTaLk.