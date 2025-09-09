import RealEstateDashboard from "./components/RealEstateDashboard";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto px-6 md:px-10 lg:px-12 py-8">
        <RealEstateDashboard />
      </main>
    </div>
  );
}
