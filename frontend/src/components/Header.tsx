import { Component, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";

const Header: Component = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header class="bg-white shadow-sm border-b border-gray-200">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600">iCare</h1>
          </div>

          <div class="flex items-center gap-6">
            <A
              href="/"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              activeClass="text-blue-600"
            >
              Home
            </A>

            <Show
              when={isAuthenticated()}
              fallback={
                <A
                  href="/login"
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  activeClass="text-blue-600"
                >
                  Login
                </A>
              }
            >
              <div class="flex items-center gap-4">
                <div class="text-sm">
                  <span class="text-gray-500">Hello, </span>
                  <span class="font-semibold text-gray-900">
                    {user()?.username}
                  </span>
                  <span class="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {user()?.userType}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </Show>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
