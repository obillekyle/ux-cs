import { Anchor, Button, Container, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { useHotkeys } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Account } from "../main";

const Login = () => {

  const [account, refetch, loginCheck] = useContext(Account);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    loginCheck();
  })

  const request = () => {
    setRequesting(true);
    fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({
        login: {
          email,
          password,
        }
      }),
    })
    .then(res => res.json())
    .then(res => {
      if (res.status == 200) {
        refetch();
        showNotification({
          title: "Logged in, redirecting...",
          message: res.message,
          color: "green",
        });
        return
      }
      setRequesting(false);
      showNotification({
        title: "Login failed",
        message: res.message,
        color: "red",
      })
    }).catch(err => {
      setRequesting(false);
      showNotification({
        title: "Login failed",
        message: err.message,
        color: "red",
      })
    })
  }

  useHotkeys([
    ["enter", request],
  ])

  return (
    <Container size={350} py={100} fluid={false}>
      <form>
        <Stack spacing={8}>
          <Title align="center" mb="lg">Login</Title>
          <TextInput disabled={requesting} value={email} onChange={e => setEmail(e.target.value)} size="md" mb="sm" />
          <PasswordInput disabled={requesting} value={password} onChange={e => setPassword(e.target.value)}size="md" mb="sm" />
          <Button disabled={requesting} onClick={request} size="md" mb="lg">Login</Button>
          {!requesting && (
            <>
              <Anchor align="center" weight={600} component={Link} to="/register">Create an Account</Anchor>
              <Anchor align="center" component={Link} to="/forgot">I forgot my password</Anchor>
            </>
          )}
        </Stack>
      </form>
    </Container>
  )
}

export default Login;