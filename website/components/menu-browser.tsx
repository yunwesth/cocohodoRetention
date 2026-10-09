'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import menu from '../content/menu.json';
import { FoodPhoto } from './site';

export function MenuBrowser() {
  const [query, setQuery] = useState('');
  const filtered = menu.categories.map((category) => ({ ...category, items: category.items.filter((item) => `${category.name} ${item.name} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase())) })).filter((category) => category.items.length > 0);
  return <><div className="menu-tools"><nav className="category-links" aria-label="Menu categories">{menu.categories.map((category) => <a key={category.id} href={`#${category.id}`}>{category.shortName}</a>)}</nav><div className="search-box"><Search size={18} /><label className="sr-only" htmlFor="menu-search">Search the menu</label><input id="menu-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a little favorite…" />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={17} /></button>}</div></div><p className="result-count" role="status">{query ? `${filtered.reduce((total, category) => total + category.items.length, 0)} matching menu items` : 'A little something for every kind of craving.'}</p>{filtered.length === 0 && <div className="empty-state"><h2>No treats found just yet.</h2><p>Try “latte,” “taiyaki,” or “mango.”</p><button className="button" onClick={() => setQuery('')}>Show the full menu</button></div>}{filtered.map((category) => <section className="menu-category" id={category.id} key={category.id}><div className="menu-category-intro"><FoodPhoto name={category.photo} alt={category.name} /><span className="eyebrow">{category.koreanName || 'A LITTLE EVERYDAY JOY'}</span><h2>{category.name}</h2><p>{category.description}</p></div><div className="menu-items">{category.items.map((item) => <article className="menu-item" key={item.name}><h3>{item.name}</h3><p>{item.description}</p></article>)}</div></section>)}</>;
}
