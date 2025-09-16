interface Env {
  VITE_API_BASE_URL: string;
  VITE_STRIPE_CLIENT_ID: string;
  VITE_GOOGLE_CLIENT_ID: string;
}

interface Window {
  env: Env;
}