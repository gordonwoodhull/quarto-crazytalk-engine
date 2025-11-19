// deno:https://jsr.io/@std/path/1.0.8/_os.ts
var isWindows = globalThis.Deno?.build.os === "windows" || globalThis.navigator?.platform?.startsWith("Win") || globalThis.process?.platform?.startsWith("win") || false;

// deno:https://jsr.io/@std/path/1.0.8/_common/assert_path.ts
function assertPath(path) {
  if (typeof path !== "string") {
    throw new TypeError(`Path must be a string, received "${JSON.stringify(path)}"`);
  }
}

// deno:https://jsr.io/@std/path/1.0.8/_common/constants.ts
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;

// deno:https://jsr.io/@std/path/1.0.8/posix/_util.ts
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}

// deno:https://jsr.io/@std/path/1.0.8/windows/_util.ts
function isPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code) {
  return code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z || code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z;
}

// deno:https://jsr.io/@std/path/1.0.8/posix/extname.ts
function extname(path) {
  assertPath(path);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path.length - 1; i >= 0; --i) {
    const code = path.charCodeAt(i);
    if (isPosixPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path.slice(startDot, end);
}

// deno:https://jsr.io/@std/path/1.0.8/windows/extname.ts
function extname2(path) {
  assertPath(path);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path.length >= 2 && path.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path.length - 1; i >= start; --i) {
    const code = path.charCodeAt(i);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path.slice(startDot, end);
}

// deno:https://jsr.io/@std/path/1.0.8/extname.ts
function extname3(path) {
  return isWindows ? extname2(path) : extname(path);
}

// src/crazytalk-engine.ts
var kMdExtensions = [
  ".md",
  ".markdown"
];
var kQmdExtensions = [
  ".qmd"
];
var quarto;
var crazify = (s) => {
  let i = 0;
  return s.replace(/[a-z]/gi, (c) => ++i % 2 ? c.toLowerCase() : c.toUpperCase());
};
var crazyTalkEngineDiscovery = {
  init: (quartoAPI) => {
    quarto = quartoAPI;
  },
  quartoRequired: ">1.9",
  // Basic engine properties
  name: "cRaZyTaLk",
  defaultExt: ".qmd",
  defaultYaml: () => [],
  defaultContent: () => [],
  validExtensions: () => kQmdExtensions.concat(kMdExtensions),
  claimsFile: (_file, ext) => {
    return kMdExtensions.includes(ext.toLowerCase());
  },
  claimsLanguage: (_language) => {
    return false;
  },
  canFreeze: false,
  generatesFigures: false,
  checkInstallation: async (_) => {
    console.log(crazify("crazytalk validates"));
  },
  /**
   * Launch a dynamic execution engine with project context
   */
  launch: (context) => {
    return {
      // Properties needed on both interfaces
      name: crazyTalkEngineDiscovery.name,
      canFreeze: crazyTalkEngineDiscovery.canFreeze,
      /**
       * Read file and convert to markdown with source mapping
       */
      markdownForFile(file) {
        return Promise.resolve(quarto.mappedString.fromFile(file));
      },
      /**
       * Create an execution target for a file
       */
      target: (file, _quiet, markdown) => {
        const md = markdown ?? quarto.mappedString.fromFile(file);
        const metadata = quarto.markdownRegex.extractYaml(md.value);
        if (metadata?.title) {
          metadata.title = crazify(metadata.title);
        }
        const target = {
          source: file,
          input: file,
          markdown: md,
          metadata
        };
        return Promise.resolve(target);
      },
      /**
       * Extract partitioned markdown from a file
       */
      partitionedMarkdown: (file) => {
        return Promise.resolve(quarto.markdownRegex.partition(Deno.readTextFileSync(file)));
      },
      /**
       * Execute a document - this is where the cRaZyTaLk magic happens!
       */
      execute: (options) => {
        const markdown = crazify(options.target.markdown.value);
        if (extname3(options.target.input).toLowerCase() === ".md") {
          const languages = quarto.markdownRegex.getLanguages(markdown);
          if (languages.size > 0) {
            throw new Error("You must use the .qmd extension for documents with executable code.");
          }
        }
        return Promise.resolve({
          engine: "cRaZyTaLk",
          markdown,
          supporting: [],
          filters: []
        });
      },
      /**
       * Process dependencies
       */
      dependencies: (_options) => {
        return Promise.resolve({
          includes: {}
        });
      },
      /**
       * Post-process output
       */
      postprocess: (_options) => Promise.resolve()
    };
  }
};
var crazytalk_engine_default = crazyTalkEngineDiscovery;
export {
  crazytalk_engine_default as default,
  kMdExtensions,
  kQmdExtensions
};
