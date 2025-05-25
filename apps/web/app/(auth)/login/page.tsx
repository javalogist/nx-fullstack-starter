import { apiServer } from "@kodevy-core-2.0/frontend/server";
import LoginComponent from "apps/web/components/auth/login.component";

async function checkHealth() {
    try {
        const res = await apiServer.get('health');
    } catch (e) {
        throw e;
    }
}

export default function AuthPage() {
    //const isHealth = checkHealth();
    return <LoginComponent />
}
