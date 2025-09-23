"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";

export default function Form() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = (formData.get("github-url") as string | undefined)?.trim();

    if (!raw) return;

    try {
      const hasProtocol = /^https?:\/\//i.test(raw);
      const url = new URL(hasProtocol ? raw : `https://github.com/${raw}`);
      if (url.hostname !== "github.com") return;
      const segments = url.pathname.split("/").filter(Boolean);
      if (!segments[0]) return;
      const path = `/${segments[0]}`;
      router.push(path);
    } catch (e) {
      console.error("Invalid URL", e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 mx-auto w-full max-w-2xl border-2 border-black bg-card p-6 shadow-lg font-sans"
    >
      <Label htmlFor="github-url" className="sr-only">
        GitHub Profile URL or Username
      </Label>
      <div className="flex flex-col justify-center items-center gap-4 text-sm">
        <div className="w-full">
          <Input
            id="github-url"
            name="github-url"
            type="text"
            autoComplete="off"
            placeholder="https://github.com/your-username or username"
            required
            className="w-full"
          />
        </div>
        <Button type="submit">Run</Button>
      </div>
      <p className="mt-4 text-left text-xs text-muted-foreground">
        We only fetch public contributions. Nothing is stored. Leave dates empty
        for last year.
      </p>
    </form>
  );
}
