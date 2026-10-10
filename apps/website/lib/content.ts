import content from '../content/store.json';
export { content };

export const address = content.store.address.value;
export const addressLine = `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`;
const hours = content.store.hours.value;
function clock(value: string) {
  const [h, m] = value.split(':').map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h >= 12 ? 'PM' : 'AM'}`;
}
export const hoursLine = `${hours.daysOpen[0]}–${hours.daysOpen.at(-1)} · ${clock(hours.opens)}–${clock(hours.closes)}`;
export const closedLine = `${hours.daysClosed.join(', ')} · Closed`;
export const activeProviders = content.ordering.providers.filter((provider) => provider.enabledForProduction && !content.ordering.excludedProviderIds.includes(provider.id));
