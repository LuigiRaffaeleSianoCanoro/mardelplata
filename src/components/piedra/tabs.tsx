"use client";

import { Tabs as UiTabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import { cn } from "@/lib/utils";

/**
 * Tabs Piedra sobre @ui-sdk/react/tabs.
 * El indicador se desliza con transform (200ms ease-out); las columnas
 * son minmax(0,1fr) para que el ancho no empuje el layout en mobile.
 */
function Tabs({ className, ...props }: React.ComponentProps<typeof UiTabs>) {
  return <UiTabs className={cn("flex min-w-0 flex-col", className)} {...props} />;
}

function SegmentedTabList({
  className,
  children,
  instant,
  ...props
}: React.ComponentProps<typeof TabsList> & { instant?: boolean }) {
  return (
    <TabsList
      className={cn(
        "relative grid min-w-0 w-full grid-cols-[repeat(4,minmax(0,1fr))] rounded-[10px] border bg-muted/70 p-[3px] text-muted-foreground",
        className,
      )}
      data-instant={instant ? "true" : "false"}
      {...props}
    >
      <TabsIndicator className="v3-tab-indicator" aria-hidden />
      {children as React.ReactNode}
    </TabsList>
  );
}

function SegmentedTab({
  className,
  ...props
}: React.ComponentProps<typeof TabsTab>) {
  return (
    <TabsTab
      className={cn(
        "v3-press relative z-[1] flex h-11 min-w-0 items-center justify-center rounded-[7px] px-1 text-[clamp(11px,3.1vw,13.5px)] font-medium text-muted-foreground lg:h-[34px] lg:px-4",
        "data-selected:text-foreground",
        "hover-device:hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60",
        className,
      )}
      {...props}
    />
  );
}

function TabPanel({ className, ...props }: React.ComponentProps<typeof TabsPanel>) {
  return <TabsPanel className={cn("v3-panel min-w-0 outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsPanel, TabsTab, TabsIndicator, SegmentedTabList, SegmentedTab, TabPanel };
