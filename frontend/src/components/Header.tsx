import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu";

const Header: Component = () => {
  const { isAuthenticated, user } = useAuth();

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

            <Show when={isAuthenticated() && user()?.userType === "PATIENT"}>
              <A
                href="/blogs"
                class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                activeClass="text-blue-600"
              >
                Blogs
              </A>
              <A
                href="/therapists"
                class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                activeClass="text-blue-600"
              >
                Therapists
              </A>
              <A
                href="/diary"
                class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                activeClass="text-blue-600"
              >
                Diary
              </A>
            </Show>

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
              <UserMenu />
            </Show>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
