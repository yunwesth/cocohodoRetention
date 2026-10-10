import { HeroSection } from '../features/home/hero';
import { FavoritesSection } from '../features/home/favorites';
import { StorySection } from '../features/home/story';
import { VisitSection } from '../features/home/visit';
import { BrandMark } from '@cocohodo/ui/brand-mark';
import { RewardsSection } from '../features/rewards/rewards-section';
import { address, content } from '../lib/content';
import { pageMetadata } from '../lib/metadata';
import { siteOrigin } from '../config/public';

export const metadata = pageMetadata('Korean pastries & coffee in Closter', 'A little everyday joy. Discover walnut pastries, croissant taiyaki, bubble tea, and coffee at Cocohodo Closter.', '/');
export default function Home() {
  const business = { '@context': 'https://schema.org', '@type': 'CafeOrCoffeeShop', name: content.store.name.value, url: siteOrigin, telephone: '+12017672626', address: { '@type': 'PostalAddress', streetAddress: address.street, addressLocality: address.city, addressRegion: address.region, postalCode: address.postalCode, addressCountry: address.country }, hasMenu: `${siteOrigin}/menu/`, openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: content.store.hours.value.daysOpen, opens: content.store.hours.value.opens, closes: content.store.hours.value.closes }] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, '\\u003c') }} />
    <HeroSection />
    <div className="ribbon" aria-hidden="true"><span>WALNUT PASTRIES</span><BrandMark /><span>CROISSANT TAIYAKI</span><BrandMark /><span>BUBBLE TEA</span><BrandMark /><span>COFFEE & LITTLE MOMENTS</span><BrandMark /></div>
    <FavoritesSection />
    <StorySection />
    <RewardsSection />
    <VisitSection />

  </>;
}
