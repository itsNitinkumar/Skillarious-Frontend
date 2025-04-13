/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'your-storage-domain.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',  // For Cloudinary images
      }
    ],
    unoptimized: true // Add this if you want to skip image optimization
  },
};

export default nextConfig;




