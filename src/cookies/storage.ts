import * as cookie from "cookie";

export function cookieStorage(name: string) {
    return {
        get(requestHeaders: Headers) {
            let value = cookie.parse(requestHeaders.get('cookie') || '')[name];
            return value;
        },
        set(value: any, options: cookie.SerializeOptions) {
            return cookie.serialize(name, value, options);
        }
    }
}