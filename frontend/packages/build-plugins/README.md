# @thunderid/build-plugins

Shared build-tool plugins for ThunderID frontend apps.

## Sub-paths

| Sub-path                        | Description                       |
| ------------------------------- | --------------------------------- |
| `@thunderid/build-plugins/vite` | Vite plugins (framework-agnostic) |

## Plugins

### `prismjsInjectCore` · `@thunderid/build-plugins/vite`

```ts
import {prismjsInjectCore} from '@thunderid/build-plugins/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [prismjsInjectCore()],
});
```

prismjs language files reference `Prism` as an implicit global with no import statement. This plugin prepends
`import Prism from 'prismjs'` to each language file so Rollup can see the dependency edge and evaluate the core module
before any language file at bundle time.

### `linkWorkspaceSource` · `@thunderid/build-plugins/vite`

```ts
import {linkWorkspaceSource} from '@thunderid/build-plugins/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [linkWorkspaceSource()],
});
```

During `vite serve` (never build, and never vitest, which also drives Vite in serve mode), this plugin redirects
`@thunderid/*` workspace imports to each package's `src` instead of its prebuilt `dist/` output, so edits under
`packages/*/src` hot-update in the consuming app. Pass `root` to override the app root used to resolve workspace
dependencies; it defaults to the resolved Vite config root.

## Adding a New Plugin

`<category>` is the build-tool context the plugin targets — it becomes the sub-path consumers import from. Use the tool
name followed by the framework or environment when relevant:

| Category     | When to use                                     |
| ------------ | ----------------------------------------------- |
| `vite`       | Vite plugins, any framework (existing)          |
| `vite-react` | Vite plugins specific to React apps             |
| `vite-node`  | Vite plugins for Node/SSR targets               |
| `rolldown`   | Rolldown-only plugins (e.g. for package builds) |
| `esbuild`    | esbuild plugins                                 |

Steps to add a plugin:

- Create `src/<category>/your-plugin.ts` and export it from `src/<category>/index.ts`
- If it is a new category:
  - Add a sub-path entry under `exports` in `package.json` pointing to the new `dist/<category>/` paths
  - Add the new entry `join('src', '<category>', 'index.ts')` to the `input` array in `rolldown.config.js`
