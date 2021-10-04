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
}
