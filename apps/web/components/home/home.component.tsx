'use client';

import { TokenManager } from "@kodevy-core-2.0/frontend/shared";
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