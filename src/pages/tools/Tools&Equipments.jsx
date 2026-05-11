import CategoryPage from "../../components/CategoryPage";
const subs = [
  { label: "Power Tools", path: "/tools-equipments/power-tools" },
  { label: "Builder Tools", path: "/tools-equipments/builder-tools" },
  { label: "Garden Tools", path: "/tools-equipments/garden-tools" },
];
export default function Tools_Equipments() {
  return <CategoryPage category="Tools & Equipment" title="Tools & Equipment" description="DIY, professional and garden tools from local hosts." subcategories={subs} />;
}
