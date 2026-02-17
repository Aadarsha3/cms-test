import { useIsClient } from "@uidotdev/usehooks";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useThemeStorage, type ThemeName } from "~/hooks/localstorage-hooks";

export const ChosenTheme = createContext<IChosenTheme>({} as IChosenTheme);

const WithThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useThemeStorage();

  return (
    <ChosenTheme.Provider value={{ theme, setTheme }}>
      {children}
    </ChosenTheme.Provider>
  );
};

export const ChosenThemeProvider = ({ children }: { children: ReactNode }) => {
  const isClient = useIsClient();
  if (!isClient) {
    console.log("Not client");
    // Prevents hydration error
    return (
      <ChosenTheme.Provider value={{ theme: "light", setTheme: () => {} }}>
        {children}
      </ChosenTheme.Provider>
    );
  }

  return <WithThemeProvider>{children}</WithThemeProvider>;
};

interface IChosenTheme {
  theme: ThemeName;
  setTheme: Dispatch<SetStateAction<ThemeName>>;
}
