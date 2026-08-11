import { createRequire } from "module";

const require = createRequire(import.meta.url);
const nextMajor = Number(require("next/package.json").version.split(".")[0]);

const pdfTracingConfig = {
  "/admin/catalogue.pdf": ["./node_modules/pdfkit/js/data/**/*"]
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ]
  }
};

if (nextMajor >= 15) {
  nextConfig.serverExternalPackages = ["pdfkit"];
  nextConfig.outputFileTracingIncludes = pdfTracingConfig;
} else {
  nextConfig.experimental = {
    serverComponentsExternalPackages: ["pdfkit"],
    outputFileTracingIncludes: pdfTracingConfig
  };
}

export default nextConfig;
