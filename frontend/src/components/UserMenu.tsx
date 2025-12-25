import { useNavigate } from "@solidjs/router";
import { useAuth } from "@/context/AuthContext";
import type { Component } from "solid-js";

const UserMenu: Component = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div class="relative group">
      <div class="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
        <span class="text-gray-500 text-sm">Hello, </span>
        <span class="font-semibold text-gray-900">{user()?.username}</span>
        <span class="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          {user()?.userType}
        </span>
        <svg
          class="w-4 h-4 text-gray-500 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown menu */}
      <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div class="py-1">
          <button
            onClick={handleLogout}
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
