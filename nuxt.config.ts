// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss() as any],
	},

	modules: ["@pinia/nuxt", "@vueuse/nuxt"],


	runtimeConfig: {
		mongoUri: "",
		jwtSecret: "",
		resendApiKey: "",
		stripeSecretKey: "",
		public: {
			appName: "Booking App",
		},
	},
});
