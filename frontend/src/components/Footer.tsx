export default function Footer() {
  return (
    <footer className="mt-16 pb-8 text-center text-[#999] font-body">
      <p className="italic text-lg sm:text-xl">
        &ldquo;Those who want respect, give respect.&rdquo;
      </p>
      <p className="mt-3 font-mono text-sm">
        Inspired by{" "}
        <a
          href="https://github.com/T3-Content/skatebench#"
          className="text-[#D4AF37] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          skatebench
        </a>
        {" & "}
        <a
          href="https://gunbench.vercel.app/"
          className="text-[#D4AF37] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          gunbench
        </a>
      </p>
      <p className="mt-2 font-mono text-sm">
        Built by{" "}
        <a
          href="https://graycoding.dev/"
          className="text-[#FF6B6B] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          coltongraygg
        </a>
        {" · "}
        <a
          href="https://github.com/coltongraygg/gabagool-bench"
          className="text-[#888] hover:text-white hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
