import Header from "./Header";
import Footer from "./Footer";

export default function Layout({
  children,
  showFooter = true,
  className = "",
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 pt-16 md:pt-20 ${className}`}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
