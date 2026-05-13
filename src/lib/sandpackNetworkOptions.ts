/**
 * Sandpack parla con server CodeSandbox (bundler +, in alcuni casi, collector tipo col.csbops.io).
 * Se vedi ERR_CONNECTION_TIMED_OUT in console: prova altra rete/VPN, whitelist, oppure
 * `NEXT_PUBLIC_SANDPACK_BUNDLER_URL` verso un bundler self-hosted (vedi guida Sandpack “Hosting the Bundler”).
 */
export function getSandpackNetworkOptions(): {
  bundlerURL?: string;
  experimental_enableServiceWorker: boolean;
  bundlerTimeOut: number;
} {
  const bundlerURL = process.env.NEXT_PUBLIC_SANDPACK_BUNDLER_URL?.trim();
  return {
    ...(bundlerURL ? { bundlerURL } : {}),
    experimental_enableServiceWorker: false,
    bundlerTimeOut: 120_000,
  };
}
