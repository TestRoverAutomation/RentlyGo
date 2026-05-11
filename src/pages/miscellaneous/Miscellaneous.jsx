import CategoryPage from "../../components/CategoryPage";
const subs = [
  { label: "Events", path: "/miscellaneous/events" },
  { label: "Community", path: "/miscellaneous/community" },
  { label: "Services", path: "/miscellaneous/services" },
  { label: "Jobs", path: "/miscellaneous/jobs" },
  { label: "Freebies", path: "/miscellaneous/freebies" },
];
export default function Miscelleneous() {
  return <CategoryPage category="Miscellaneous" title="Miscellaneous" description="Events, community, services, jobs and freebies." subcategories={subs} />;
}
