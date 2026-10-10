import { Sparkles } from 'lucide-react';
import { BrandMark } from '@cocohodo/ui/brand-mark';
import { VisitDetails } from '../visit/visit-details';

export function VisitSection() {
  return <section className="visit-section container"><VisitDetails /><div className="visit-art"><Sparkles size={35} /><span>Coffee in hand.<br /><em>Closter at heart.</em></span><div className="visit-art-bottom"><BrandMark /><p>Your next little moment<br />is just around the corner.</p></div></div></section>;
}
