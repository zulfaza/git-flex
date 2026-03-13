"use client";

import { useTransition } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";

function getGithubPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;

  const raw = value.trim();
  if (!raw) return null;

  try {
    const hasProtocol = /^https?:\/\//i.test(raw);
    const url = new URL(hasProtocol ? raw : `https://github.com/${raw}`);

    if (url.hostname !== "github.com") return null;

    const segments = url.pathname.split("/").filter(Boolean);
    const username = segments[0];

    if (!username) return null;

    return `/${username}`;
  } catch (error) {
    console.error("Invalid URL", error);
    return null;
  }
}

export default function Form() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const path = getGithubPath(formData.get("github-url"));

    if (!path) return;

    startTransition(() => {
      router.push(path);
    });
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || isPending) return;

    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
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
            disabled={isPending}
            onKeyDown={handleInputKeyDown}
            required
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? "Loading..." : "Run"}
        </Button>
      </div>
      <p className="mt-4 text-left text-xs text-muted-foreground">
        We only fetch public contributions. Nothing is stored. Leave dates empty
        for last year.
      </p>
    </form>
  );
}
