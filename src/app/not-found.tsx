import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <p className="font-mono text-xs tracking-wide text-pine uppercase">404</p>
      <h1 className="mt-3 text-4xl">That page is not on this site.</h1>
      <p className="mt-4 leading-7">
        The calculators are listed on the homepage. If you followed an old link, start there.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-6 inline-flex h-11 px-4")}>
        Back to the tools
      </Link>
    </div>
  );
}
