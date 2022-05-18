import {
  Accordion,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  createStyles,
  Group,
  Image,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Account } from "../main";

const useStyles = createStyles((theme) => {
  const primary = theme.colors[theme.primaryColor];
  const blob = encodeURIComponent(`
      <svg
      width="457"
      height="387"
      viewBox="0 0 457 387"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M184.437 385.72C115.781 380.736 52.6939 347.155 17.3059 296.039C-13.9104 250.949 5.51831 197.692 18.9245 146.648C32.7913 93.8495 36.3582 28.9451 93.3726 6.4132C150.392 -16.1208 207.954 27.7546 265.869 49.056C332.941 73.7255 422.025 77.6754 447.393 136.623C474.924 200.596 436.64 272.388 383.602 322.63C333.553 370.041 258.741 391.114 184.437 385.72Z"
        fill="url(#paint0_linear_8_4)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_8_4"
          x1="184.36"
          y1="10.1534"
          x2="268.64"
          y2="373.843"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color='${primary[6]}' />
          <stop offset="1" stop-color='${primary[6]}' stop-opacity="0.56" />
        </linearGradient>
      </defs>
    </svg>
    `);

  return {
    headLeft: {
      flexGrow: 1,
      maxWidth: "100%",
      paddingInline: 12,
      justifyContent: "center",
      "& > * ": {
        alignSelf: "center",
      },
      "& .head": {
        fontSize: 48,
        fontWeight: 800,
      },
      "@media (max-width: 1100px)": {
        textAlign: "center",
        "& .btns": {
          justifyContent: "center",
        },
      },
    },
    headRight: {
      height: 380,
      flexGrow: 1,
      maxWidth: "100%",
      paddingInline: 12,
      background: `url("data:image/svg+xml,${blob}") no-repeat`,
      backgroundSize: 400,
      alignItems: "center",
      justifyContent: "center",
      backgroundPosition: "center",
      "& .card": {
        position: "relative",
        width: 490,
        maxWidth: "100%",
        transition: "transform 0.5s, box-shadow 0.2s",
        "& .image": {
          overflow: "hidden",
          borderRadius: 9,
        },
        "&:hover": {
          zIndex: 10,
          boxShadow: "0 0 20px" + theme.colors[theme.primaryColor][5],
          transform: "scale(1.05)",
        },
      },
    },
    faqLeft: {
      flexGrow: 1,
      maxWidth: "100%",
      "& img": {
        maxWidth: "100%",
        display: "block",
        margin: "0 auto",
      },
    },
    faqRight: {
      flexGrow: 1,
      alignItems: "center",
      background: "url('/assets/foliage.svg') no-repeat",
      backgroundPosition: "bottom",
      paddingBlock: 50,
      maxWidth: "100%",
      paddingInline: 12,
      backgroundSize: "contain",
      "& .item": {
        borderRadius: 4,
        width: 440,
        margin: "0 auto",
        maxWidth: "100%",
        marginTop: 8,
        background: theme.colorScheme == "light" ? "white" : "#212121",
        border: "1px solid #9999",
      },
    },
  };
});

const cards = [
  {
    label: "Carlos, Kenneth Aldrin",
    image: "/assets/person/carlos.png",
    active: true,
  },
  {
    label: "Calbay, Razz Kerwin",
    image: "/assets/person/calbay.png",
    active: false,
  },
  {
    label: "Gumatay, Andrei Michael",
    image: "/assets/person/gumatay.png",
    active: true,
  },
];

const offers = [
  {
    label: "Voter's Info",
    value: "100+",
    color: "#228be6",
  },
  {
    label: "All data are stored securely in the cloud",
    value: "Secure",
    color: "#007D14",
  },
  {
    label: "Database is updated weekly",
    value: "Reliable",
    color: "#FFA500",
  },
];

