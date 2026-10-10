# Host and Remote Container Configuration

In enterprise micro-frontend deployments, hardcoding remote URLs into build configuration files (`webpack.config.js`) introduces deployment coupling: updating a remote's CDN endpoint requires rebuilding and redeploying the host application. Dynamic host and remote container configuration enables runtime remote resolution, version negotiation, and environment-driven URL injection.

---

## 1. Dynamic Remote URL Injection Pattern

Instead of static configuration strings, resolve remote containers at runtime using dynamic script injection:

```tsx
// src/utils/dynamicFederation.ts
export async function loadRemoteComponent(
  remoteUrl: string,
  scope: string,
  module: string
) {
  // 1. Check if remote script is already injected into DOM head
  if (!(window as any)[scope]) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = remoteUrl;
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load remote script: ${remoteUrl}`));

      document.head.appendChild(script);
    });
  }

  // 2. Initialize the remote container's sharing scope
  await __webpack_init_sharing__("default");
  const container = (window as any)[scope];
  await container.init(__webpack_share_scopes__.default);

  // 3. Obtain factory for requested component
  const factory = await container.get(module);
  return factory();
}
```

---

## 2. Dynamic Remote Component Wrapper

```tsx
import React, { lazy, Suspense } from "react";
import { loadRemoteComponent } from "./utils/dynamicFederation";

interface DynamicRemoteProps {
  url: string;
  scope: string;
  module: string;
  props?: Record<string, any>;
}

export function DynamicRemote({ url, scope, module, props }: DynamicRemoteProps) {
  // Lazily loads the remote component dynamically from provided URL
  const Component = lazy(() => loadRemoteComponent(url, scope, module));

  return (
    <Suspense
      fallback={
        <div className="p-4 bg-slate-800 text-slate-400 rounded text-xs animate-pulse">
          Mounting remote container ({scope})...
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
}
```

---

## 3. Environment-Aware Service Discovery

In production, fetch remote manifests dynamically from a centralized Service Discovery / Configuration service:

```tsx
import React, { useEffect, useState } from "react";
import { DynamicRemote } from "./DynamicRemote";

interface RemoteManifest {
  analytics: string;
  billing: string;
  support: string;
}

export function EnterprisePortal() {
  const [manifest, setManifest] = useState<RemoteManifest | null>(null);

  useEffect(() => {
    // Query runtime discovery endpoint for active remote CDN versions
    fetch("/api/v1/config/microfrontends")
      .then((res) => res.json())
      .then((data: RemoteManifest) => setManifest(data));
  }, []);

  if (!manifest) return <div>Resolving service discovery...</div>;

  return (
    <div className="p-8 space-y-6 bg-slate-950 text-white min-h-screen">
      <h1 className="text-xl font-bold">Dynamic Enterprise Micro-Frontend Portal</h1>

      {/* Renders billing remote resolved at runtime */}
      <DynamicRemote
        url={manifest.billing}
        scope="billing_remote"
        module="./BillingSummary"
      />

      {/* Renders analytics remote resolved at runtime */}
      <DynamicRemote
        url={manifest.analytics}
        scope="analytics_remote"
        module="./ExecutiveCharts"
      />
    </div>
  );
}
```

---

## 4. Shared Dependency Version Negotiation

When Host and Remote applications specify different versions of a shared package in their `package.json`, Module Federation applies SemVer rules:
- If versions are compatible (e.g. Host requires `^18.2.0`, Remote requires `^18.1.0`), Webpack loads the highest compatible version.
- If `singleton: true` is set and versions conflict incompatibly (e.g. `17.0.0` vs `18.2.0`), Webpack logs a console warning and uses the host's version, preventing multiple conflicting runtimes.

---

## Practice Quiz

### Q1: Why is static remote URL configuration in webpack.config.js limiting in enterprise multi-cloud environments?
- A) Webpack crashes on Linux
- B) Changing a remote's CDN URL or version requires rebuilding and redeploying the host application, re-coupling independent deployment pipelines
- C) Static configurations delete cookies
- D) It only works in development mode
**Answer:** B
**Explanation:** Hardcoded remote URLs force host redeployments whenever remotes change endpoints. Dynamic runtime resolution allows remotes to deploy and update manifests independently.

### Q2: What are __webpack_init_sharing__ and __webpack_share_scopes__ in Module Federation?
- A) Native Webpack runtime primitives that initialize and coordinate the shared dependency registry across host and remote containers
- B) Third-party npm libraries
- C) Database connection parameters
- D) CSS stylesheet preprocessors
**Answer:** A
**Explanation:** These internal Webpack runtime methods initialize the shared dependency scope (e.g. 'default') so host and remotes share singletons like React without version conflicts.

### Q3: How does a dynamic remote component handle a runtime network failure when loading remoteEntry.js?
- A) The computer shuts down
- B) The script loader Promise rejects, triggering an error that can be caught by an enclosing React Error Boundary to display a graceful fallback
- C) The browser reloads the entire operating system
- D) Webpack automatically fixes the network
**Answer:** B
**Explanation:** If the remote script fails to download, the injection Promise rejects, allowing an Error Boundary to isolate the failure and keep the rest of the host app functional.

### Q4: What role does a "Service Discovery" configuration endpoint play in micro-frontend architectures?
- A) It provides real-time mappings of remote container names to their active CDN URLs, enabling canary deployments and instant rollbacks
- B) It searches Google for missing components
- C) It validates HTML syntax
- D) It compiles TypeScript to JavaScript
**Answer:** A
**Explanation:** Service discovery maps micro-frontend names to current CDN asset URLs, allowing ops teams to point traffic to new versions or roll back without touching host code.

### Q5: What happens if a shared dependency has singleton: true and strictVersion: true and the versions do not match?
- A) Webpack silently ignores the error
- B) Webpack throws a runtime error halting execution, enforcing strict version uniformity across all federated containers
- C) The browser downloads both versions simultaneously
- D) React switches to Vue
**Answer:** B
**Explanation:** Setting strictVersion: true alongside singleton: true instructs Webpack to halt execution with an error if version mismatch occurs, preventing subtle incompatibility bugs.
