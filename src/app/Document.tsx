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
      <title>Linkee - AI-Powered Curation with Soul, Speed, and an Edge</title>
      <meta name="description" content="Linkee is the AI curation agent that organizes the internet with sub-second speed. Curate podcasts, articles, and resources with creative intelligence." />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Linkee - AI-Powered Curation Agent" />
      <meta property="og:description" content="Curation with Soul, Speed, and an Edge. Organize the internet in milliseconds." />
      <meta name="twitter:card" content="summary_large_image" />
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
      <meta name="google-site-verification" content="JfgS7XxfGg7Reb3pb4S7aBrAdHQSHkgvRw4RceSPJrw" />
    </head>
    <body>
      <div id="root">{children}</div>
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
}