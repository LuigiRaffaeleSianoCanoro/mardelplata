import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BolsaClient from "@/components/bolsa/BolsaClient";

export default function BolsaPage() {
  return (
    <>
      <Navbar />
      <main className="ocean-tint min-h-screen pt-20 pb-12">
        <BolsaClient />
      </main>
      <Footer />
    </>
  );
}
