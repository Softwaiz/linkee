import { useEffect, useState } from "react";

export function useWindowLocation() {
    const [location, setLocation] = useState<Location>();

    useEffect(() => {
        const handlePopstate = (ev: PopStateEvent) => {
            console.log("popping state !");
            setLocation(window.location);
        }
         const handleHashChange = (ev: HashChangeEvent) => {
            console.log("hash changed state !");
            setLocation(window.location);
        }
        window.addEventListener("popstate", handlePopstate);
        window.addEventListener("hashchange", handleHashChange);
        return () => {
            window.removeEventListener("popstate", handlePopstate);
            window.removeEventListener("hashchange", handleHashChange);
        }
    }, []);

    return location;
}