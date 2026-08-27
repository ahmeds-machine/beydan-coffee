import { RevealGroup, RevealItem } from "@/components/reveal";
import { cn } from "@/lib/utils";

export interface Fact {
  value: string;
  label: string;
  note: string;
}

/**
 * "By the numbers", set as oversized numerals in the accent colour. Text only
 * — the section's photography lives in the shared carousel beneath the stack,
 * not alongside any one figure. Every figure here is stated on the live site.
 */
export function FactsRow({
  facts,
  className,
}: {
  facts: readonly Fact[];
  className?: string;
}) {
  return (
    <RevealGroup as="ul" className={cn("flex flex-col gap-9", className)} stagger={0.1}>
      {facts.map((fact) => (
        <RevealItem
          as="li"
          key={fact.label}
          className="flex flex-wrap items-baseline gap-x-6 gap-y-2"
        >
          <span className="numeral text-crimson">{fact.value}</span>

          <span className="flex flex-col gap-0.5">
            <span className="display-4">{fact.label}</span>
            <span className="body-base text-muted-foreground">{fact.note}</span>
          </span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
