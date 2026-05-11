import CategoryPage from "../../components/CategoryPage";
const subs = [
  { label: "Cameras", path: "/electronics-gadgets/cameras" },
  { label: "Camcorders", path: "/electronics-gadgets/camcorders" },
  { label: "Studio Equipments", path: "/electronics-gadgets/studio-equipments" },
  { label: "Sound System", path: "/electronics-gadgets/sound-system" },
  { label: "Party Lightings", path: "/electronics-gadgets/party-lightings" },
  { label: "Instruments", path: "/electronics-gadgets/instruments" },
  { label: "Game Consoles", path: "/electronics-gadgets/game-consoles" },
  { label: "Projectors", path: "/electronics-gadgets/projectors" },
  { label: "Laptops", path: "/electronics-gadgets/laptops" },
  { label: "Mobile & Tab", path: "/electronics-gadgets/mobile-&-tab" },
];
export default function Electronics() {
  return <CategoryPage category="Electronics & Gadgets" title="Electronics & Gadgets" description="Tech and professional gear for shoots, events and projects." subcategories={subs} />;
}
