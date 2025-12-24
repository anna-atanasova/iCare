export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface UsernameValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateUsername = (
  username: string,
): UsernameValidationResult => {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  if (username.length > 50) {
    errors.push("Username must not exceed 50 characters");
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    errors.push(
      "Username can only contain letters, numbers, dots, hyphens, and underscores",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (
  password: string,
): PasswordValidationResult => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
