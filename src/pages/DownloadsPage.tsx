const downloads = [
  {
    label: "Visual Markdown",
    href: "/downloads/Senior-Computer-AI-Literacy-Course-220K-REAL-WORLD-VISUAL.md"
  },
  {
    label: "Visual PDF",
    href: "/downloads/Senior-Computer-AI-Literacy-Course-220K-REAL-WORLD-VISUAL.pdf"
  },
  {
    label: "Visual EPUB",
    href: "/downloads/Senior-Computer-AI-Literacy-Course-220K-REAL-WORLD-VISUAL.epub"
  },
  {
    label: "Clean Markdown",
    href: "/downloads/Senior-Computer-AI-Literacy-Course-220K-CLEAN-NO-PHOTO.md"
  },
  {
    label: "Clean PDF",
    href: "/downloads/Senior-Computer-AI-Literacy-Course-220K-CLEAN-NO-PHOTO.pdf"
  },
  {
    label: "Clean EPUB",
    href: "/downloads/Senior-Computer-AI-Literacy-Course-220K-CLEAN-NO-PHOTO.epub"
  },
  { label: "Audit Report", href: "/downloads/FINAL-220K-AUDIT-REPORT.md" }
];

export function DownloadsPage() {
  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <h1 className="page-title">Downloads</h1>
        <p className="page-lead">
          These files are stored in the website, so they can be opened from a local
          build or static deployment.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {downloads.map((item) => (
          <article className="card" key={item.href}>
            <h2 className="text-2xl font-black">{item.label}</h2>
            <a className="primary-button mt-4" href={item.href} download>
              Download
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
