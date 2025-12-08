export default function Footer() {
  return (
    <footer className="bg-black border-t border-[--color-primary] mt-10 py-6">
      <div className="max-w-4xl mx-auto text-center text-gray-400">
        <p className="text-sm">
          <span className="text-[--color-primary] font-semibold">Lucius Manzi</span>
        </p>

        <div className="flex justify-center gap-6 mt-3">
          <a
            href="https://github.com/Looosh/cs4550-fall2025-moviesite-frontend.git"
            target="_blank"
            className="hover:text-[--color-primary]"
          >
            Frontend Repo
          </a>

          <a
            href="https://github.com/Looosh/cs4550-fall2025-moviesite-backend.git"
            target="_blank"
            className="hover:text-[--color-primary]"
          >
            Backend Repo
          </a>
        </div>

        <p className="text-xs mt-4 opacity-60">
          © {new Date().getFullYear()} MovieHub — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
