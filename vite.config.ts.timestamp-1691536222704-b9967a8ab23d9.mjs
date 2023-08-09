// vite.config.ts
import { defineConfig } from "file:///C:/Users/DELL/Desktop/tradingio/klinechart-ui/node_modules/vite/dist/node/index.js";
import solidPlugin from "file:///C:/Users/DELL/Desktop/tradingio/klinechart-ui/node_modules/vite-plugin-solid/dist/esm/index.mjs";
var vite_config_default = defineConfig({
  plugins: [solidPlugin()],
  build: {
    cssTarget: "chrome61",
    sourcemap: true,
    rollupOptions: {
      external: ["klinecharts"],
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "style.css") {
            return "klinecharts-ui.css";
          }
        },
        globals: {
          klinecharts: "klinecharts"
        }
      }
    },
    lib: {
      entry: "./src/index.ts",
      name: "klinechartsui",
      fileName: (format) => {
        if (format === "es") {
          return "klinecharts-ui.js";
        }
        if (format === "umd") {
          return "klinecharts-ui.umd.js";
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxERUxMXFxcXERlc2t0b3BcXFxcdHJhZGluZ2lvXFxcXGtsaW5lY2hhcnQtdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXERFTExcXFxcRGVza3RvcFxcXFx0cmFkaW5naW9cXFxca2xpbmVjaGFydC11aVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvREVMTC9EZXNrdG9wL3RyYWRpbmdpby9rbGluZWNoYXJ0LXVpL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlL2NsaWVudFwiIC8+XHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgc29saWRQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tc29saWQnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtzb2xpZFBsdWdpbigpXSxcclxuICBidWlsZDoge1xyXG4gICAgY3NzVGFyZ2V0OiAnY2hyb21lNjEnLFxyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogWydrbGluZWNoYXJ0cyddLFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogKGNodW5rSW5mbykgPT4ge1xyXG4gICAgICAgICAgaWYgKGNodW5rSW5mby5uYW1lID09PSAnc3R5bGUuY3NzJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2tsaW5lY2hhcnRzLXVpLmNzcydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIGtsaW5lY2hhcnRzOiAna2xpbmVjaGFydHMnXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6ICcuL3NyYy9pbmRleC50cycsXHJcbiAgICAgIG5hbWU6ICdrbGluZWNoYXJ0c3VpJyxcclxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IHtcclxuICAgICAgICBpZiAoZm9ybWF0ID09PSAnZXMnKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ2tsaW5lY2hhcnRzLXVpLmpzJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZm9ybWF0ID09PSAndW1kJykge1xyXG4gICAgICAgICAgcmV0dXJuICdrbGluZWNoYXJ0cy11aS51bWQuanMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxpQkFBaUI7QUFFeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLFlBQVksQ0FBQztBQUFBLEVBQ3ZCLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxhQUFhO0FBQUEsTUFDeEIsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCLENBQUMsY0FBYztBQUM3QixjQUFJLFVBQVUsU0FBUyxhQUFhO0FBQ2xDLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFNBQVM7QUFBQSxVQUNQLGFBQWE7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFVBQVUsQ0FBQyxXQUFXO0FBQ3BCLFlBQUksV0FBVyxNQUFNO0FBQ25CLGlCQUFPO0FBQUEsUUFDVDtBQUNBLFlBQUksV0FBVyxPQUFPO0FBQ3BCLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
