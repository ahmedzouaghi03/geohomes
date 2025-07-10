"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/actions/authActions";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const showAdminHeader = pathname.startsWith("/admin");
  const notShowHeader = pathname.startsWith("/auth");

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = await getCurrentUser();
        setIsAdmin(!!user?.id);
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (notShowHeader) {
    return null;
  }
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-[#3A5FCD]">
            Sousse Planner
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex ml-10 space-x-6">
            {/* Admin links - only show when admin is logged in */}
            {isAdmin && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="text-gray-700 hover:text-orange-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/house"
                  className="text-gray-700 hover:text-orange-600"
                >
                  Maisons Admin
                </Link>
                <Link
                  href="/admin/house/createHouse"
                  className="text-gray-700 hover:text-orange-600"
                >
                  Create House
                </Link>
                <Link
                  href="/admin/city"
                  className="text-gray-700 hover:text-orange-600"
                >
                  Cities
                </Link>
              </>
            )}

            {/* Public links - only show on non-admin pages */}

            <>
              <Link
                href="/house"
                className="text-gray-700 hover:text-orange-600"
              >
                Maisons
              </Link>
              <Link
                href="/aboutUs"
                className="text-gray-700 hover:text-orange-600"
              >
                A propos
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-orange-600"
              >
                Contact
              </Link>
            </>
          </nav>
        </div>

        {/* Desktop logout button - only show when admin is logged in */}
        {isAdmin && (
          <Link
            href="/auth/login"
            className="hidden md:block bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </Link>
        )}

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center px-2 py-1 border rounded text-gray-700 border-gray-300"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Ouvrir le menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <ul className="flex flex-col px-4 py-2 space-y-2">
            {/* Admin links - only show when admin is logged in */}
            {isAdmin && (
              <>
                <li>
                  <Link
                    href="/admin/dashboard"
                    className="block text-gray-700 hover:text-orange-600 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/house"
                    className="block text-gray-700 hover:text-orange-600 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Maisons Admin
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/house/createHouse"
                    className="block text-gray-700 hover:text-orange-600 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Create House
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/city"
                    className="block text-gray-700 hover:text-orange-600 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Cities
                  </Link>
                </li>
              </>
            )}

            {/* Public links  */}

            <>
              <li>
                <Link
                  href="/house"
                  className="block text-gray-700 hover:text-orange-600 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Maisons
                </Link>
              </li>
              <li>
                <Link
                  href="/aboutUs"
                  className="block text-gray-700 hover:text-orange-600 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  A propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block text-gray-700 hover:text-orange-600 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </>
            {/* Logout button - only show when admin is logged in */}
            {isAdmin && (
              <li>
                <Link
                  href="/auth/login"
                  className="block bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition mx-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
