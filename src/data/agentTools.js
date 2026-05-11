import { listings } from "./mockListings.js";

export function searchRentals({ keywords, category, location, max_price_per_day }) {
  const kw = (keywords || "").toLowerCase();
  const words = kw.split(/\s+/).filter(Boolean);

  const scored = listings
    .map((item) => {
      let score = 0;

      // keyword matches
      words.forEach((word) => {
        if (item.name.toLowerCase().includes(word)) score += 3;
        if (item.tags.some((t) => t.includes(word))) score += 2;
        if (item.description.toLowerCase().includes(word)) score += 1;
      });

      // exact tag phrase match
      if (item.tags.some((t) => t === kw)) score += 5;

      // category filter
      if (category && item.category !== category) score = -1;

      // location filter (soft — boost same city, don't exclude)
      if (location) {
        const loc = location.toLowerCase();
        if (item.location.toLowerCase().includes(loc)) score += 4;
      }

      // price filter
      if (max_price_per_day && item.price > max_price_per_day) score = -1;

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ item }) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      location: item.location,
      host: item.host,
      hostRating: item.hostRating,
      reviews: item.reviews,
      emoji: item.emoji,
      description: item.description,
    }));

  return {
    count: scored.length,
    listings: scored,
  };
}

export function checkAvailability({ listing_ids, start_date, end_date }) {
  // In production this would query Firestore. For now all items are available.
  const availability = {};
  (listing_ids || []).forEach((id) => {
    availability[id] = { available: true, start_date, end_date };
  });
  return { availability, all_available: true };
}

export function buildRentalPlan({ listing_ids, start_date, end_date, mission_title, notes }) {
  const planItems = (listing_ids || [])
    .map((id) => listings.find((l) => l.id === id))
    .filter(Boolean);

  const days =
    start_date && end_date
      ? Math.max(1, Math.ceil((new Date(end_date) - new Date(start_date)) / 86400000))
      : 1;

  const totalCost = planItems.reduce((sum, item) => sum + item.price * days, 0);

  return {
    plan: {
      title: mission_title,
      items: planItems.map((item) => ({
        id: item.id,
        name: item.name,
        emoji: item.emoji,
        price: item.price,
        totalForTrip: item.price * days,
        location: item.location,
        host: item.host,
        hostRating: item.hostRating,
        category: item.category,
        description: item.description,
      })),
      dates: { start: start_date, end: end_date, days },
      totalCost,
      notes,
    },
  };
}
