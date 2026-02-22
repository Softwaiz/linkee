"use client";
import { User } from "@db/index";
import posthog from "posthog-js";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";

interface IdentityContext {
    user?: User;
}

const IdentityContext = createContext<IdentityContext>(undefined as any);

export function useIdentity() {
    const value = useContext(IdentityContext);
    if (!value) {
        throw new Error("Identity context can only be used within a IdentityProvider");
    }
    return value;
}

export function IdentityProvider(props: PropsWithChildren<{ user?: User }>) {

    useEffect(() => {
        if (props.user && globalThis.window) {
            posthog.identify(props.user?.id, {
                email: props.user?.email,
                name: `${props.user?.firstName} ${props.user?.lastName}`,
            });
        }
    }, [props.user]);

    return <IdentityContext.Provider value={{ user: props.user }}>
        {props.children}
    </IdentityContext.Provider>
}