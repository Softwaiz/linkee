import { Link } from "../link"

const footerLinks = [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#", rel: "nofollow" },
    { label: "Terms of Use", href: "#", rel: "nofollow" },
]

export function Footer() {
    return (
        <footer className="border-t border-border px-6 py-10">
            <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-6 md:flex-row md:justify-between">
                {/* Logo + copyright */}
                <div className="flex items-center gap-2">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 28 28"
                        fill="none"
                        className="text-foreground"
                        aria-hidden="true"
                    >
                        <rect width="28" height="28" rx="6" fill="currentColor" />
                        <path
                            d="M8 14h4m4 0h4M14 8v4m0 4v4"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="text-sm text-muted-foreground">
                        {"\u00A9"} {new Date().getFullYear()} Linkits. All rights reserved.
                    </span>
                </div>

                {/* Links */}
                <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            rel={link.rel}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    )
}
