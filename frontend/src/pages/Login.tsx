import { Component, createSignal, Show } from "solid-js";
import LoginForm from "../components/LoginForm";
import Register from "../components/Register";

type ViewMode = "login" | "register";

const Login: Component = () => {
  const [viewMode, setViewMode] = createSignal<ViewMode>("login");

  const switchToRegister = () => {
    setViewMode("register");
  };

  const switchToLogin = () => {
    setViewMode("login");
  };

  return (
    <div class="min-h-[calc(100vh-4rem)] flex justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg border border-gray-200 shadow-sm h-fit">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {viewMode() === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            {viewMode() === "login"
              ? "Welcome back to iCare"
              : "Join iCare today"}
          </p>
        </div>

        <Show when={viewMode() === "login"}>
          <LoginForm onSwitchToRegister={switchToRegister} />
        </Show>

        <Show when={viewMode() === "register"}>
          <Register onSwitchToLogin={switchToLogin} />
        </Show>
      </div>
    </div>
  );
};

export default Login;
