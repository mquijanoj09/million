import Header from "../components/Header";
import PropertyList from "../components/PropertyList";

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <PropertyList />
      </main>
    </div>
  );
}
