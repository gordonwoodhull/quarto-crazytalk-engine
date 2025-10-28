# cRaZyTaLk markdown engine for Quarto

A demonstration of a Quarto external engine that transforms regular text into AlTeRnAtInG cAsE (cRaZyTaLk). This project has been updated to use the new `ExecutionEngineDiscovery` interface coming in Quarto 1.9.

## How it Works

The cRaZyTaLk engine applies a simple transformation that makes every other letter uppercase or lowercase, creating a chaotic visual effect. It's the perfect way to express sarcasm, mockery, or simply add a touch of internet culture to your documents.

## Setup

This engine requires Quarto 1.9 (currently in development) with support for external engines.

1. Place this directory adjacent to the `quarto-cli` directory, maintaining the relative paths.
2. In your Quarto project, add the following to `_quarto.yml`:

```yaml
engines:
  - path: "crazytalk.ts"
```

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

## Setup

This engine requires Quarto 1.9 (currently in development) with support for external engines.

1. Ensure the `@quarto/types` package is built:

```bash
cd ../quarto-cli/packages/quarto-types
npm install
npm run build
```

2. In your Quarto project, add the following to `_quarto.yml`:

```yaml
engines:
  - url: file:///absolute/path/to/quarto-crazytalk-engine/crazytalk-engine.ts
```

**Important**: When using the `file://` domain, the path must be absolute. Project-relative paths are not currently supported. This limitation will likely be fixed in the stable release.

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

### @quarto/types Package

**Important**: This engine imports types from the `@quarto/types` package using a relative path to the built distribution:

```typescript
import {
  ExecutionEngineDiscovery,
  // Other types...
} from "../quarto-cli/packages/quarto-types/dist/index.js";
```

The `@quarto/types` package must be built before using this engine. See [Setup](#setup).

Note that `@quarto/types` is not yet published as an npm package because its API is still in flux. Using it directly like this is experimental and may break with future Quarto updates. Use at your own risk.

## Example

See `example.qmd` for a demonstration of famous quotes transformed into cRaZyTaLk.
