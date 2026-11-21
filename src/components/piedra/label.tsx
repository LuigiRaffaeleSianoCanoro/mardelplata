import { cn } from "@/lib/utils";

export function Label({ className, children, ...rest }: React.ComponentProps<"span">) {
  return (
    <span className={cn("v3-label", className)} {...rest}>
      {children}
    </span>
  );
}
