import LoginComponent from "apps/web/components/auth/login.component";

export default function AuthPage() {
    const callbackUrl = process.env.EMAIL_VERIFICATION_CALLBACK_URL;
    if(!callbackUrl){
        throw new Error("EMAIL_VERIFICATION_CALLBACK_URL is not set");
    }
    return <LoginComponent callbackUrl={callbackUrl} />
}
