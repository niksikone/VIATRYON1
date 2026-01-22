export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center shadow-lg">
        <h1 className="mb-3 text-2xl font-semibold">Signups are disabled</h1>
        <p className="text-sm text-neutral-400">
          Accounts are created by the platform administrator.
        </p>
        <a
          className="mt-6 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
          href="/login"
        >
          Go to login
        </a>
      </div>
    </div>
  );
}
