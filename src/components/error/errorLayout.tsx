export default function ErrorLayout({
  errorMessage = "An unexpected error occurred. Please try again later.",
}: {
  errorMessage?: string;
}) {
  return (
    <div className="h-fit  w-fit flex flex-col items-center justify-center text-black p-4 border border-red-500 rounded-md">
      <p className="text-4xl font-bold mb-4">Errors</p>
      <p className="text-lg text-center">{errorMessage}</p>
      {/* <p className="text-sm text-center mt-2 text-black-950">{errorMessage}</p> */}
      <button
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md cursor-pointera"
        onClick={() => window.location.reload()}
      >
        Try again
      </button>
    </div>
  );
}
