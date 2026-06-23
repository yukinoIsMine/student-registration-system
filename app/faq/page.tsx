const faqs = [
  ["Can I edit after submitting?", "No. Submitted applications are locked for reviewer checking."],
  ["Which files are allowed?", "PDF, JPG, and PNG files up to 10 MB per document."],
  ["How do I become a reviewer?", "An admin promotes reviewer accounts from the Supabase dashboard or database."],
];

export default function FaqPage() {
  return (
    <div className="page-shell max-w-3xl space-y-5">
      <h1 className="text-3xl font-bold">FAQ</h1>
      {faqs.map(([question, answer]) => (
        <section key={question} className="rounded-lg border p-4">
          <h2 className="font-semibold">{question}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
        </section>
      ))}
    </div>
  );
}
