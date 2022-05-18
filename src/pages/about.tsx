import { Box, Container, Group, Image, Stack, Text, useMantineTheme } from "@mantine/core";

const About = () => {
  const theme = useMantineTheme();

  return (
    <Container p={80}>
      <Box pb={60} sx={{ fontSize: 48, fontWeight: 800, textAlign: "center" }}>
        About Us
      </Box>
      <p>
        <Text>
          We are A-Team, third-year students of Bulacan State University's
          Bachelor of Industrial Technology with a Major in Computer Technology,
          proposed a technological research named "VOTECAUE: Online Voter's
          Verification System for Barangay Lolomboy, Bocaue, Bulacan."
          <br />
        </Text>

        <h2>Project Context</h2>
        <Text>
          VOTECAUE will be helpful to the citizens especially in this kind of
          situation that we have been experiencing. It is much safer to have a
          system that will lessen the time of process to verify if they are
          registered. Given the fact that we are in the midst of a pandemic, It
          is believed that it’s unsafe for people to queue. People also tend not
          to check their voter registration in order to protect themselves and
          their families from the virus spreading.
        </Text>
        <br />
        <Text>
          The way in which voter registration data is saved and processed tends
          to be dictated by the many reasons for which voter registers might be
          utilized. The data contained in voter registers must be electronically
          acquired and kept in electronic form, usually in a database system, in
          order to provide this vast range of voter registration products.
        </Text>

        <h2>A-Team 3C - G2</h2>

        <Text>Carlos, Kenneth Aldrin J.</Text>
        <Text>Calbay, Razz Kerwin C.</Text>
        <Text>Esguerra, Jerome Angelo</Text>
        <Text>Gumatay, Andrei Michael C.</Text>
        <Text>Silungan, Edgie</Text>
        <Text>Sta Ana, Gabrielle</Text>

        <br/>
        <Stack align="center">
          <Group>
            <Image src="/assets/CIT.png" title="College of Industrial Technology" width={150}/>
            <Image src={theme.other.logo} title={theme.other.title} width={150}/>
            <Image src="/assets/BULSU.png" title="Bulacan State University" width={150}/>
          </Group>
          <br/>
          <Text>Copyright © 2022 A-Team. All Rights Reserved</Text>
        </Stack>
      </p>
    </Container>
  );
};

export default About;
