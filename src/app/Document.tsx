import { env } from "cloudflare:workers";
import styles from "./styles/globals.css?url";
import rootStyles from "./styles/root.css?url";
import { RequestInfo } from "rwsdk/worker";
import { PropsWithChildren } from "react";

export const Document: React.FC<PropsWithChildren<RequestInfo>> = ({
  children,
  rw,
}: PropsWithChildren<RequestInfo>) => {
  return <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Primary SEO */}
      <title>Linkits - Curate, Organize & Share Link Collections</title>
      <meta name="description" content="Build beautiful link kits. Organize links by topic, keep private notes, or publish curated pages that get indexed by search engines. Your links, your way." />
      <meta name="keywords" content="link curation, link collection, bookmark organizer, curated links, link sharing, resource hub, link kit, link page, personal links, topic links" />
      <link rel="canonical" href="https://linkits.xyz" />

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Linkits" />
      <meta property="og:title" content="Linkits - Curate, Organize & Share Link Collections" />
      <meta property="og:description" content="Build beautiful link kits. Organize links by topic, keep private notes, or publish curated pages that get indexed by search engines." />
      <meta property="og:url" content="https://linkits.xyz" />
      <meta property="og:image" content="https://linkits.xyz/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Linkits - Curate, Organize & Share Link Collections" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@linkits" />
      <meta name="twitter:title" content="Linkits - Curate, Organize & Share Link Collections" />
      <meta name="twitter:description" content="Build beautiful link kits. Organize links by topic, keep private notes, or publish curated pages that get indexed by search engines." />
      <meta name="twitter:image" content="https://linkits.xyz/og-image.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="/fonts/lufga/style.css" />
      <link rel="stylesheet" href={styles} />
      <link rel="stylesheet" href={rootStyles} />
      <link rel="modulepreload" href="/src/client.tsx" />
      <script nonce={rw.nonce} type="text/javascript" dangerouslySetInnerHTML={{
        __html: `
        window.posthogApiKey = "${env.POSTHOG_PUBLIC_KEY}";\n
        window.posthogApiHost = "${env.POSTHOG_PUBLIC_HOST}";
        `
      }}>

      </script>
      <meta name="google-site-verification" content={env.GOOGLE_SITE_VERIFICATION} />
    </head>
    <body>
      <div id="root">{children}</div>
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
}