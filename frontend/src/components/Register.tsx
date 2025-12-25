import { type Component, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@/context/AuthContext";
import { validatePassword, validateUsername } from "@/utils/userValidators";
import {
  authApi,
  type RegisterPatientRequest,
  type RegisterTherapistRequest,
} from "@/api/auth";

type UserType = "patient" | "therapist";

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: Component<RegisterProps> = (props) => {
  const [userType, setUserType] = createSignal<UserType>("patient");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [regUsername, setRegUsername] = createSignal("");
  const [regPassword, setRegPassword] = createSignal("");
  const [regConfirmPassword, setRegConfirmPassword] = createSignal("");
  const [regName, setRegName] = createSignal("");
  const [regSurname, setRegSurname] = createSignal("");
  const [regEmail, setRegEmail] = createSignal("");

  const [regOfficeLocation, setRegOfficeLocation] = createSignal("");
  const [regDegree, setRegDegree] = createSignal("");
  const [regYearsExp, setRegYearsExp] = createSignal("");
  const [regPhoneNumber, setRegPhoneNumber] = createSignal("");

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = regUsername().trim();
    const trimmedEmail = regEmail().trim();
    const trimmedName = regName().trim();
    const trimmedSurname = regSurname().trim();

    const usernameValidation = validateUsername(trimmedUsername);
    if (!usernameValidation.isValid) {
      setError(usernameValidation.errors.join("\n"));
      return;
    }

    if (regPassword() !== regConfirmPassword()) {
      setError("Passwords do not match");
      return;
    }

    const passwordValidation = validatePassword(regPassword());
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join("\n"));
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (userType() === "patient") {
        const data: RegisterPatientRequest = {
          username: trimmedUsername,
          password: regPassword(),
          name: trimmedName,
          surname: trimmedSurname,
          email: trimmedEmail,
        };
        response = await authApi.registerPatient(data);
      } else {
        const yearsExpNum = Number.parseInt(regYearsExp());
        if (Number.isNaN(yearsExpNum) || yearsExpNum < 0) {
          setError("Please enter a valid number of years of experience");
          setIsLoading(false);
          return;
        }

        const trimmedOfficeLocation = regOfficeLocation().trim();
        const trimmedDegree = regDegree().trim();
        const trimmedPhoneNumber = regPhoneNumber().trim();

        const data: RegisterTherapistRequest = {
          username: trimmedUsername,
          password: regPassword(),
          name: trimmedName,
          surname: trimmedSurname,
          email: trimmedEmail,
          officeLocation: trimmedOfficeLocation,
          degree: trimmedDegree,
          yearsExp: yearsExpNum,
          phoneNumber: trimmedPhoneNumber,
        };
        response = await authApi.registerTherapist(data);
      }

      login(response);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error has occurred during registration. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-6">
      <div class="flex rounded-lg border border-gray-300 p-1 bg-gray-50">
        <button
          type="button"
          onClick={() => setUserType("patient")}
          class={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            userType() === "patient"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Patient
        </button>
        <button
          type="button"
          onClick={() => setUserType("therapist")}
          class={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            userType() === "therapist"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Therapist
        </button>
      </div>

      <form class="space-y-4" onSubmit={handleRegister}>
        {error() && (
          <div class="rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-700 whitespace-pre-line">
              {error()}
            </div>
          </div>
        )}

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="reg-name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              id="reg-name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={regName()}
              onInput={(e) => setRegName(e.currentTarget.value)}
            />
          </div>
          <div>
            <label
              for="reg-surname"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              id="reg-surname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={regSurname()}
              onInput={(e) => setRegSurname(e.currentTarget.value)}
            />
          </div>
        </div>

        <div>
          <label
            for="reg-username"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="reg-username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={regUsername()}
            onInput={(e) => setRegUsername(e.currentTarget.value)}
          />
          <p class="mt-1 text-xs text-gray-600">
            3-50 characters. Letters, numbers, dots, hyphens, and underscores
            only.
          </p>
        </div>

        <div>
          <label
            for="reg-email"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={regEmail()}
            onInput={(e) => setRegEmail(e.currentTarget.value)}
          />
        </div>

        <div>
          <label
            for="reg-password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your password"
            value={regPassword()}
            onInput={(e) => setRegPassword(e.currentTarget.value)}
          />
          <div class="mt-2 text-xs text-gray-600 space-y-1">
            <p class="font-medium">Password must contain:</p>
            <ul class="list-disc list-inside space-y-0.5 ml-1">
              <li>At least 8 characters (max 128)</li>
              <li>One uppercase letter (A-Z)</li>
              <li>One lowercase letter (a-z)</li>
              <li>One number (0-9)</li>
              <li>One special character (!@#$%^&*...)</li>
            </ul>
          </div>
        </div>

        <div>
          <label
            for="reg-confirm-password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="reg-confirm-password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={regConfirmPassword()}
            onInput={(e) => setRegConfirmPassword(e.currentTarget.value)}
          />
        </div>

        <Show when={userType() === "therapist"}>
          <div class="border-t border-gray-200 pt-4 space-y-4">
            <h3 class="text-sm font-semibold text-gray-900">
              Professional Information
            </h3>

            <div>
              <label
                for="reg-degree"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Degree / Qualification
              </label>
              <input
                id="reg-degree"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., PhD in Clinical Psychology"
                value={regDegree()}
                onInput={(e) => setRegDegree(e.currentTarget.value)}
              />
            </div>

            <div>
              <label
                for="reg-years-exp"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Years of Experience
              </label>
              <input
                id="reg-years-exp"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={regYearsExp()}
                onInput={(e) => setRegYearsExp(e.currentTarget.value)}
              />
            </div>

            <div>
              <label
                for="reg-office"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Office Location
              </label>
              <input
                id="reg-office"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 123 Main St, City"
                value={regOfficeLocation()}
                onInput={(e) => setRegOfficeLocation(e.currentTarget.value)}
              />
            </div>

            <div>
              <label
                for="reg-phone"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="reg-phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+1 (555) 123-4567"
                value={regPhoneNumber()}
                onInput={(e) => setRegPhoneNumber(e.currentTarget.value)}
              />
            </div>
          </div>
        </Show>

        <div>
          <button
            type="submit"
            disabled={isLoading()}
            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading() ? "Creating account..." : "Create account"}
          </button>
        </div>

        <div class="text-center text-sm">
          <span class="text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={props.onSwitchToLogin}
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
