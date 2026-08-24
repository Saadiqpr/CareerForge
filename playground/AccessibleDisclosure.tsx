import { useId, useState } from "react";

type AccessibleDisclosureProps = {
  title: string;
  children: React.ReactNode;
};

export default function AccessibleDisclosure({
  title,
  children,
}: AccessibleDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-md border px-4 py-2"
      >
        {title}
      </button>

      <div
        id={contentId}
        hidden={!isOpen}
        className="mt-2 rounded-md border p-4"
      >
        {children}
      </div>
    </div>
  );
}