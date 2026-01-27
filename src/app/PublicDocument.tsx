import styles from "./styles/globals.css?url";

export const PublicDocument: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
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

            <link rel="modulepreload" href="/src/client.tsx" />
        </head>
        <body>
            <div id="root">{children}</div>
            <script>import("/src/client.tsx")</script>
        </body>
    </html>
);
