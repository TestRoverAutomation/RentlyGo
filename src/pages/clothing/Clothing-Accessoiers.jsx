import CategoryPage from "../../components/CategoryPage";
const subs = [
  { label: "Mens Wear", path: "/clothing-accessories/mens-wear" },
  { label: "Womens Wear", path: "/clothing-accessories/womens-wear" },
  { label: "Kids Wear", path: "/clothing-accessories/kids-wear" },
  { label: "Shoes", path: "/clothing-accessories/shoes" },
  { label: "Bags", path: "/clothing-accessories/bags" },
  { label: "Party Costumes", path: "/clothing-accessories/party-costumes" },
  { label: "Accessories", path: "/clothing-accessories/accessories" },
];
export default function Clothing() {
  return <CategoryPage category="Clothing & Accessories" title="Clothing & Accessories" description="Fashion and accessories for every occasion." subcategories={subs} />;
}
