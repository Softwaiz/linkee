import styles from "./styles/globals.css?url";
import { WrappedToaster } from "./toaster";

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
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

      <link rel="modulepreload" href="/src/client.tsx" />
    </head>
    <body>
      <div id="root">{children}</div>
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);
