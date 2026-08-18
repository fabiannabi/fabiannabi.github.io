import { createContext, useContext } from "react";

export type TabsActivation = "automatic" | "manual";

export type TabsContextValue = {
  value: string;
  select: (value: string) => void;
  activation: TabsActivation;
  baseId: string;
};

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabs(component: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`<Tabs.${component}> must be rendered inside <Tabs>.`);
  }
  return context;
}

export const tabId = (baseId: string, value: string): string => `${baseId}-tab-${value}`;
export const panelId = (baseId: string, value: string): string => `${baseId}-panel-${value}`;
