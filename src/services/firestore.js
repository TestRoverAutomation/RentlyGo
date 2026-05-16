import {
  collection, addDoc, getDocs, getDoc, doc,
  query, where, deleteDoc, updateDoc,
  serverTimestamp, limit,
} from "firebase/firestore";
import { db } from "../auth/firebase";

const LISTINGS = "listings";

export async function createListing(data, user) {
  const docRef = await addDoc(collection(db, LISTINGS), {
    ...data,
    photos: data.photos || [],
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
  try {
    const snap = await getDoc(doc(db, LISTINGS, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
  } catch {
    // ignore
  }
  return null;
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
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((d) => d.active !== false)
      .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  } catch {
    return [];
  }
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
    return [];
  }

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
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((d) => d.active !== false);
  } catch {
    return [];
  }
}
