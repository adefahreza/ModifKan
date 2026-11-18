"use client";

import { useFormStatus } from "react-dom";
import Button from "./ui/Button";

export default function SubmitButton({ pendingText = "Menyimpan…", children, ...props }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
