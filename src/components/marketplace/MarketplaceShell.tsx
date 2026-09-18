import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MarketplaceShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="marketplace-x">{children}</main>
      <Footer />
    </>
  );
}
