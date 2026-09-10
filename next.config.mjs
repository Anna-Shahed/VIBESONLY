const repo = process.env.GITHUB_REPOSITORY?.split("/")[1]; 

const nextConfig = {
  reactStrictMode: true,
  output: "export",                 
  images: { unoptimized: true },
  trailingSlash: true,
  ...(repo && !process.env.CUSTOM_DOMAIN ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` } : {})
};

export default nextConfig;
