import { ArrowUpRight, Phone } from 'lucide-react';
import { content, addressLine, hoursLine, closedLine } from '../../lib/content';

export function VisitDetails() {
  return <div className="visit-details"><div><span className="eyebrow">FIND OUR LITTLE CORNER</span><h2>See you in<br /><em>Closter.</em></h2></div><address>{addressLine}</address><div className="hours"><p>{hoursLine}</p><p>{closedLine}</p></div><div className="button-row"><a className="button" href={content.store.directions.href} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={17} /></a><a className="text-link" href={content.store.phone.href}><Phone size={16} />{content.store.phone.value}</a></div><p className="fine">Visiting on a holiday? Give us a call to confirm our hours.</p></div>;
}
