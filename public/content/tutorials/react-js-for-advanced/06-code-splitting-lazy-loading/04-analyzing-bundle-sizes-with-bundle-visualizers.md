# Analyzing Bundle Sizes with Rollup and Webpack Visualizer

You cannot optimize what you do not measure. In modern frontend development, unintended transitive dependencies (such as un-treeshaken icon libraries, legacy date utilities, or duplicate package versions) can quietly inflate bundle sizes by hundreds of kilobytes. Bundle visualizer tooling provides interactive visual audits to diagnose and eliminate bundle bloat.

---

## 1. Why Visual Auditing is Essential

Without visual inspection, developers frequently introduce bloat inadvertently:
- Importing `{ format } from 'date-fns'` vs importing all locales.
- Importing an entire icon library: `import * as Icons from 'react-icons'`.
- Accidental dual packages: having both `lodash` and `lodash-es` in the build graph.
- Unused polyfills included for modern browser targets.

---

## 2. Configuring Visualizer in Vite (`rollup-plugin-visualizer`)

In Vite projects, `rollup-plugin-visualizer` generates an interactive treemap diagram of every output chunk:

```bash
npm install -D rollup-plugin-visualizer
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true, // Automatically opens visual report in default browser after build
      gzipSize: true, // Displays estimated gzip size
      brotliSize: true, // Displays estimated brotli compressed size
      template: "treemap", // 'treemap' | 'sunburst' | 'network'
    }),
  ],
});
```

Running `npm run build` outputs `dist/stats.html`, which renders an interactive nested treemap of every chunk and module.

---

## 3. Webpack Bundle Analyzer Configuration

For Webpack and Next.js applications, `webpack-bundle-analyzer` provides an equivalent visual inspection dashboard:

```bash
npm install -D webpack-bundle-analyzer
```

```js
// webpack.config.js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [
    process.env.ANALYZE === "true" &&
      new BundleAnalyzerPlugin({
        analyzerMode: "server",
        analyzerPort: 8888,
        openAnalyzer: true,
      }),
  ].filter(Boolean),
};
```

---

## 4. Understanding Size Metrics: Stat vs Parsed vs Gzipped

When inspecting bundle reports, you will encounter three distinct metrics:

| Metric | Meaning | Optimization Focus |
| :--- | :--- | :--- |
| **Stat Size** | Raw input size of unminified source code before transformations. | Shows author-level code volume. |
| **Parsed Size** | Output size after minification, dead code elimination, and bundling. | The actual bytes the browser JavaScript engine must parse and compile. |
| **Gzipped / Brotli Size** | Final wire size transferred over the network after HTTP compression. | The actual bandwidth cost affecting download speed and First Contentful Paint. |

---

## 5. Remediation Strategies for Common Bloat Findings

### Anti-Pattern 1: Monolithic Lodash Import
```ts
// Bad: Pulls the entire 70KB Lodash library into the chunk
import _ from "lodash";
const clean = _.cloneDeep(data);

// Good: Tree-shakable ES module or direct subpath
import cloneDeep from "lodash/cloneDeep";
// Or using lodash-es with tree-shaking
import { cloneDeep } from "lodash-es";
```

### Anti-Pattern 2: Bloated Moment.js with All Locales
```ts
// Bad: Moment.js bundles ~300KB of internationalization locales
import moment from "moment";

// Good: Replace with lightweight tree-shakable alternatives like Day.js or date-fns
import { format } from "date-fns";
```

### Anti-Pattern 3: Bulk Icon Imports
```ts
// Bad: May bundle 5,000 icon SVG definitions
import * as Lucide from "lucide-react";

// Good: Direct cherry-picked import
import { CheckCircle2, AlertTriangle } from "lucide-react";
```

---

## Practice Quiz

### Q1: What does the "Gzipped Size" metric represent in bundle visualizers?
- A) The raw number of lines of TypeScript code
- B) The size of the file after Webpack minification and gzip compression, reflecting true network wire transfer payload
- C) The memory allocated by the V8 JavaScript engine heap
- D) The size of images stored on the server SSD
**Answer:** B
**Explanation:** Gzipped size measures the byte payload transmitted over the network after HTTP compression, which determines download latency.

### Q2: Why is Moment.js notoriously flagged by bundle analyzers in modern React apps?
- A) It does not support JavaScript Promises
- B) It includes all world locale translations by default, inflating bundle size by several hundred kilobytes without tree-shaking
- C) It fails to run on Node.js v18
- D) It conflicts with CSS Grid layouts
**Answer:** B
**Explanation:** Moment.js bundles all global locale files into its core distribution and lacks modular tree-shaking, leading developers to replace it with modular libraries like date-fns or Day.js.

### Q3: What is the primary benefit of rollup-plugin-visualizer in a Vite project?
- A) It automatically rewrites your SQL queries
- B) It generates an interactive HTML visual chart mapping out chunks, vendor modules, and their respective byte weights
- C) It translates TypeScript into C++ binary code
- D) It replaces React with jQuery
**Answer:** B
**Explanation:** rollup-plugin-visualizer analyzes build outputs and generates an interactive HTML diagram displaying the exact footprint of all dependencies and chunks.

### Q4: If an analyzer reveals that both lodash and lodash-es are bundled in your application, what is the most likely cause?
- A) Your computer has two CPU cores
- B) One dependency imports CommonJS lodash while another or your source code imports lodash-es, creating duplicate packages in the graph
- C) Vite requires two copies of every library
- D) The browser cache is full
**Answer:** B
**Explanation:** Transitive dependencies frequently cause duplicate package inclusions when one library depends on the CommonJS variant and your application uses the ES module variant.

### Q5: What is the difference between "Parsed Size" and "Stat Size"?
- A) Stat Size is measured after minification; Parsed Size is measured before bundling
- B) Stat Size is the raw source input size; Parsed Size is the post-bundling, post-minification JavaScript processed by the browser
- C) Stat Size only applies to images
- D) Parsed Size includes backend database records
**Answer:** B
**Explanation:** Stat size reflects the raw input file size before processing; parsed size is the actual minified bundle output evaluated by the browser's JavaScript engine.
