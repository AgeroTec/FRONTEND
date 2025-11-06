// hooks/useAuth.ts
export const useAuth = () => {
    const isAuthenticated = () => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem("accessToken") !== null;
    };

    const getToken = () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem("accessToken");
    };

    const logout = () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenType");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("auth-storage");
    };

    return { isAuthenticated, getToken, logout };
};