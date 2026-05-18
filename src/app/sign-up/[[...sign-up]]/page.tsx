import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center bg-[#F1F5F9] px-4 py-12 sm:px-5">
      <div className="surface-card w-full max-w-md rounded-2xl p-3">
        <div className="mb-6 px-5 pt-6 text-center">
          <p className="eyebrow">Create account</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#0F172A]">Start writing today</h1>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none",
              card: "bg-transparent shadow-none border-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "rounded-2xl border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] hover:bg-[#F1F5F9]",
              formFieldInput: "rounded-2xl border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] focus:ring-[#F8FAFC]",
              formButtonPrimary: "rounded-2xl bg-[#3B82F6] hover:bg-[#475569]",
              footerActionText: "text-[#94A3B8]",
              footerActionLink: "text-[#0F172A]"
            }
          }}
        />
      </div>
    </main>
  );
}
