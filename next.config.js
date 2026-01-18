/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress output in Bun environment
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Silence build output
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
