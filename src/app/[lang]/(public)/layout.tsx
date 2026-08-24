import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* The navbar is a fixed island and takes no space of its own, so the
          page clears it here. Sections that should bleed underneath it (the
          landing hero) cancel this with a matching negative margin. */}
      <main className="flex-1 pt-(--navbar-height)">{children}</main>
      <Footer />
    </div>
  );
}
