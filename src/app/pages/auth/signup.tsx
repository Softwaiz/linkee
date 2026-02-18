import { RequestInfo } from "rwsdk/worker";
import SignupContent from "./signup-content";

export default function SignupPage(props: RequestInfo) {
    return (
        <>
            <title>Create an account - Linkits</title>
            <meta name="description" content="Create an account on Linkits and and start collecting resources" />
            <SignupContent />
        </>
    );
}