import CategoryPage from "../../components/CategoryPage";
const subs = [
  { label: "Party Decoration", path: "/outdoor-adventure/party-decoration" },
  { label: "Camping Gear", path: "/outdoor-adventure/camping-gear" },
  { label: "Marquee", path: "/outdoor-adventure/marquee" },
  { label: "Bouncy Castle", path: "/outdoor-adventure/bouncy-castle" },
  { label: "Garden Furniture", path: "/outdoor-adventure/garden-furniture" },
  { label: "Bicycles", path: "/outdoor-adventure/bicycles" },
  { label: "Boats", path: "/outdoor-adventure/boats" },
  { label: "Barbecue Grills", path: "/outdoor-adventure/barbecue-grills" },
];
export default function Outdoor_Advendure() {
  return <CategoryPage category="Outdoor & Adventure" title="Outdoor & Adventure" description="Everything you need to explore the outdoors and host epic events." subcategories={subs} />;
}