const faqItems = [
  {
    question: "Is there a fee for signing up for an account?",
    answer: "Absolutely none! We are a completely free service.",
  },
  {
    question: "What documents will I need to sign up?",
    answer: "You will need to provide a Voters ID and a valid email address.",
  },
  {
    question: "I cannot search up my voter status, what should I do?",
    answer:
      "You can search up your voter status by entering your email address and your voter ID number.",
  },
  {
    question: "My voter status is inactive, how can I activate it again?",
    answer: (
      <>
        You do not need to register as a new voter. You only need to apply for
        the reactivation of your records. Please follow this{" "}
        <Anchor href="https://www.rappler.com/nation/elections/guides-how-to-reactivate-voter-registration-philippines/">
          article
        </Anchor>{" "}
        to find out how to do this.
      </>
    ),
  },
];

const Home = () => {
  const theme = useMantineTheme();
  const cs = theme.colorScheme;
  const { classes: c } = useStyles();
  const [ account ] = useContext(Account);
  const primary = theme.colors[theme.primaryColor];

  return (
    <div>
      <Container my={120} mb={80} sx={{ padding: "0!important" }}>
        <Group spacing={0} sx={{ justifyContent: "center" }}>
          <Stack className={c.headLeft}>
            <Stack>
              <Box className="head">
                View your voters status
                <br /> in{" "}
                <Box sx={{ display: "inline", color: primary[5] }}>minutes*</Box>
              </Box>
              <Text weight={400} color="gray" size="md">
                Free of charge, Voters ID and Account is required
              </Text>
              <Group mt={16} className="btns">
                {account?.data?.user ? (
                  <Button size="md" component={Link} to="profile">My Profile</Button>
                ) : (
                  <>
                    <Button size="md" component={Link} to="/register">SIGN UP</Button>
                    <Button size="md" variant="outline" component={Link} to="/login">
                      LOG IN
                    </Button>
                  </>
                )}
              </Group>
            </Stack>
          </Stack>
          <Stack className={c.headRight}>
            {cards.map(({ label, image, active }, i) => (
              <Card
                className="card"
                withBorder
                shadow="md"
                key={i}
                radius="md"
                sx={{
                  marginTop: i == 0 ? 0 : -100,
                  zIndex: cards.length - i,
                  transform: "scale(" + (1 - i * 0.02) + ")",
                }}
              >
                <Group>
                  <Image
                    src={image}
                    placeholder
                    alt={label}
                    width={90}
                    height={90}
                    className="image"
                  />
                  <Stack>
                    <Text sx={{ fontSize: 24, fontWeight: 600 }}>{label}</Text>
                    <Badge
                      size="lg"
                      color={active ? "green" : "red"}
                      sx={{ width: "max-content" }}
                    >
                      {active ? "Active" : "Inactive"}
                    </Badge>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Stack>
        </Group>
      </Container>

      <Box sx={{ background: cs == "light" ? "#f2f2f2" : "#212121" }}>
        <Container size={1100} py={80}>
          <Group
            sx={{ justifyContent: "space-evenly", textAlign: "center" }}
            spacing={80}
          >
            {offers.map(({ label, value, color }, i) => (
              <Stack spacing={0} key={i}>
                <Title sx={{ color, fontSize: 48 }}>{value}</Title>
                <Text>{label}</Text>
              </Stack>
            ))}
          </Group>
        </Container>
      </Box>

      <Container size={1100} my={80} sx={{ padding: "0!important" }}>
        <Group spacing={40}>
          <Stack className={c.faqLeft}>
            <Box
              sx={{
                fontSize: 48,
                fontWeight: 800,
                textAlign: "center",
                color: primary[7],
              }}
            >
              Frequently Asked
              <br /> Questions
            </Box>
            <Image
              className="image"
              src="/assets/faq.svg"
              alt="FAQ"
              width={400}
            />
          </Stack>
          <Accordion className={c.faqRight} iconPosition="right">
            {faqItems.map(({ question, answer }, i) => (
              <Accordion.Item label={question} className="item" key={i}>
                {answer}
              </Accordion.Item>
            ))}
          </Accordion>
        </Group>
      </Container>
    </div>
  );
};

export default Home;
