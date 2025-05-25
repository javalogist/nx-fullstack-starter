import { jwtDecode } from "jwt-decode";

export const getTokenMaxAge = async (token: string) => {
    const decoded = jwtDecode<{ exp: number }>(token);
    const expiresAt = decoded.exp ? decoded.exp * 1000 : null; // Convert to milliseconds
  
    if (!expiresAt || expiresAt <= Date.now())
      throw new Error('Invalid or expired token');
  
    const remainingDuration = expiresAt - Date.now(); // ✅ Store remaining duration instead
    const maxAge = Math.floor(remainingDuration / 1000); // Convert to seconds
    return maxAge;
  };