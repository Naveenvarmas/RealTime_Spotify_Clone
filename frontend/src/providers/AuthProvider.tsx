import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId,getToken, isLoaded, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const {initSocket,disconnectSocket}=useChatStore();

  useEffect(() => {
    if (!isLoaded) return;

    const initAuth = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken();
          updateApiToken(token);
          if (token) {
            await checkAdminStatus();
            // init socket
            if(userId) initSocket(userId);
          }
        } else {
          updateApiToken(null);
        }
      } catch (error: any) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // clean up
    return ()=> disconnectSocket();

  }, [isLoaded, isSignedIn, getToken, checkAdminStatus,initSocket,disconnectSocket]);

  if (!isLoaded || loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-6 text-emerald-500 animate-spin" />
      </div>
    );

  return <div>{children}</div>;
};

export default AuthProvider;