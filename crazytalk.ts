/*
 * crazytalk.ts
 *
 * Copyright (C) 2020-2025 Posit Software, PBC
 */

// Import types from built distribution
import {
  DependenciesOptions,
  DependenciesResult,
  ExecuteOptions,
  ExecuteResult,
  ExecutionEngineDiscovery,
  ExecutionTarget,
  LaunchedExecutionEngine,
  PostProcessOptions,
  MappedString,
  EngineProjectContext} from "../quarto-cli/packages/quarto-types/dist/index.js";

// Import from Deno standard library
import { extname } from "path";

export const kMdExtensions = [".md", ".markdown"];
export const kQmdExtensions = [".qmd"];

const crazify = (s: string) => {
  let i = 0;
  return s.replace(
    /[a-z]/gi,
    (c) => ++i % 2 ? c.toLowerCase() : c.toUpperCase(),
  );
};

/**
 * cRaZyTaLk engine discovery implementation
 * This uses the new ExecutionEngineDiscovery interface with _discovery flag
 */
const crazyTalkEngineDiscovery: ExecutionEngineDiscovery & { _discovery: boolean } = {
  // Flag to indicate this is a discovery engine (will be removed in stable 1.9)
  _discovery: true,

  // Basic engine properties
  name: "cRaZyTaLk",
  defaultExt: ".qmd",
  defaultYaml: () => [],
  defaultContent: () => [],
  validExtensions: () => kQmdExtensions.concat(kMdExtensions),
  claimsFile: (_file: string, ext: string) => {
    return kMdExtensions.includes(ext.toLowerCase());
  },
  claimsLanguage: (_language: string) => {
    return false;
  },
  canFreeze: false,
  generatesFigures: false,

  /**
   * Launch a dynamic execution engine with project context
   */
  launch: (context: EngineProjectContext): LaunchedExecutionEngine => {
    return {
      // Properties needed on both interfaces
      name: crazyTalkEngineDiscovery.name,
      canFreeze: crazyTalkEngineDiscovery.canFreeze,

      /**
       * Read file and convert to markdown with source mapping
       */
      markdownForFile(file: string): Promise<MappedString> {
        return Promise.resolve(context.quarto.mappedString.fromFile(file));
      },

      /**
       * Create an execution target for a file
       */
      target: (file: string, _quiet?: boolean, markdown?: MappedString) => {
        if (markdown === undefined) {
          markdown = context.quarto.mappedString.fromFile(file);
        }
        const metadata = context.quarto.markdownRegex.extractYaml(markdown.value);
        if (metadata?.title) {
          metadata.title = crazify(metadata.title as string);
        }
        const target: ExecutionTarget = {
          source: file,
          input: file,
          markdown,
          metadata,
        };
        return Promise.resolve(target);
      },

      /**
       * Extract partitioned markdown from a file
       */
      partitionedMarkdown: (file: string) => {
        return Promise.resolve(
          context.quarto.markdownRegex.partition(Deno.readTextFileSync(file)),
        );
      },

      /**
       * Execute a document - this is where the cRaZyTaLk magic happens!
       */
      execute: (options: ExecuteOptions): Promise<ExecuteResult> => {
        // Apply cRaZyTaLk transformation to the markdown
        const markdown = crazify(options.target.markdown.value);

        // if it's plain md, validate that it doesn't have executable cells in it
        if (extname(options.target.input).toLowerCase() === ".md") {
          const languages = context.quarto.markdownRegex.getLanguages(markdown);
          if (languages.size > 0) {
            throw new Error(
              "You must use the .qmd extension for documents with executable code.",
            );
          }
        }

        return Promise.resolve({
          engine: "cRaZyTaLk",
          markdown,
          supporting: [],
          filters: [],
        });
      },

      /**
       * Process dependencies
       */
      dependencies: (_options: DependenciesOptions): Promise<DependenciesResult> => {
        return Promise.resolve({
          includes: {},
        });
      },

      /**
       * Post-process output
       */
      postprocess: (_options: PostProcessOptions): Promise<void> => Promise.resolve(),
    };
  }
};

export default crazyTalkEngineDiscovery;
