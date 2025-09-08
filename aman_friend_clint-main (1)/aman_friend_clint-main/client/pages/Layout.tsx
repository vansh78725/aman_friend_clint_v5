import { Outlet, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";

export default function Layout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col page-root">
      {/* Background slideshow behind all content */}
      <BackgroundSlideshow />

      <header className="sticky top-0 z-40">
        <div className="brand-gradient backdrop-blur-xl border-b border-white/10">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 font-extrabold tracking-tight text-white"
                aria-label="Open Admin"
              >
                <span className="inline-block h-8 w-8 rounded-lg overflow-hidden shadow-glass">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2Fe71dc3956c1e4ca595583abc24605828?format=webp&width=128"
                    alt="logo"
                    className="h-full w-full object-cover"
                  />
                </span>
                <p className="text-lg">zenzeff</p>
              </button>
            </div>

            <nav className="hidden">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn("text-white/80 hover:text-white", isActive && "text-white")
                }
              >
                Home
              </NavLink>
            </nav>

            <div />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16">
        <div className="container py-8 text-center text-sm text-white/60">
          © {new Date().getFullYear()} RavenVault. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
