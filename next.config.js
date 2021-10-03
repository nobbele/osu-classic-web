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
