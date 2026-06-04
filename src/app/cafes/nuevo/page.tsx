import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddCafeForm from "@/components/cafes/AddCafeForm";

export const dynamic = "force-dynamic";

export default function NewCafePage() {
  return (
    <>
      <Navbar />
      <main className="cafes-x">
        <AddCafeForm />
      </main>
      <Footer />
    </>
  );
}
