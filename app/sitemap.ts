import { MetadataRoute } from "next";
import { villageConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = villageConfig.contact.website;
  const now = new Date("2026-10-17T00:00:00.000Z");

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/layanan-mandiri`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/surat`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pengaduan`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lacak`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/notifikasi`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];
}
