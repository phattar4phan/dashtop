import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import DashboardPreview from "../components/DashboardPreview";
import SupportedMetrics from "../components/SupportedMetrics";
import Download from "../components/Download";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-dt-bg text-dt-text font-sans">
      <Navbar />
      <main className="[&>*]:border-t [&>*]:border-dt-border/30 [&>*:first-child]:border-t-0">
        <Hero />
        <DashboardPreview />
        <SupportedMetrics />
        <Download />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
