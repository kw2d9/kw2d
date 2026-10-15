export default function Footer() {
  return (
    <footer className="px-6 pb-6 pt-24">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <h3 className="font-heading text-2xl">Join the Movement</h3>
        <form action="/api/waitlist" method="post" className="flex w-full max-w-md gap-2">
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="flex-1 rounded-full bg-white/60 px-5 py-3 text-sm outline-none"
          />
          <button className="rounded-full bg-[#a3d9a5] px-5 text-lg" aria-label="Sign up">
            →
          </button>
        </form>
      </div>
      <div className="flex justify-between border-t border-[#eaba95] pt-5 text-xs">
        <span>© 2026 KW2D</span>
        <span>Terms and Policies</span>
      </div>
    </footer>
  );
}
