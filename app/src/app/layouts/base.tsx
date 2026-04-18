import { WrappedToaster } from "@/toaster";
import { LayoutProps } from "rwsdk/router";

export default function BaseLayout(props: LayoutProps) {
    return <>
        {props.children}
        <WrappedToaster />
    </>;
}