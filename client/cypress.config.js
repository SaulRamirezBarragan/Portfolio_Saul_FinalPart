import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/",
    video: true,
    screenshotOnRunFailure: true,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});

/*import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
*/
