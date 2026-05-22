import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Crear instancia de axios con configuración base
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request - agrega token JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Solo ejecutar en cliente
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Token expirado o inválido
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            // Redirigir al login si no estamos ya ahí
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
          }
          break;

        case 403:
          console.error("Acceso prohibido - No tienes permisos");
          break;

        case 500:
          console.error("Error del servidor");
          break;

        default:
          console.error(`Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      console.error("No se pudo conectar con el servidor");
    } else {
      console.error("Error en la configuración de la petición", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
