const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "uhdtv.io",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "mango.blender.org",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "download.blender.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
