/**
 * @file useUserProfile.js
 * @description
 * Custom hook to fetch and format dynamic user profile data (name, title, avatar).
 * Consumes the optimized '/api/users/me' endpoint from the backend.
 * * @features
 * - Automatically resolves the user's role and fetches their specific extended profile.
 * - Implements AbortController to safely cancel pending HTTP requests if the 
 * component unmounts, preventing memory leaks and React state errors.
 */
import { useState, useEffect } from "react";
import { useAuth } from "../auth/authContext";

export function useUserProfile() {
  const { user } = useAuth();
  const role = user?.role || "alumni"; 

  const [profileData, setProfileData] = useState({
    name: "Cargando...",
    title: "Cargando perfil...",
    avatar: "/images/foto-docente.png",
  });

  useEffect(() => {
    const abortController = new AbortController();

    const fetchMyProfile = async () => {
      if (!user || !user.id) return;
      const emailName = user.email ? user.email.split('@')[0] : "Usuario";

      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
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
            avatar: data.image_url || "/images/foto-docente.png"
          });
        } else {
          setProfileData(prev => ({ 
            ...prev, 
            name: emailName,
            title: role === "admin" ? "Administración DII" : "Perfil Incompleto"
          }));
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Petición de perfil cancelada por desmontaje del componente.");
          return;
        }
        
        console.error("[ERROR] Failed to fetch current user profile:", error);
        setProfileData(prev => ({ ...prev, name: emailName, title: "Sin conexión" }));
      }
    };

    fetchMyProfile();

    return () => {
      abortController.abort();
    };
  }, [user, role]);

  return { profileData, role };
}