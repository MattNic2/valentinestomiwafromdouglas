import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

type AuthMode = "signin" | "signup" | "forgot";

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
          onChange={onChange}
          className="w-full p-2 border rounded pr-10"
          required
          name={confirm ? "confirm-password" : "password"}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
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
