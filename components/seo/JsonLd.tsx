type JsonLdValue = Record<string, unknown>;

function serialise(data: JsonLdValue | (JsonLdValue | null)[] | null) {
  if (!data) return "";
  const payload = Array.isArray(data) ? data.filter(Boolean) : data;
  if (Array.isArray(payload) && payload.length === 0) return "";
  // Escaping "<" keeps admin-authored copy from closing the script tag early.
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

export default function JsonLd({
  data,
}: {
  data: JsonLdValue | (JsonLdValue | null)[] | null;
}) {
  const json = serialise(data);
  if (!json) return null;

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
