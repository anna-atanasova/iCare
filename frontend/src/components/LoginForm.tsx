import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: Component<LoginFormProps> = (props) => {
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginUsername, setLoginUsername] = createSignal("");
  const [loginPassword, setLoginPassword] = createSignal("");

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({
        username: loginUsername().trim(),
        password: loginPassword(),
      });

      login(response);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error has occurred while logging in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form class="mt-8 space-y-6" onSubmit={handleLogin}>
      {error() && (
        <div class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">{error()}</div>
        </div>
      )}

      <div class="rounded-md space-y-4">
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Enter your username"
            value={loginUsername()}
            onInput={(e) => setLoginUsername(e.currentTarget.value)}
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Enter your password"
            value={loginPassword()}
            onInput={(e) => setLoginPassword(e.currentTarget.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading()}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading() ? "Signing in..." : "Sign in"}
        </button>
      </div>

      <div class="text-center text-sm">
        <span class="text-gray-600">Don't have an account? </span>
        <button
          type="button"
          onClick={props.onSwitchToRegister}
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
