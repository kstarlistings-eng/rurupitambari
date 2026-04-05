export default function DomainNotFound() {
  const domain = window?.location?.hostname || "unknown.domain.com";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blob */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
          {/* Top stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-rose-600 via-rose-400 to-orange-400" />

          <div className="p-8">
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            </div>

            {/* Heading */}
            <h1 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
              Organization not found
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              We couldn't find any organization associated with this domain. It
              may have been removed, or you might be using the wrong URL.
            </p>

            {/* Domain pill */}
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-8">
              <svg
                className="w-4 h-4 text-gray-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
              <span className="text-gray-600 text-xs font-mono truncate">
                {domain}
              </span>
              <span className="ml-auto shrink-0 text-xs text-rose-600 bg-rose-100 border border-rose-300 rounded-md px-2 py-0.5 font-medium">
                Not found
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-gray-500 text-xs text-center">
              If this is unexpected,{" "}
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 underline underline-offset-2"
              >
                let us know
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
