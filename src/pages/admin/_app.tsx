import {
  AppShell,
  Box,
  Burger,
  Container,
  Group,
  Header,
  Loader,
  Menu,
  Navbar,
  ScrollArea,
  Space,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useContext, useEffect } from "react";
import { Account, Settings } from "../../main";
import { defaultHeaderHeight } from "../../main";
import { showNotification, updateNotification } from "@mantine/notifications";

const App = () => {
  const settings = useContext(Settings);
  const navigate = useNavigate();
  const [account, refetch] = useContext(Account);
  const height = settings("header-height") || defaultHeaderHeight;

  if (!account) {
    return (
      <Group sx={{ height: "100vh", justifyContent: "center" }}>
        <Loader variant="bars" />
      </Group>
    );
  }

  useEffect(() => {
    if (account && (!account.data || account.data.role !== "admin")) {
      navigate("/login");
    }
  })

  if (account && (!account.data || account.data.role !== "admin")) {
    return <></>
  }


  return (
    <AppShell fixed header={<Head />} navbar={<Nav />} padding={0}>
      <Box p={12}>
        <Outlet />
      </Box>
    </AppShell>
  );
};

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = useContext(Settings);
  const theme = useMantineTheme();
  const [account, refetch, loginCheck] = useContext(Account);
  const height = settings("header-height") || defaultHeaderHeight;

  const options = [
    {
      label: "Dashboard",
      path: "/admin/",
      icon: "tabler:dashboard",
      active:
        location.pathname.split("/")[2] === "" ||
        location.pathname.split("/")[2] === undefined,
    },
    {
      label: "Verify Users",
      path: "/admin/verify",
      icon: "tabler:user-check",
      active: location.pathname.split("/")[2] === "verify",
    },
    {
      label: "User List",
      path: "/admin/users",
      icon: "tabler:users",
      active:
        location.pathname.split("/")[2] === "users" ||
        location.pathname.split("/")[2] === "user",
    },
    {
      label: "Voter List",
      path: "/admin/voters",
      icon: "tabler:credit-card",
      active:
        location.pathname.split("/")[2] === "voters" ||
        location.pathname.split("/")[2] === "voter",
    },
    {
      label: "Requests",
      path: "/admin/requests",
      icon: "tabler:git-pull-request",
      active: location.pathname.split("/")[2] === "requests",
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: "tabler:settings",
      active: location.pathname.split("/")[2] === "settings",
    },
  ];

  const [nav, setNav] = [settings("navbar-open"), (e:boolean) => settings("navbar-open", e)];

  return (
    <Navbar
      width={{sm: nav ? 300 : 75}}
      sx={{
        background: "var(--bg)",
        minHeight: `calc(100vh - ${height}px)`,
        borderRight: `1px solid #9994`,
      }}
      hidden={!nav}
    >
      <Navbar.Section grow>
        <ScrollArea>
          <Space h={height}/>
          {options.map(({ path, active, icon, label }) => (
            <Group
              pl={24}
              py={12}
              key={path}
              sx={{ cursor: "pointer", height: 52 }}
              onClick={() => navigate(path)}
            >
              <Text
                weight={700}
                component={Group}
                transform="uppercase"
                color={active ? theme.primaryColor : undefined}
              >
                <Icon icon={icon} height={24} />
                {nav && <Text size="lg">{label}</Text>}
              </Text>
            </Group>
          ))}
        </ScrollArea>
      </Navbar.Section>
    </Navbar>
  );
};

const Head = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const settings = useContext(Settings);
  const [account, refetch] = useContext(Account);
  const height = settings("header-height") || defaultHeaderHeight;
  const [nav, setNav] = [settings("navbar-open"), (e:boolean) => settings("navbar-open", e)];

  const logout = () => {
    showNotification({
      id: "logout",
      title: "Log out",
      message: "Logging you out...",
      color: "yellow",
      autoClose: false,
      disallowClose: true
    })
    fetch("/api/auth.php?logout=true")
      .then(() => {
        refetch();
        navigate("/login");
        updateNotification({
          id: "logout",
          title: "Log out",
          message: "Logged out successfully",
          color: "green",
          autoClose: 2000,
          disallowClose: false
        })
      })
      .catch((err) => {
        updateNotification({
          id: "logout",
          title: "Log out",
          message: "Error occurred while logging out",
          color: "red",
          autoClose: 2000,
          disallowClose: false
        })
        throw err;
      })
  }

  return (
    <Header height={height} fixed={true} sx={{ background: "var(--bg)" }}>
      <title>Admin | {theme.other.title ?? "Site"}</title>
      <Group sx={{ height }} align="center" px={16}>
        <Group mr="auto" spacing={0}>
          <Burger size={24} onClick={() => setNav(!nav)} opened={nav}/>
          <svg data-src="/assets/logo.svg" width={60} height={40} />
          <Title className="title" order={2} sx={{ fontWeight: 600 }}>
            {theme.other.title}
          </Title>
        </Group>
        <Group>
          <Menu
            placement="end"
            size="lg"
            transition="scale-y"
            withArrow
            control={
              <Text transform="uppercase" size="lg" component={Group}>
                <Text>{account.data.name}</Text>
                <Icon icon="tabler:chevron-down" />
              </Text>
            }
          >
            <Menu.Item icon={<Icon icon="tabler:home" />} onClick={() => navigate("/")}>
              Home
            </Menu.Item>
            <Menu.Item icon={<Icon icon="tabler:logout" />} color="red" onClick={logout}>
              Logout
            </Menu.Item>
          </Menu>
          <Menu
            placement="end"
            transition="scale-y"
            withArrow
            control={
              <Text
                component={Icon}
                icon="tabler:square"
                height={24}
                mt={6}
              />
            }
          >
            <Menu.Label>
              <Group>
                <Box mr="auto">Notifications</Box>
              </Group>
            </Menu.Label>
          </Menu>
        </Group>
      </Group>
    </Header>
  );
};

export default App;
