import CategoryPage from "../../components/CategoryPage";
const subs = [
  { label: "Furniture", path: "/home-furniture/furniture" },
  { label: "Kitchen Appliances", path: "/home-furniture/kitchen-appliances" },
];
export default function HomeFurniture() {
  return <CategoryPage category="Home & Furniture" title="Home & Furniture" description="Furniture and appliances for events, staging and short-term needs." subcategories={subs} />;
}
