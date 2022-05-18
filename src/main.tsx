import { createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Center, Loader, LoadingOverlay, MantineProvider, MantineThemeOverride, useMantineTheme } from "@mantine/core";
import { render } from "react-dom";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { settingsType } from "./types";
import "./styles/default.scss";
import Routing from "./routes";
import { NotificationsProvider } from "@mantine/notifications";
import "external-svg-loader";
import { Icon } from "@iconify/react";
import { BrowserRouter, useNavigate } from "react-router-dom";

// undefined == loading
// null == error
// data == data

const client = new QueryClient();
export const defaultHeaderHeight = 80;
export const Account = createContext<any>(undefined);
export const Settings = createContext<settingsType>(
  (key, value) => {}
);

function Contexts() {
  const navigate = useNavigate();
  const [setting, setSetting] = useLocalStorage<any>({
    key: "setting",
    defaultValue: {},
  });


  const settings: settingsType = (key, value) => {
    if (value || value === false) {
      setSetting({ ...setting, [key]: value });
      return value;
    }
    if (key in setting) {
      return setting[key];
    }
    return undefined;
  };
  
  const clientTheme = useColorScheme();
  const theme = settings("theme") || clientTheme;

  const { data, refetch } = useQuery(["user"], async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({
        session: true,
      }),
    });
    return await res.json();
  });

  const loginCheck = (redirect = true) => {
    const goto = redirect ? navigate : () => {};
  
    if (!data) return false;
    if (!data.data) return false;
    if (!data.data.user) return false;
    if (!data.data.role) return false;
    
    if (data.data.role == "admin") {
      goto("/admin");
      return true;
    } else {
      goto("/profile");
      return true;
    }
  }  

  const { status, data: themeSetting} = useQuery([], () => fetch("/api/config.json").then(res => res.json()));
 
  const defaults = {
    primaryColor: "blue",
    fontFamily: "Source Sans Pro",
    fontFamilyMonospace: "JetBrains Mono",
    focusRing: "auto",
    black: "#000000",
    white: "#FFFFFF",
    dir: "ltr",
    headings: {
      fontFamily: "Source Sans Pro",
    },

  }

  if (status == "loading") {
    return (
      <Center sx={{height: "100vh"}}>
        <Loader variant="bars" />
      </Center>
    );
  }
  
  Object.assign(defaults, themeSetting);
  const settingsContext:any = {
    ...defaults,
    colorScheme: theme,
    primaryColor: settings("primaryColor") || defaults.primaryColor,
  };

  return (
    <Account.Provider value={[data, refetch, loginCheck]}>
      <Settings.Provider value={settings}>
        <BackgroundColor />
        <MantineProvider
          theme={settingsContext}
          withGlobalStyles
          withNormalizeCSS
          defaultProps={{
            Container: { fluid: settings("container-width") ?? false, size: 1080 }
          }}
        >
          <NotificationsProvider>
            <Routing />
          </NotificationsProvider>
        </MantineProvider>
      </Settings.Provider>
    </Account.Provider>
  );
}

if (import.meta.env.PROD) {
  createRoot(document.querySelector("#root")!).render(
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <Contexts />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </BrowserRouter>
  );
} else {
  render(
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <Contexts />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </BrowserRouter>,
    document.querySelector("#root")!
  );
}

function BackgroundColor() {
  const settings = useContext(Settings);
  const preferredTheme = useColorScheme();
  const theme = settings("theme") ?? preferredTheme;
  const color = settings("primaryColor") ?? "blue";
  const mc = useMantineTheme();

  return (
    <style>
      {`
        :root {
          color-scheme: ${theme};
          --theme-primary: ${mc.colors[color][6]};
        }
        body {
          --bg: ${
            theme == "light" ? "#FAFAFA" : "#1A1A1A"
          };
          background-color: var(--bg) !important;
        }
      `}
    </style>
  );
}
