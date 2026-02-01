import SigninContent from "./signin-content";
import { RequestInfo } from "rwsdk/worker";

export default function Signin(props: RequestInfo) {
    const url = new URL(props.request.url);
    let redirectTo = decodeURIComponent(url.searchParams.get('redirect') ?? '/home');
    
    return (
        <>
            <title>Sign into your account - Linkee</title>
            <meta name="description" content="Sign into your account and start collecting resources." />
            <SigninContent redirect={redirectTo} />
        </>
    );
};