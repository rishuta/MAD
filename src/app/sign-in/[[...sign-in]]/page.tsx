import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center px-5 py-10">
      <SignIn />
    </main>
  );
}
