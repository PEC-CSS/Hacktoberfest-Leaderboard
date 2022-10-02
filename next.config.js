/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env : {
    access_token: process.env.ACCESS_TOKEN,
  }
}

module.exports = nextConfig
