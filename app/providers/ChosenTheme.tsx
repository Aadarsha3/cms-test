import { useIsClient } from "@uidotdev/usehooks";
import {
  createContext,
  useContext,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useThemeStorage, type ThemeName } from "@/hooks/localstorage-hooks";

export interface ChosenThemeContextType {
  theme: ThemeName;
  setTheme: Dispatch<SetStateAction<ThemeName>>;
}

export const ChosenTheme = createContext<ChosenThemeContextType | null>(null);

/**
 * Hook to safely use the ChosenTheme context
 */
export function useTheme(): ChosenThemeContextType {
  const context = useContext(ChosenTheme);
  if (!context) {
    throw new Error("useTheme must be used within a ChosenThemeProvider");
  }
  return context;
}

const WithThemeProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [theme, setTheme] = useThemeStorage();

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme]
  );

  return (
    <ChosenTheme.Provider value={value}>
      {children}
    </ChosenTheme.Provider>
  );
};

export const ChosenThemeProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const isClient = useIsClient();

  if (!isClient) {
    // Prevents hydration error by providing a stable default for the first render
    return (
      <ChosenTheme.Provider value={{ theme: "light", setTheme: () => { } }}>
        {children}
      </ChosenTheme.Provider>
    );
  }

  return <WithThemeProvider>{children}</WithThemeProvider>;
};

