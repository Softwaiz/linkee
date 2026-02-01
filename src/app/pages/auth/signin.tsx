import SigninContent from "./signin-content";
import { RequestInfo } from "rwsdk/worker";

export default function Signin(props: RequestInfo) {
    if(props.ctx.user) {
        props.ctx.redirect("/home", 302);
    }
    return (
        <SigninContent/>
    );
};