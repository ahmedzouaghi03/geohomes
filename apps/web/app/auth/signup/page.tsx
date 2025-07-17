"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import BackButton from "@/components/ui/BackButton";

export default function AdminSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "ADMIN",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Show success toast
      toast.success("Account created successfully! Redirecting to login...");

      // Redirect to login on success
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    borderColor: "var(--input)",
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
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
          <div className="flex mt-6">
            <BackButton color="black" />
            <h2
              className=" text-3xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Create Admin Account
            </h2>
          </div>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Register as a new administrator
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                style={inputStyle}
                value={formData.name}
                onChange={handleChange}
              />
            </div>

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
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                style={inputStyle}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                style={inputStyle}
                value={formData.password}
                onChange={handleChange}
              />
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                Password must be at least 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                style={inputStyle}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Admin Role
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                style={inputStyle}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-blue w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                {
                  "--tw-ring-color": "var(--ring)",
                  "--tw-ring-offset-color": "var(--background)",
                } as React.CSSProperties
              }
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-primary-blue hover:opacity-80 transition-opacity"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
