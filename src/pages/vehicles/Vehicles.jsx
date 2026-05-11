import CategoryPage from "../../components/CategoryPage";
const subs = [
  { label: "Cars", path: "/vehicles/cars" },
  { label: "Van", path: "/vehicles/van" },
  { label: "Caravan", path: "/vehicles/caravan" },
  { label: "Motorbikes", path: "/vehicles/motorbikes" },
  { label: "Scooters", path: "/vehicles/scooters" },
  { label: "E-Bikes", path: "/vehicles/e-bikes" },
];
export default function Vehicles() {
  return <CategoryPage category="Vehicles" title="Vehicles" description="Cars, vans, bikes and more from local hosts." subcategories={subs} />;
}
