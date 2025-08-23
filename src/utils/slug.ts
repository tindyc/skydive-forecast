// src/utils/slug.ts
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")     // spaces → dashes
    .replace(/[^a-z0-9-]/g, ""); // remove special chars
}

export function deslugify(slug: string, originalList: string[]): string {
  // Try to find original dropzone by slug
  const match = originalList.find((dz) => slugify(dz) === slug);
  return match || slug; // fallback to slug if not found
}
