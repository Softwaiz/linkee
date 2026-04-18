export function redirect(base: string, to: string) {
    let url = new URL(base);
    url.pathname = to;
    return Response.redirect(url.toString(), 302);
}