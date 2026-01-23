import { LayoutProps } from "rwsdk/router";

export default function ProtectedLayout(props: LayoutProps) {
    return <>
        {props.children}
    </>
}