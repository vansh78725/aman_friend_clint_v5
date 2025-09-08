type Props = { title: string };

export default function Placeholder({ title }: Props) {
  return (
    <div className="container py-24">
      <div className="glass p-10 md:p-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          This page is ready to be customized. Tell me what content and layout
          you want here and I will generate it to match the premium
          glassmorphism style.
        </p>
      </div>
    </div>
  );
}
