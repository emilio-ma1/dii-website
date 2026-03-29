/**
 * @file useUserProfile.js
 * @description
 * Custom hook to fetch and format dynamic user profile data (name, title, avatar).
 * * Responsibilities:
 * - Consumes the optimized '/api/users/me' endpoint.
 * - Automatically resolves the user's role and formats their display title.
 * - Safely maps the avatar to the binary image tunnel.
 * - Uses AbortController to prevent memory leaks on unmount.
 */
import { useState, useEffect } from "react";
import { useAuth } from "../auth/authContext";

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_AVATAR = "/images/default-avatar.png";

export function useUserProfile() {
  const { user } = useAuth();
  const role = user?.role || "alumni"; 

  const [profileData, setProfileData] = useState({
    name: "Cargando...",
    title: "Cargando perfil...",
    avatar: DEFAULT_AVATAR,
  });

  useEffect(() => {
    const abortController = new AbortController();

    const fetchMyProfile = async () => {
      if (!user || !user.id) return;
      const emailName = user.email ? user.email.split('@')[0] : "Usuario";

      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: { "Authorization": `Bearer ${token}` },
          signal: abortController.signal 
        });

        if (response.ok) {
          const data = await response.json();
          let dynamicTitle = "Usuario";
          
          if (data.role === "admin") dynamicTitle = "Administración DII";
          else if (data.role === "teacher") dynamicTitle = data.degree || data.area || "Docente";
          else if (data.role === "alumni") dynamicTitle = data.degree || data.specialty || "Egresado(a)";

          setProfileData({
            name: data.full_name || emailName,
            title: dynamicTitle,
            avatar: `${API_URL}/api/users/${data.id}/image`
          });
        } else {
          setProfileData(prev => ({ 
            ...prev, 
            name: emailName,
            title: role === "admin" ? "Administración DII" : "Perfil Incompleto",
            avatar: DEFAULT_AVATAR
          }));
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("[INFO] Petición de perfil cancelada por desmontaje del componente.");
          return;
        }
        
        console.error("[ERROR] Failed to fetch current user profile:", error);
        setProfileData(prev => ({ 
          ...prev, 
          name: emailName, 
          title: "Sin conexión",
          avatar: DEFAULT_AVATAR 
        }));
      }
    };

    fetchMyProfile();

    return () => {
      abortController.abort();
    };
  }, [user, role]);

  return { profileData, role };
}