import CategoryPage from "../../components/CategoryPage";
const subs = [
  { label: "Residential Rentals", path: "/properties/residential-rentals" },
  { label: "Commercial Rentals", path: "/properties/commercial-rentals" },
];
export default function Properties() {
  return <CategoryPage category="Properties" title="Properties" description="Find residential and commercial spaces to rent." subcategories={subs} />;
}
