import {
  Anchor,
  AppShell,
  Box,
  Button,
  Container,
  createStyles,
  Group,
  Header,
  Image,
  Space,
  Stack,
  Switch,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Fragment, useContext } from "react";
import { Account, defaultHeaderHeight, Settings } from "../main";
import { useWindowScroll } from "@mantine/hooks";


const App = () => {
  const settings = useContext(Settings);
  const height = settings("header-height") || defaultHeaderHeight;
  return (
    <AppShell footer={<Foot />} header={<Head />} padding={0}>
      <Space h={height} />
      <Outlet />
    </AppShell>
  );
};

const useStyles = createStyles((theme) => ({
  header: {
    border: "none",
    background: theme.colorScheme == "light" ? "#FAFAFADD" : "#1A1A1ADD",
    transition: "background 0.2s ease-in-out, backdrop-filter 0.2s ease-in-out",
    backdropFilter: "blur(5px)",
    "& .title": {},
  },
  options: {
    fontWeight: 600,
    fontSize: 20,
    borderRadius: 4,
    padding: "8px 12px",
    fontFamily: "Source Sans Pro",
    transition: "background 0.2s ease-in-out",
    "&:hover": {
      background: theme.colors[theme.primaryColor][5] + "30",
    },
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
}));

const options = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "Help Desk",
    path: "/help",
  },
];

const Head = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { classes: c } = useStyles();
  const [scroll, scrollTo] = useWindowScroll();
  const settings = useContext(Settings);
  const [ account ] = useContext(Account);
  const height = settings("header-height") || defaultHeaderHeight;

  const disabled = location.pathname == "/register"

  return (
    <Header
      height={height}
      fixed={true}
      className={c.header}
      sx={
        scroll.y < 1
          ? { background: "transparent", backdropFilter: "none" }
          : {}
      }
    >
      <title>{theme.other.title ?? "Site"}</title>
      <Container>
        <Group sx={{ height }} align="center">
          <Group mr="auto">
            <Image src={theme.other.logo} width={60} height={60} />
            <Title className="title" order={2} sx={{ fontWeight: 600 }}>
              {theme.other.title}
            </Title>
          </Group>
          <Group>
            {options.map(({ label, path }, i) => (
              <UnstyledButton key={i}
                component={Link}
                children={label}
                className={c.options}
                to={path}
              />
            ))}
          </Group>
          <Group ml="auto">
            {account?.data ? (
              <Button onClick={() => navigate("/profile")} disabled={disabled} size="md">{account.data.name}</Button>
            ): (
              <Button onClick={() => navigate("/register")} disabled={disabled} size="md">SIGN UP</Button>
            )}
          </Group>
        </Group>
      </Container>
    </Header>
  );
};

const groups = [
  {
    label: "Navigation",
    children: [
      {
        label: "Home",
        type: "internal",
        path: "/",
      },
      {
        label: "About Us",
        type: "internal",
        path: "/about",
      },
      {
        label: "Help Desk",
        type: "internal",
        path: "/help",
      },
    ],
  },
  {
    label: "Contact Us",
    children: [
      {
        label: "votecaue.research@gmail.com",
        type: "external",
        path: "mailto:votecaue.research@gmail.com",
      },
      {
        label: "+63-967-954-2029",
        type: "external",
        path: "tel:+639679542029",
      },
    ],
  },
  {
    label: "Social",
    children: [
      {
        type: "raw",
        label: (
          <Group spacing={4}>
            <Anchor href="https://www.facebook.com/bocauepostoffice" color="gray">
              <Icon icon="tabler:brand-facebook" height={24} />
            </Anchor>
            <Anchor href="mailto:votecaue.research@gmail.com" color="gray">
              <Icon icon="tabler:brand-gmail" height={24} />
            </Anchor>
          </Group>
        ),
        path: undefined,
      },
    ],
  },
  {
    label: "Legal",
    children: [
      {
        label: "Privacy Policy",
        type: "internal",
        path: "/privacy",
      },
      {
        label: "Terms of Service",
        type: "internal",
        path: "/terms",
      },
    ],
  },
];

const Foot = () => {
  const theme = useMantineTheme();
  const settings = useContext(Settings);
  const cs = theme.colorScheme == "light";
  const primary = theme.colors[theme.primaryColor];

  const themer = [
    {
      label: "Theme",
      children: [
        {
          label: (
            <Switch
              label={cs ? "Light" : "Dark"}
              checked={cs}
              onChange={(e) =>
                settings("theme", e.currentTarget.checked ? "light" : "dark")
              }
            />
          ),
          type: "raw",
          path: "/",
        },
      ],
    },
  ];

  const final = [...groups, ...themer];

  return (
    <Box
      sx={{
        borderTop: "1px solid " + (cs ? "#ccc" : "#444"),
        paddingBlock: 80,
      }}
    >
      <Container size={1100}>
        <Box
          sx={{
            rowGap: 50,
            display: "grid",
            justifyContent: "space-between",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%/1, max(175px, 100%/3)), 1fr))",
          }}
        >
          {final.map(({ label, children }, i) => (
            <Stack spacing={6} key={i}>
              <Box
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: primary[8],
                }}
              >
                {label}
              </Box>
              {children.map(({ label, path, type }, i) => {
                if (type == "raw") {
                  return <Fragment key={i}>{label}</Fragment>;
                }
                return type! === "external" ? (
                  <Anchor key={i} href={path} sx={{ color: "inherit" }}>
                    {label}
                  </Anchor>
                ) : (
                  <Anchor
                    key={i}
                    component={Link}
                    sx={{ color: "inherit" }}
                    to={path!}
                  >
                    {label}
                  </Anchor>
                );
              })}
            </Stack>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default App;
