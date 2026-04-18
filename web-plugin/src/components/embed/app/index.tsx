import "@/assets/globals.css";


const collections = [
    {
        title: "Frontend Development",
        description: "Essential tools for building modern web applications.",
        nodes: [
            {
                items: [
                    { title: "React", description: "A JavaScript library for building user interfaces." },
                    { title: "TypeScript", description: "A typed superset of JavaScript that scales." },
                    { title: "Tailwind CSS", description: "A utility-first CSS framework for rapid UI development." },
                    { title: "Vite", description: "Next generation frontend tooling." },
                ],
            }
        ]
    },
    {
        title: "Frontend Development",
        description: "Essential tools for building modern web applications.",
        nodes: [
            {
                items: [
                    { title: "React", description: "A JavaScript library for building user interfaces." },
                    { title: "TypeScript", description: "A typed superset of JavaScript that scales." },
                    { title: "Tailwind CSS", description: "A utility-first CSS framework for rapid UI development." },
                    { title: "Vite", description: "Next generation frontend tooling." },
                ],
            }
        ]
    },
    {
        title: "Frontend Development",
        description: "Essential tools for building modern web applications.",
        nodes: [
            {
                items: [
                    { title: "React", description: "A JavaScript library for building user interfaces." },
                    { title: "TypeScript", description: "A typed superset of JavaScript that scales." },
                    { title: "Tailwind CSS", description: "A utility-first CSS framework for rapid UI development." },
                    { title: "Vite", description: "Next generation frontend tooling." },
                ],
            }
        ]
    },
    {
        title: "Frontend Development",
        description: "Essential tools for building modern web applications.",
        nodes: [
            {
                items: [
                    { title: "React", description: "A JavaScript library for building user interfaces." },
                    { title: "TypeScript", description: "A typed superset of JavaScript that scales." },
                    { title: "Tailwind CSS", description: "A utility-first CSS framework for rapid UI development." },
                    { title: "Vite", description: "Next generation frontend tooling." },
                ],
            }
        ]
    }
]

export function EmbeddedApp() {
    return <div className="app w-[320px] h-full bg-background text-foreground">
        <div className="w-full flex flex-col items-start justify-start gap-2">
            <div className="px-2 py-1">
                <h1 className="text-lg font-semibold">Add this page to</h1>
            </div>
            <div className="w-full flex flex-col items-start justify-start gap-1 px-2">
                {
                    collections.map((collection) => {
                        return <div className="px-2 py-2 bg-slate-800 text-slate-200 rounded-md" key={collection.title}>
                            <p className="text-sm">{collection.title}</p>
                            <p className="text-xs opacity-75">
                                {collection.description}
                            </p>
                        </div>
                    })
                }
            </div>
        </div>
        <div className="w-full flex flex-row items-center justify-center gap-2">
            <hr className="grow h-0.5 bg-slate-700" /><span>OR</span><hr className="grow h-0.5 bg-slate-700" />
        </div>
        <button>
            Create a new collection
        </button>
        <button>
            Append now !
        </button>
    </div>
}