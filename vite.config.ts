import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const packageJson = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8")) as { version?: string };
const frontendVersion = packageJson.version || "0.1.0";

function resolveGitShortSha() {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"]
    })
      .toString()
      .trim();
  } catch {
    return "local";
  }
}

const frontendReleaseSha = process.env.VITE_RELEASE_SHA || process.env.RELEASE_SHA || resolveGitShortSha();
const frontendReleaseCreatedAt = process.env.VITE_RELEASE_CREATED_AT || process.env.RELEASE_CREATED_AT || new Date().toISOString();

export default defineConfig(({ mode }) => {
  const isGithubPagesBuild = mode === "github-pages";
  const appBase = isGithubPagesBuild ? "/frontend-urreta/" : "/";
  const appBuildMeta = JSON.stringify(
    {
      version: frontendVersion,
      releaseSha: frontendReleaseSha,
      releaseCreatedAt: frontendReleaseCreatedAt,
      environment: mode
    },
    null,
    2
  );
  const webManifest = JSON.stringify(
    {
      name: "Urreta Distribuidora",
      short_name: "Urreta",
      description: "Clientes, pedidos, registro y productos en una app instalable.",
      start_url: appBase,
      scope: appBase,
      display: "standalone",
      orientation: "portrait",
      background_color: "#efe5d8",
      theme_color: "#d56b1d",
      lang: "es-UY",
      icons: [
        {
          src: `${appBase}icon-192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: `${appBase}icon-512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "any"
        },
        {
          src: `${appBase}icon-512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ]
    },
    null,
    2
  );

  return {
    base: appBase,
    plugins: [
      react(),
      {
        name: "urreta-app-build-meta",
        configureServer(server) {
          server.middlewares.use("/app-build.json", (_request, response) => {
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.setHeader("Cache-Control", "no-store");
            response.end(appBuildMeta);
          });
          server.middlewares.use("/manifest.webmanifest", (_request, response) => {
            response.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
            response.setHeader("Cache-Control", "no-store");
            response.end(webManifest);
          });
        },
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "app-build.json",
            source: appBuildMeta
          });
          this.emitFile({
            type: "asset",
            fileName: "manifest.webmanifest",
            source: webManifest
          });
        }
      }
    ],
    define: {
      __APP_VERSION__: JSON.stringify(frontendVersion),
      __APP_RELEASE_SHA__: JSON.stringify(frontendReleaseSha),
      __APP_RELEASE_CREATED_AT__: JSON.stringify(frontendReleaseCreatedAt)
    }
  };
});
