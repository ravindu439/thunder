// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Based on https://github.com/PrismJS/prism/pull/3418
export default function prismIncludeLanguages(PrismObject) {
  // Vue SFC: extends HTML markup with Vue template directives and interpolation
  PrismObject.languages.vue = PrismObject.languages.extend('markup', {});

  // Mustache interpolation {{ expression }}
  PrismObject.languages.insertBefore('vue', 'tag', {
    'interpolation': {
      pattern: /\{\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}\}/,
      inside: {
        'punctuation': /^\{\{|\}\}$/,
        rest: PrismObject.languages.javascript,
      },
    },
  });

  // Prepend vue-directive before attr-name so directives take priority over plain attributes
  PrismObject.languages.vue['tag'].inside = {
    'vue-directive': {
      // v-if, v-for, v-bind:prop, v-on:event, :prop, @event, #slot, v-model.modifier
      pattern: /(?:v-[a-z][a-z0-9-]*(?::[a-zA-Z0-9_-]*)?(?:\.[a-zA-Z0-9-]*)*|[@:#][^\s"'=><`/]*)/,
      alias: 'keyword',
    },
    ...PrismObject.languages.vue['tag'].inside,
  };

  PrismObject.languages.dotenv = {
    'comment': /(?:^|(?<=[\s"'`]))#(?![^\n"'`]*["'`])[^\r\n \t]*(?:[ \t]+[^\r\n \t]+)*[ \t]*/,
    'keyword': /^export(?=\s)/m,
    'key': {
      pattern: /(?<=^[ \t]*)[a-z_]\w*(?=[ \t]*(?:=|$))/im,
      alias: 'constant',
    },
    'value': [
      {
        pattern: /(?<==\s*)(?:-?[1-9]\d*|0)(?:\.\d+)?(?=\s*$)/m,
        alias: 'number',
      },
      {
        pattern: /(?<==\s*)(?:false|true)(?=\s*$)/m,
        alias: 'boolean',
      },
      {
        pattern: /(?<==\s*)(?:(['"`])(?:\\[\s\S]|(?!\1)[^\\])*?\1|\S(?:.*?\S)?)(?=\s*$|\s+#.*$)/m,
        alias: 'string',
      },
    ],
    'assignment-operator': {
      pattern: /=/,
      alias: 'operator',
    },
  };
}
