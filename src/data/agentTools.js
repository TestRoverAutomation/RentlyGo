import { listings as mockListings } from "./mockListings.js";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

// Initialise Firebase (only once — guard against hot-reload double init)
const firebaseConfig = {
  apiKey: "AIzaSyByh0NrF4LS04VUkazAyhU-mHqyz0_XaZ0",
  authDomain: "rentlygo-5d18a.firebaseapp.com",
  projectId: "rentlygo-5d18a",
  storageBucket: "rentlygo-5d18a.appspot.com",
  messagingSenderId: "534071853565",
  appId: "1:534071853565:web:c300e4a1c66d3d5082d994",
};

const fbApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

async function fetchFirestoreListings() {
  try {
    const q = query(
      collection(db, "listings"),
      where("active", "==", true),
      orderBy("createdAt", "desc"),
      limit(200)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      name: d.data().title,
      category: d.data().category,
      subcategory: d.data().subcategory,
      price: d.data().price,
      location: d.data().location,
      host: d.data().hostName,
      hostRating: d.data().hostRating,
      reviews: d.data().reviews,
      emoji: d.data().emoji,
      description: d.data().description,
      tags: d.data().tags || [],
    }));
  } catch {
    return [];
  }
}

function scoreListings(items, { keywords, category, location, max_price_per_day }) {
  const kw = (keywords || "").toLowerCase();
  const words = kw.split(/\s+/).filter(Boolean);

  return items
    .map((item) => {
      let score = 0;
      words.forEach((word) => {
        if ((item.name || "").toLowerCase().includes(word)) score += 3;
        if ((item.tags || []).some((t) => t.includes(word))) score += 2;
        if ((item.description || "").toLowerCase().includes(word)) score += 1;
        if ((item.subcategory || "").toLowerCase().includes(word)) score += 2;
      });
      if (item.tags?.some((t) => t === kw)) score += 5;
      if (category && (item.category || "").toLowerCase() !== category.toLowerCase()) score = -1;
      if (location) {
        const loc = location.toLowerCase();
        if ((item.location || "").toLowerCase().includes(loc)) score += 4;
      }
      if (max_price_per_day && item.price > max_price_per_day) score = -1;
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
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
}

export async function searchRentals(input) {
  const firestoreItems = await fetchFirestoreListings();
  // Normalize mock listings to agent shape (title → name, hostName → host)
  const normalizedMock = mockListings.map((l) => ({ ...l, name: l.title, host: l.hostName }));
  const pool = firestoreItems.length > 0 ? firestoreItems : normalizedMock;
  const scored = scoreListings(pool, input);
  return { count: scored.length, listings: scored, source: firestoreItems.length > 0 ? "live" : "demo" };
}

export function checkAvailability({ listing_ids, start_date, end_date }) {
  const availability = {};
  (listing_ids || []).forEach((id) => {
    availability[id] = { available: true, start_date, end_date };
  });
  return { availability, all_available: true };
}

export async function buildRentalPlan({ listing_ids, start_date, end_date, mission_title, notes }) {
  const firestoreItems = await fetchFirestoreListings();
  const normalizedMock = mockListings.map((l) => ({ ...l, name: l.title, host: l.hostName }));
  const pool = firestoreItems.length > 0 ? firestoreItems : normalizedMock;

  const planItems = (listing_ids || [])
    .map((id) => pool.find((l) => l.id === id))
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
