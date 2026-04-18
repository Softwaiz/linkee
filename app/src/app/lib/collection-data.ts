import { Group } from "@/validations/collection/create"

export function getAllOrigins(nodes: Group[]): string[] {
    const origins = new Set<string>()
    nodes.forEach((node) =>
        node.items.forEach((item) => {
            if (item.type === "link") {
                try {
                    let url = new URL(item.url)
                    origins.add(url.origin)
                } catch (error) {

                }
            }
        })
    )
    return Array.from(origins)
}
