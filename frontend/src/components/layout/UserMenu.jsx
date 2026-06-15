import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-base font-semibold text-sm cursor-pointer transition-transform active:scale-95"
      >
        {getInitials(user.name)}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-xl bg-bg-surface border border-border-subtle p-3 shadow-xl">
          <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
          <p className="text-xs text-text-secondary truncate mb-3">{user.email}</p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
