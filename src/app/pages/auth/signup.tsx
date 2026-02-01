import { RequestInfo } from "rwsdk/worker";
import SignupContent from "./signup-content";

export default function SignupPage(props: RequestInfo) {

    if(props.ctx.user) {
        props.ctx.redirect("/home", 302);
    }

    return (
        <SignupContent/>
    );
}