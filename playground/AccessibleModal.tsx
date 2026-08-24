import { useEffect, useRef } from "react";

type AccessibleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
}: AccessibleModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    
    useEffect(() => {
  if (isOpen) {
    triggerRef.current = document.activeElement as HTMLElement;
  }
}, [isOpen]);

useEffect(() => {
  if (!isOpen) {
    return;
  }

  dialogRef.current?.focus();
}, [isOpen]);

useEffect(() => {
  if (isOpen) {
    return;
  }

  triggerRef.current?.focus();
  triggerRef.current = null;
}, [isOpen]);
useEffect(() => {
  if (!isOpen) {
    return;
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [isOpen, onClose]);

useEffect(() => {
  if (!isOpen) {
    return;
  }

  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  document.addEventListener("keydown", handleTabKey);

  return () => {
    document.removeEventListener("keydown", handleTabKey);
  };
}, [isOpen]);
  if (!isOpen) {
  return null;
}

return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="presentation"
  >
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
    >
      <h2 id="modal-title" className="mb-4 text-xl font-semibold">
        {title}
      </h2>

      {children}

      <button
        type="button"
        onClick={onClose}
        className="mt-6 rounded-md border px-4 py-2"
      >
        Close
      </button>
    </div>
  </div>
);
}