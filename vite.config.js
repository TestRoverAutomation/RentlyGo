import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['firebase/app', 'firebase/auth'], // Exclude firebase/app and firebase/auth from the build
    },
  },
});
