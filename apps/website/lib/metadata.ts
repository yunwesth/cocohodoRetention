import type { Metadata } from 'next';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title: `${title} | Cocohodo Closter`, description, url: path, images: [{ url: '/photos/korean-walnut-pastry.webp', width: 1920, height: 1280, alt: 'Korean walnut pastries' }] } };
}
