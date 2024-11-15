const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const path = require('path');
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/web/osu-submit-modular.php",
        destination: "/api/submit",
      },
      {
        source: "/web/osu-osz2-getscores.php",
        destination: "/api/get-scores",
      },
      {
        source: "/web/osu-osz2-bmsubmit-getid.php",
        destination: "/api/beatmap-submit/get-id"
      },
      {
        source: "/web/osu-get-beatmap-topic.php",
        destination: "/api/beatmap-submit/get-beatmap-topic"
      },
      {
        source: "/web/osu-osz2-bmsubmit-post.php",
        destination: "/api/beatmap-submit/post"
      },
      {
        source: "/web/osu-osz2-bmsubmit-upload.php",
        destination: "/api/beatmap-submit/upload"
      },
      {
        source: "/web/osu-rate.php",
        destination: "/api/rate"
      },
      {
        source: "/web/osu-error.php",
        destination: "/api/error",
      },
      {
        source: '/web/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/a/:id',
        destination: "/api/user/:id/avatar"
      },
      {
        source: "/release/update.php",
        destination: "/api/update"
      },
      {
        source: "/p/changelog",
        destination: "/api/changelog"
      },
      {
        source: "/release/update2.txt",
        destination: "/api/update-data"
      },
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/sync'
    });
    config.plugins = (config.plugins || []).concat([
      new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, "./rust/osu-parser-wasm"),
        outDir: path.resolve(__dirname, "./pkg/osu-parser-wasm"),
        args: '--log-level warn'
      }),
      new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, "./rust/osz2-wasm"),
        outDir: path.resolve(__dirname, "./pkg/osz2-wasm"),
        args: '--log-level warn'
      })
    ]);
    config.experiments = {
      syncWebAssembly: true,
    };
    return config;
  },
}
