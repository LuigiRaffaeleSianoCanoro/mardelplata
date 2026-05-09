import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BolsaClient from "@/components/bolsa/BolsaClient";

export default function BolsaPage() {
  return (
    <>
      <Navbar />
      <main className="bolsa-x">
        <BolsaClient />
      </main>
      <Footer />
    </>
  );
}
