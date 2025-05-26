import LoginComponent from "apps/web/components/auth/login.component";
import { apiClient } from "apps/web/api-client/api-client";

async function checkHealth() {
    try {
        const res = await apiClient.get('health');
    } catch (e) {
        throw e;
    }
}

export default function AuthPage() {
   // const isHealth = checkHealth();
    return <LoginComponent />
}
