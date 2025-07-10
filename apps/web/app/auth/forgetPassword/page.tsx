"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Password reset email sent successfully! Please check your inbox."
        );
        // setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        toast.error(result.message || "Failed to send password reset email");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div
        className="w-full max-w-md space-y-8 p-8 rounded-lg shadow-md"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
        }}
      >
        <div className="text-center">
          <h2
            className="mt-6 text-3xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Forgot Password
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Enter your email to receive a password reset link
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                style={{
                  borderColor: "var(--input)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span style={{ color: "var(--destructive)" }}>*</span> We'll
                send a recovery link to this email address
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-blue w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                {
                  "--tw-ring-color": "var(--ring)",
                  "--tw-ring-offset-color": "var(--background)",
                } as React.CSSProperties
              }
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="font-medium text-primary-blue hover:opacity-80 transition-opacity"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
