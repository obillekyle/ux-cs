import { Icon } from "@iconify/react";
import {
  Box,
  Container,
  Group,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useContext } from "react";
import { defaultHeaderHeight, Settings } from "../main";

const Help = () => {
  const settings = useContext(Settings);
  const theme = useMantineTheme().colorScheme;
  const height = settings("header-height") || defaultHeaderHeight;
  return (
    <>
      <Box
        sx={{
          marginTop: height * -1,
          backgroundImage: "url('/assets/hideout.svg')",
          backgroundColor: theme === "light" ? "#EFEFEF" : "#212121",
          backgroundSize: 18,
          borderBottom: "2px solid #7775",
        }}
        py={80}
      >
        <Container size={1100}>
          <Group
            mt={100}
            sx={{
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            Get
            <Box sx={{ color: "#228be6" }}>help</Box>
            with
            <Box sx={{ color: "orange" }}>anything</Box>
          </Group>
          <TextInput
            mt={40}
            sx={{
              width: "600px",
              maxWidth: "100%",
              margin: "0 auto",
            }}
            onChange={() => {}}
            size="lg"
            radius="md"
            inputMode="search"
            rightSectionWidth={60}
            rightSection={<Icon icon="tabler:search" fontSize={24} />}
          />
        </Container>
      </Box>
      <Container py={40}>
        <Text align="center">There's nothing in here</Text>
      </Container>
    </>
  );
};

export default Help;
