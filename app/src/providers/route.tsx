"use client";
import { PropsWithChildren, useEffect } from "react";

export function RouteTransitionProvider(props: PropsWithChildren<{}>) {

    useEffect(() => {
        window.addEventListener('pagereveal', (ev) => {
            console.log("page reveal");
        });
        
    }, []);


    return <>
        {props.children}
    </>

}