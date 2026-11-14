import Link from "next/link";

interface MobileMenuProps {
    menuItems: string[];
}

export function MobileMenu({ menuItems }: MobileMenuProps) {
  return (
    <aside className="absolute top-0 left-0 bg-green-primary w-64 h-screen flex flex-col items-center">
      <nav className="flex flex-col gap-2 mt-12">
        {menuItems.map((item, index) => (
          <Link key={index} href="#">
            <a className="px-3 py-1 text-white text-opacity-40 hover:text-opacity-100 transition-all">
              {item}
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
