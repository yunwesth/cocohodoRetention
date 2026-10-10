import Image from 'next/image';

export function FoodPhoto({ name, alt, className = '', priority = false }: { name: string; alt: string; className?: string; priority?: boolean }) {
  return <div className={`food-photo ${className}`}><Image src={`/photos/${name}.webp`} alt={alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 650px" priority={priority} /></div>;
}
