import { Box, Container, List, Text } from "@mantine/core";

const Privacy = () => {
  return (
    <Container p={80}>
      <Box pb={60} sx={{ fontSize: 48, fontWeight: 800, textAlign: "center" }}>
        Privacy Policy
      </Box>
      <p>
        This policy explains how we handle your personal information when you use our service. The data is safely stored in the cloud.<br />
        <br />
        <List>
          <List.Item>
            <b>Full Name: </b>
            This information is used to show your name on our site and to verify your identity
          </List.Item>
          <List.Item>
            <b>Birthday: </b>
            This information is collected to ensure you are of legal age (18+) to use our service.
          </List.Item>
          <List.Item>
            <b>Email: </b>
            This information is used to send you emails, verify your identification, and provide you with login information.
          </List.Item>
          <List.Item>
            <b>Phone: </b>
            This information is used to send you confirmations and phone calls, as well as to make sure you're not a robot.
          </List.Item>
          <List.Item>
            <b>Address: </b>
            This information is needed to authenticate your account by comparing your address to our voter registration database.
          </List.Item>
        </List>
        <br/>
        This information is only visible to you. Your personal information is never sold, traded, or rented to anybody else.<br/> You may request account deletion if you disagree with the Privacy Policies
      </p>
    </Container>
  );
};

export default Privacy;
