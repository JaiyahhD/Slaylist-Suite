import Link from "next/link";
import { mainNavigation } from "@/config/navigation";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <span className="brand-main">
            SLAYLIST
          </span>

          <span className="brand-script">
            Suite
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label="Open navigation"
        >
          ☰
        </button>
      </div>
    </header>
  );
}