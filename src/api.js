import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://portfoliobackend-git-main-shahriarshishirs-projects.vercel.app";

const defaultHeaders = {};

if (import.meta.env.VITE_VERCEL_BYPASS) {
  // Allows bypassing Vercel protection when a bypass token is set in env
  defaultHeaders["x-vercel-protection-bypass"] =
    import.meta.env.VITE_VERCEL_BYPASS;
}

const api = axios.create({
  baseURL,
  headers: defaultHeaders,
});

export default api;
