/*
 * crazytalk-engine.ts
 *
 * Copyright (C) 2020-2025 Posit Software, PBC
 */

// Import types from bundled types
import type {
  DependenciesOptions,
  DependenciesResult,
  ExecuteOptions,
  ExecuteResult,
  ExecutionEngineDiscovery,
  ExecutionTarget,
  ExecutionEngineInstance,
  PostProcessOptions,
  MappedString,
  EngineProjectContext,
  QuartoAPI,
} from "./types/quarto-types.d.ts";

// Import from Deno standard library
import { extname } from "path";

export const kMdExtensions = [".md", ".markdown"];
export const kQmdExtensions = [".qmd"];

let quarto: QuartoAPI;

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

  init: (quartoAPI: QuartoAPI) => {
    quarto = quartoAPI;
  },

  quartoRequired: ">1.9",

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
  checkInstallation: async(_) => {
    console.log(crazify('crazytalk validates'));
  },

  /**
   * Launch a dynamic execution engine with project context
   */
  launch: (context: EngineProjectContext): ExecutionEngineInstance => {
    return {
      // Properties needed on both interfaces
      name: crazyTalkEngineDiscovery.name,
      canFreeze: crazyTalkEngineDiscovery.canFreeze,

      /**
       * Read file and convert to markdown with source mapping
       */
      markdownForFile(file: string): Promise<MappedString> {
        return Promise.resolve(quarto.mappedString.fromFile(file));
      },

      /**
       * Create an execution target for a file
       */
      target: (file: string, _quiet?: boolean, markdown?: MappedString) => {
        const md = markdown ?? quarto.mappedString.fromFile(file);
        const metadata = quarto.markdownRegex.extractYaml(md.value);
        if (metadata?.title) {
          metadata.title = crazify(metadata.title as string);
        }
        const target: ExecutionTarget = {
          source: file,
          input: file,
          markdown: md,
          metadata,
        };
        return Promise.resolve(target);
      },

      /**
       * Extract partitioned markdown from a file
       */
      partitionedMarkdown: (file: string) => {
        return Promise.resolve(
          quarto.markdownRegex.partition(Deno.readTextFileSync(file)),
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
          const languages = quarto.markdownRegex.getLanguages(markdown);
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