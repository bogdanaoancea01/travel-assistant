export default function SectionHeader({ title, link }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-medium">{title}</h2>
      {link && <div>{link}</div>}
    </div>
  );
}
