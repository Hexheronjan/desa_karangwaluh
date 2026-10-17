import { MetadataRoute } from "next";
import { villageConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin-demo/"],
    },
    sitemap: `${villageConfig.contact.website}/sitemap.xml`,
  };
}
