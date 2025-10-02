import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	server: {
		strictPort: true,
		proxy: {
			"/api": {
				target: "http://localhost:5034",
				changeOrigin: true,
			},
		},
	},
});


