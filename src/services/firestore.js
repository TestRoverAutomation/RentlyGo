import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, deleteDoc, updateDoc,
  serverTimestamp, limit,
} from "firebase/firestore";
import { db } from "../auth/firebase";
import { listings as mockListings } from "../data/mockListings";

const LISTINGS = "listings";

export async function createListing(data, user) {
  const docRef = await addDoc(collection(db, LISTINGS), {
    ...data,
    userId: user.uid,
    hostName: user.displayName || user.email,
    hostEmail: user.email,
    hostPhoto: user.photoURL || null,
    hostRating: 5.0,
    reviews: 0,
    createdAt: serverTimestamp(),
    active: true,
  });
  return docRef.id;
}

export async function getListingById(id) {
  // Try Firestore first, fall back to mock
  try {
    const snap = await getDoc(doc(db, LISTINGS, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
  } catch {
    // ignore
  }
  return mockListings.find((l) => l.id === id) || null;
}

export async function getListingsByCategory(category, subcategory = null) {
  try {
    let q;
    if (subcategory) {
      q = query(
        collection(db, LISTINGS),
        where("category", "==", category),
        where("subcategory", "==", subcategory),
        limit(100)
      );
    } else {
      q = query(collection(db, LISTINGS), where("category", "==", category), limit(100));
    }
    const snap = await getDocs(q);
    const live = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((d) => d.active !== false)
      .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));

    if (live.length > 0) return live;
  } catch {
    // fall through to mock
  }

  // Fall back to mock listings when Firestore is empty or unavailable
  return mockListings.filter((l) => {
    const catMatch = l.category === category;
    const subMatch = !subcategory || l.subcategory === subcategory;
    return catMatch && subMatch;
  });
}

export async function getUserListings(userId) {
  const q = query(collection(db, LISTINGS), where("userId", "==", userId), limit(100));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function searchListings(searchQuery, location = "") {
  let pool = [];
  try {
    const q = query(collection(db, LISTINGS), limit(200));
    const snap = await getDocs(q);
    pool = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((d) => d.active !== false);
  } catch {
    // ignore
  }

  // Merge with mock listings (mock items have fixed IDs so no duplicates)
  const liveIds = new Set(pool.map((l) => l.id));
  pool = [...pool, ...mockListings.filter((l) => !liveIds.has(l.id))];

  const terms = (searchQuery || "").toLowerCase().split(/\s+/).filter(Boolean);
  const loc = location.toLowerCase();

  return pool.filter((listing) => {
    const hay = `${listing.title} ${listing.description} ${listing.category} ${listing.subcategory} ${listing.tags?.join(" ")}`.toLowerCase();
    const matchesQuery = !terms.length || terms.every((t) => hay.includes(t));
    const matchesLocation = !loc || listing.location?.toLowerCase().includes(loc);
    return matchesQuery && matchesLocation;
  });
}

export async function deleteListing(id) {
  await deleteDoc(doc(db, LISTINGS, id));
}

export async function toggleListingActive(id, active) {
  await updateDoc(doc(db, LISTINGS, id), { active });
}

export async function getAllListings(count = 100) {
  try {
    const q = query(collection(db, LISTINGS), limit(count));
    const snap = await getDocs(q);
    const live = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((d) => d.active !== false);
    if (live.length > 0) return live;
  } catch {
    // fall through
  }
  return mockListings.slice(0, count);
}
