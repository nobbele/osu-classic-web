module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/web/osu-submit-modular.php",
        destination: "/api/submit",
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
    ]
  },
}
