/** @type {import('next').NextConfig} */
const nextConfig = {
  // This will enable the use of WebAssembly
  webpack(config) {
    // Allow WebAssembly files to be processed
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    // Make sure Node.js built-ins are not included in server components
    if (!config.resolve) {
      config.resolve = {};
    }
    
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    
    // Add the CORS headers required for FFmpeg WASM
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'javascript/auto',
      use: [],
    });
    
    return config;
  },
  
  // Add Cross-Origin headers for FFmpeg WASM
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  
  // Disable server components for specific paths
  experimental: {
    serverComponentsExternalPackages: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
};

module.exports = nextConfig;
