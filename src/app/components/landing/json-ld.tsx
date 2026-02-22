export function JsonLd() {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Linkits",
        url: "https://linkits.xyz",
        description:
            "Create link collections, discover curated resources, and organize everything you find online.",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: "https://linkits.xyz/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
    )
}
