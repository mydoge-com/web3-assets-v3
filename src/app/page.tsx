"use client";

import { useCallback, useMemo, useState } from "react";

type EndpointKey = "chains" | "wallets" | "tokens";

type EndpointConfig = {
  label: string;
  path: string;
  description: string;
  demoQuery?: string;
};

const ENDPOINTS: Record<EndpointKey, EndpointConfig> = {
  chains: {
    label: "Chains",
    path: "/api/chains",
    description: "List all supported chains or filter by CAIP‑2 chainId.",
    demoQuery: "?chainId=eip155:1",
  },
  wallets: {
    label: "Wallets",
    path: "/api/wallets",
    description: "Query all configured wallets with their icons.",
  },
  tokens: {
    label: "Tokens",
    path: "/api/tokens",
    description: "Browse token configurations, optionally by chainId.",
    demoQuery: "?chainId=eip155:1",
  },
};

const DEFAULT_PLACEHOLDER = `Choose an endpoint and click “Send request” to see a live JSON response here.`;

export default function Home() {
  const [endpoint, setEndpoint] = useState<EndpointKey>("chains");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string>(DEFAULT_PLACEHOLDER);
  const [status, setStatus] = useState<string | null>(null);

  const current = ENDPOINTS[endpoint];

  const url = useMemo(() => {
    const base = current.path;
    return current.demoQuery ? `${base}${current.demoQuery}` : base;
  }, [current]);

  const handleFetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setStatus(null);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const statusMessage = `HTTP ${response.status} ${response.statusText || ""}`.trim();
      setStatus(statusMessage);

      const data = await response.json();
      const pretty = JSON.stringify(data, null, 2);
      setOutput(pretty);
    } catch (error) {
      // Basic error fallback to keep the demo robust
      setOutput(
        JSON.stringify(
          {
            success: false,
            error: "Request failed. Please ensure the dev server is running.",
          },
          null,
          2,
        ),
      );
      setStatus("Request error");
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  return (
    <div className="home-shell">
      <section className="home-hero home-hero-single">
        <div className="home-hero-header">
          <h1 className="home-title text-balance">
            Minimal Web3 assets API,
            <br />
            ready to plug into your app.
          </h1>
          <p className="home-subtitle text-balance">
            A thin configuration layer on top of Next.js that exposes static JSON
            endpoints for chains, wallets, and tokens. Designed for multi‑chain
            setups using CAIP‑2 formatted chainIds such as <code>eip155:1</code>.
          </p>

          <div className="home-pill-row">
            <span className="home-pill">
              <span className="home-pill-dot" />
              CAIP‑2 chainId support
            </span>
            <span className="home-pill">Multi‑chain · multi‑wallet · multi‑token</span>
            <span className="home-pill">Cloudflare Workers ready</span>
          </div>

          <div className="home-meta">
            <div className="home-meta-item">
              <span className="home-meta-label">API style</span>
              <span className="home-meta-value">REST · JSON</span>
            </div>
            <div className="home-meta-item">
              <span className="home-meta-label">Best for</span>
              <span className="home-meta-value">Static Web3 configs</span>
            </div>
            <div className="home-meta-item">
              <span className="home-meta-label">Docs</span>
              <span className="home-meta-value">
                See <code>README.md</code>
              </span>
            </div>
          </div>
        </div>

        <div aria-label="API playground" className="api-panel api-panel-embedded">
          <div className="api-panel-header">
            <div>
              <h2 className="api-panel-title">API preview</h2>
              <p className="api-panel-muted">
                Hit the built‑in endpoints directly from the browser.
              </p>
            </div>

            <div className="api-endpoint-tabs" role="tablist" aria-label="Endpoints">
              {(Object.keys(ENDPOINTS) as EndpointKey[]).map((key) => {
                const cfg = ENDPOINTS[key];
                const isActive = key === endpoint;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`api-endpoint-tab ${isActive ? "is-active" : ""}`}
                    onClick={() => setEndpoint(key)}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="api-endpoint-meta">
            <span className="api-url">{url}</span>
            <span className="api-method-pill">
              <span className="api-method-dot" />
              GET
            </span>
          </div>

          <p className="api-panel-muted">{current.description}</p>

          <div className="api-actions">
            <p className="api-hint">
              Start the dev server with <code>pnpm dev</code> and try a real request.
            </p>
            <button
              type="button"
              className="api-button"
              onClick={handleFetch}
              disabled={isLoading}
            >
              <span className="api-button-icon">{isLoading ? "…" : "▶"}</span>
              {isLoading ? "Sending…" : "Send request"}
            </button>
          </div>

          <div className="api-badge-row">
            <span className="api-badge">Response: {status ?? "pending"}</span>
            <span className="api-badge">
              Filters: {endpoint === "wallets" ? "none" : 'optional query parameter "chainId"'}
            </span>
          </div>

          <pre
            aria-label="API response preview"
            className={`api-output ${
              output === DEFAULT_PLACEHOLDER ? "api-output-placeholder" : ""
            }`}
          >
            {output}
          </pre>
        </div>
      </section>
    </div>
  );
}
