import { mkdirSync, readdirSync, statSync, copyFileSync, existsSync } from "fs";
import { join, dirname } from "path";

/**
 * Copy a file from src to dest, ensuring the destination directory exists.
 */
function copyFileSafe(src: string, dest: string) {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  console.log(`[sync-icons] ${src} -> ${dest}`);
}

/**
 * Sync chain resources from src/assets to public/assets.
 *
 * Source: src/assets/chains/{namespace}/{reference}/chain.json + chain.svg
 * Target: public/assets/chains/{namespace}/{reference}/chain.json + chain.svg
 */
function syncChains(root: string) {
  const srcChainsDir = join(root, "src", "assets", "chains");
  const destChainsDir = join(root, "public", "assets", "chains");

  const namespaceDirs = readdirSync(srcChainsDir);
  for (const namespace of namespaceDirs) {
    const namespaceFull = join(srcChainsDir, namespace);
    if (!statSync(namespaceFull).isDirectory()) continue;

    const referenceDirs = readdirSync(namespaceFull);
    for (const reference of referenceDirs) {
      const refFull = join(namespaceFull, reference);
      if (!statSync(refFull).isDirectory()) continue;

      const jsonSrc = join(refFull, "chain.json");
      const svgSrc = join(refFull, "chain.svg");

      if (existsSync(jsonSrc)) {
        const jsonDest = join(destChainsDir, namespace, reference, "chain.json");
        copyFileSafe(jsonSrc, jsonDest);
      }

      if (existsSync(svgSrc)) {
        const svgDest = join(destChainsDir, namespace, reference, "chain.svg");
        copyFileSafe(svgSrc, svgDest);
      }
    }
  }
}

/**
 * Sync wallet resources from src/assets to public/assets.
 *
 * Source: src/assets/wallets/{walletId}/wallet.json + wallet.svg
 * Target: public/assets/wallets/{walletId}/wallet.json + wallet.svg
 */
function syncWallets(root: string) {
  const srcWalletsDir = join(root, "src", "assets", "wallets");
  const destWalletsDir = join(root, "public", "assets", "wallets");

  const entries = readdirSync(srcWalletsDir);
  for (const entry of entries) {
    const full = join(srcWalletsDir, entry);
    if (!statSync(full).isDirectory()) continue;

    const jsonSrc = join(full, "wallet.json");
    const svgSrc = join(full, "wallet.svg");

    if (existsSync(jsonSrc)) {
      const jsonDest = join(destWalletsDir, entry, "wallet.json");
      copyFileSafe(jsonSrc, jsonDest);
    }

    if (existsSync(svgSrc)) {
      const svgDest = join(destWalletsDir, entry, "wallet.svg");
      copyFileSafe(svgSrc, svgDest);
    }
  }
}

/**
 * Sync token resources from src/assets to public/assets.
 *
 * Source: src/assets/tokens/{namespace}/{reference}/{address}/token.json + token.svg
 * Target: public/assets/tokens/{namespace}/{reference}/{address}/token.json + token.svg
 */
function syncTokens(root: string) {
  const srcTokensDir = join(root, "src", "assets", "tokens");
  const destTokensDir = join(root, "public", "assets", "tokens");

  const namespaceDirs = readdirSync(srcTokensDir);
  for (const namespace of namespaceDirs) {
    const namespaceFull = join(srcTokensDir, namespace);
    if (!statSync(namespaceFull).isDirectory()) continue;

    const referenceDirs = readdirSync(namespaceFull);
    for (const reference of referenceDirs) {
      const refFull = join(namespaceFull, reference);
      if (!statSync(refFull).isDirectory()) continue;

      const addressDirs = readdirSync(refFull);
      for (const addressDir of addressDirs) {
        const addrFull = join(refFull, addressDir);
        if (!statSync(addrFull).isDirectory()) continue;

        const jsonSrc = join(addrFull, "token.json");
        const svgSrc = join(addrFull, "token.svg");

        if (existsSync(jsonSrc)) {
          const jsonDest = join(destTokensDir, namespace, reference, addressDir, "token.json");
          copyFileSafe(jsonSrc, jsonDest);
        }

        if (existsSync(svgSrc)) {
          const svgDest = join(destTokensDir, namespace, reference, addressDir, "token.svg");
          copyFileSafe(svgSrc, svgDest);
        }
      }
    }
  }
}

function main() {
  const root = process.cwd();
  console.log("[sync-icons] Syncing assets from src/assets -> public/assets ...");

  syncChains(root);
  syncWallets(root);
  syncTokens(root);

  console.log("[sync-icons] Done.");
}

main();
