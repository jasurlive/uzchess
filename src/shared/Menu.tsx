import { useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiWifi,
  FiSettings,
  FiInfo,
} from "react-icons/fi";
import { FaChess, FaChessKing, FaMagnifyingGlassChart } from "react-icons/fa6";
import "../css/menu.css";
import { useTheme } from "../hooks/LOCAL/useTheme";
import { useShortcuts } from "../hooks/LOCAL/useShortcuts";

export type MenuItem = {
  label: string;
  icon: ReactNode;
  href: string;
  mobile?: boolean;
  bottom?: boolean;
};

export default function Menu({
  items = [
    { label: "Home", icon: <FiHome />, href: "/", mobile: true },
    { label: "Chess 1 side", icon: <FaChess />, href: "/chess-1", mobile: true },
    { label: "Analysis", icon: <FaMagnifyingGlassChart />, href: "/chess-analysis", mobile: true },
    { label: "Chess 2 sides", icon: <FaChessKing />, href: "/chess-2", mobile: true },
    { label: "Online", icon: <FiWifi />, href: "/chess-online" },
    // bottom: pinned to the bottom of the sidebar on desktop, keep these last
    { label: "Settings", icon: <FiSettings />, href: "/settings", mobile: true, bottom: true },
    { label: "Info", icon: <FiInfo />, href: "/info", bottom: true },
  ],
}: {
  items?: MenuItem[];
}) {
  const { toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("menu-collapsed") !== "false"
  );

  const toggleMenu = () => {
    setCollapsed((value) => {
      localStorage.setItem("menu-collapsed", String(!value));
      return !value;
    });
  };

  // global shortcuts, listed on the Info page: keep both in sync
  useShortcuts({ "ctrl+j": toggleTheme, "`": toggleMenu });

  return (
    <nav className={`menu ${collapsed ? "menu-collapsed" : ""}`}>
      <button
        type="button"
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle sidebar (`)"
        title="Toggle sidebar (`)"
      >
        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>

      {items.map((item) => {
        const className = `menu-item ${
          item.mobile ? "menu-mobile-visible" : "menu-desktop-only"
        } ${item.bottom ? "menu-bottom" : ""}`;

        return (
          // NavLink adds .active on the current page; `end` so "/" isn't active everywhere
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={className}
            title={item.label}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
