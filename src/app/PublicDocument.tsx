import styles from "./styles/globals.css?url";
import customStyles from "../app/layouts/theme.css?url";
import { PropsWithChildren } from "react";
import { env } from "cloudflare:workers";
import { RequestInfo } from "rwsdk/worker";

export const PublicDocument = ({
    children,
    rw
}: PropsWithChildren<RequestInfo>) => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

            <link rel="stylesheet" href="/fonts/lufga/style.css" />
            <link rel="stylesheet" href={styles} />
            <link rel="stylesheet" href={customStyles} />

            <link rel="modulepreload" href="/src/client.tsx" />

            <script nonce={rw.nonce} type="text/javascript" dangerouslySetInnerHTML={{
                __html: `
                    window.posthogApiKey = "${env.POSTHOG_PUBLIC_KEY}";\n
                    window.posthogApiHost = "${env.POSTHOG_PUBLIC_HOST}";
                    `
            }} />

            <meta name="google-site-verification" content={env.GOOGLE_SITE_VERIFICATION} />
        </head>
        <body>
            <div id="root">{children}</div>
            <script>import("/src/client.tsx")</script>
        </body>
    </html>
);
