import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

type AuthMode = "signin" | "signup" | "forgot";

// Add password requirements type
type PasswordRequirement = {
  regex: RegExp;
  text: string;
};

const passwordRequirements: PasswordRequirement[] = [
  { regex: /.{8,}/, text: "8+ characters" },
  { regex: /[A-Z]/, text: "One uppercase" },
  { regex: /[a-z]/, text: "One lowercase" },
  { regex: /[0-9]/, text: "One number" },
];

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add new state for password validation
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Add new state for real-time validation
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordRequirement = (requirement: PasswordRequirement) => {
    return requirement.regex.test(password);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updatePasswordStrength = (password: string) => {
    const strength = passwordRequirements.filter((req) =>
      req.regex.test(password)
    ).length;
    setPasswordStrength(strength);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    updatePasswordStrength(newPassword);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      onClose();
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check all password requirements
    const passwordValid = passwordRequirements.every((requirement) =>
      checkPasswordRequirement(requirement)
    );

    if (!passwordValid) {
      setError("Password does not meet all requirements");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the confirmation link!");
      setMode("signin");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the password reset link!");
      setMode("signin");
    }
    setLoading(false);
  };

  const PasswordInput = ({
    value,
    onChange,
    show,
    onToggle,
    label = "Password",
    confirm = false,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    show: boolean;
    onToggle: () => void;
    label?: string;
    confirm?: boolean;
  }) => (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={!confirm ? handlePasswordChange : onChange}
          className={`w-full p-2 border rounded pr-10 ${
            !confirm && passwordStrength > 0 && passwordStrength < 4
              ? "border-yellow-400"
              : !confirm && passwordStrength === 4
              ? "border-green-500"
              : "border-gray-300"
          }`}
          required
          name={confirm ? "confirm-password" : "password"}
          onFocus={() => !confirm && setPasswordFocused(true)}
          onBlur={() =>
            setTimeout(() => !confirm && setPasswordFocused(false), 200)
          }
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {!confirm && passwordFocused && (
        <div className="mt-2 space-y-1 bg-white p-2 rounded shadow-lg border">
          <div className="mb-2">
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  passwordStrength === 4
                    ? "bg-green-500"
                    : passwordStrength >= 2
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              />
            </div>
          </div>
          {passwordRequirements.map((requirement, index) => (
            <div
              key={index}
              className={`text-sm flex items-center space-x-2 ${
                checkPasswordRequirement(requirement)
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              <span>{checkPasswordRequirement(requirement) ? "✓" : "○"}</span>
              <span>{requirement.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-rose-600">
            {mode === "signin" && "Welcome Back!"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        <form
          onSubmit={
            mode === "signin"
              ? handleSignIn
              : mode === "signup"
              ? handleSignUp
              : handleForgotPassword
          }
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full p-2 border rounded ${
                !isValidEmail && email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {!isValidEmail && email && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid email
              </p>
            )}
          </div>

          {mode !== "forgot" && (
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          )}

          {mode === "signup" && (
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              label="Confirm Password"
              confirm
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Sign Up"
              : "Reset Password"}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          {mode === "signin" && (
            <>
              <button
                onClick={() => setMode("forgot")}
                className="text-rose-600 hover:text-rose-700 text-sm"
              >
                Forgot password?
              </button>
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-rose-600 hover:text-rose-700"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
          {(mode === "signup" || mode === "forgot") && (
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setMode("signin")}
                className="text-rose-600 hover:text-rose-700"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
