const manifestJSON = {
  short_name: "scinapse",
  name: "scinapse",
  background_color: "#6096ff",
  theme_color: "#3e7fff",
  display: "standalone",
  orientation: "portrait",
  icons: [
    {
      src: "https://assets.pluto.network/scinapse/app_icon/launcher-icon-1x.png",
      type: "image/png",
      sizes: "48x48",
    },
    {
      src: "https://assets.pluto.network/scinapse/app_icon/launcher-icon-2x.png",
      type: "image/png",
      sizes: "96x96",
    },
    {
      src: "https://assets.pluto.network/scinapse/app_icon/launcher-icon-4x.png",
      type: "image/png",
      sizes: "192x192",
    },
  ],
  start_url: "index.html?app_launcher=true&utm_source=pwa_app",
};

export default manifestJSON;
