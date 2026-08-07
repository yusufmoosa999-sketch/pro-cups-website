import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">
        Forgot Password
      </h1>
    </main>
  );
}