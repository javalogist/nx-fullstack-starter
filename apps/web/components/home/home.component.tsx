'use client';

import { TokenManager } from "@nx-fullstack-starter/frontend/shared";
import { useRouter } from "next/navigation";

const HomeComponent = () => {
    const router = useRouter();
    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => {
                TokenManager.clear().then(() => {
                    router.push('/login');
                });
                router.push('/login');
            }}>Logout</button>
        </div>
    );
};

export default HomeComponent;