/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Stops Next from picking up a lockfile in a parent folder as the project root
  outputFileTracingRoot: __dirname,
}
