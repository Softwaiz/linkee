"use client";
import { User } from "@db/index";
import { createContext, PropsWithChildren, useContext } from "react";

interface IdentityContext {
    user?: User;
}

const IdentityContext = createContext<IdentityContext>(undefined as any);

export function useIdentity() {
    const value = useContext(IdentityContext);
    if(!value) {
        throw new Error("Identity context can only be used within a IdentityProvider");
    }
    return value;
}

export function IdentityProvider(props: PropsWithChildren<{ user?: User }>) {
    return <IdentityContext.Provider value={{ user: props.user }}>
        {props.children}
    </IdentityContext.Provider>
}