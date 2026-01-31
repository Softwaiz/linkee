import { LayoutProps } from "rwsdk/router";
import publicStyles from "./theme.css?url";

export function PublicLayout(props: LayoutProps) {
    return <>
        <link rel="stylesheet" href={publicStyles} />
        {props.children}
    </>
}