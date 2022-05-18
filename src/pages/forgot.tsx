import { Icon } from "@iconify/react";
import { Container, Stack, Stepper, TextInput, Title, Text, Button, Divider, PasswordInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { verify } from "crypto";
import { useState, MouseEvent, useRef, useContext, useEffect, MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { Account } from "../main";

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [active, setActive] = useState(0);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();
  const loginCheck = useContext(Account)[2];

  let strength = [];
  useEffect(() => {
    loginCheck();
  })

  if (password.length >= 1) strength.push(1);
  if (password.length >= 8) strength.push(2);
  if (password.match(/[a-z]/)) strength.push(3);
  if (password.match(/[A-Z]/)) strength.push(4);
  if (password.match(/[0-9]/)) strength.push(5);
  if (password.match(/[^a-zA-Z\d]/)) strength.push(6);

  const passwordIcon = () => {
    if (strength.length == 0) return <Icon icon="tabler:lock"/>;
    if (strength.length <= 4) return <Icon icon="tabler:x" color="red"/>;
    if (strength.length <= 5) return <Icon icon="tabler:check" color="lime"/>;
  }

  const confirmIcon = () => {
    if (confirm.length == 0) return <Icon icon="tabler:lock"/>;
    if (confirm.length <= 7) return <Icon icon="tabler:x" color="red"/>;
    if (confirm == password) return <Icon icon="tabler:check" color="lime"/>;
    return <Icon icon="tabler:x" color="red"/>;
  }

  const sendEmail = (e: MouseEvent<HTMLButtonElement>) => {
    const elem = e.currentTarget;
    const html = elem.innerHTML;

    elem.disabled = true;
    elem.innerText = "Sending...";

    const reset = () => {
      elem.disabled = false;
      elem.innerHTML = html;
    }

    const timer = (time: number) => {
      setTimeout(() => {
        if (time == 0) {
          elem.disabled = false;
          elem.innerHTML = "Resend Code";
          return;
        }
        elem.innerHTML = "Resend code in " + time + "s"; 
        timer(time - 1);
      }, 1000);
    }



    fetch("/api/code.php?pc=" + email)
    .then(res => res.json())
    .then(res => {
      if (res.status == 200) {
        timer(60);
        setActive(1);
        return;
      }
      showNotification({
        title: "Error",
        message: "An error occurred while sending the email. Please try again later.",
        color: "red"
      })
      reset();
    })
  }

  const verifyCode = (e: MouseEvent<HTMLButtonElement>) => {
    const elem = e.currentTarget;
    const html = elem.innerHTML;

    elem.disabled = true;
    elem.innerText = "Verifying...";

    const reset = () => {
      elem.disabled = false;
      elem.innerHTML = html;
    }

    fetch("/api/code.php?ev=" + code)
    .then(res => {
      if (res.status == 200) {
        setActive(2);
        return;
      }
      showNotification({
        title: "Error",
        message: "The code you entered is incorrect. Please try again.",
        color: "red"
      })
      reset();
    })
  }

  const change = (e: MouseEvent<HTMLButtonElement>) => {
    const elem = e.currentTarget;
    elem.disabled = true;

    fetch("/api/auth.php", {
      method: "POST",
      body: JSON.stringify({
        cp: {
          m: window.btoa(code),
          n: window.btoa(password),
          o: window.btoa(email)
        }
      })
    }).then(res => res.json())
    .then(res => {
      if (res.status == 200) {
        showNotification({
          title: "Success",
          message: "Password changed, redirecting you to the login page.",
          color: "green"
        })
        navigate("/login");
        return;
      }
      elem.disabled = false;
      showNotification({
        title: "Error",
        message: res.message,
        color: "red"
      })
    })
    .catch(err => {
      elem.disabled = false;
      showNotification({
        title: "Error",
        message: "An error occurred while changing your password. Please try again later.",
        color: "red"
      })
    })
  }
  
  return (
    <Container size={400} my={80} fluid={false}>
      <Title align="center" mt={80}>Forgot Password</Title>
      <Stepper active={active} mt={40}>
        <Stepper.Step icon={<Icon icon="tabler:at" height={24}/>}>
          <Stack>
            <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <Text>We will only send a code if there are users using this email!</Text>
            <Button mt={20} onClick={sendEmail}>Send Verification Code</Button>
          </Stack>
        </Stepper.Step>
        <Stepper.Step icon={<Icon icon="tabler:mail" height={24}/>}>
          <Stack>
            <Text mb={20} align="center">We sent you a verification code. Please check your email and your email spam folder</Text>
            <TextInput label="Verification Code" required value={code} onChange={e => setCode(e.target.value)}/>
            <Button onClick={sendEmail} variant="outline">Resend</Button>
            <Button onClick={verifyCode}>Verify Code</Button>
          </Stack>
        </Stepper.Step>
        <Stepper.Step icon={<Icon icon="tabler:user" height={24}/>}>
          <Stack>
            <Text align="center">Thank you for verifying your email<br/>Please fill out the fields below</Text>

            <Divider label="Set your new password (Ilagay ang iyong bagong password)"/>
            <PasswordInput label="Desired Password" value={password} onChange={(e) => setPassword(e.target.value)} icon={passwordIcon()} required/>
            {!!password && strength.length > 0 && (
            <Stack spacing={0}>
                <Text size="sm" color={strength.includes(2) ? "green" : "red"}><code>[{"{8}"}]</code> Password must be at least 8 characters</Text>
                <Text size="sm" color={strength.includes(3) ? "green" : "red"}><code>[{"a-z"}]</code> Must include small letters</Text>
                <Text size="sm" color={strength.includes(4) ? "green" : "red"}><code>[{"A-Z"}]</code> Must include capital letters</Text>
                <Text size="sm" color={strength.includes(5) ? "green" : "red"}><code>[{"0-9"}]</code> Must include any number</Text>
            </Stack>
            )}
            <PasswordInput label="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} icon={confirmIcon()} required error={confirm && password != confirm && "Password and Confirm Password does not match"}/> 
            <Button onClick={change}>Change Password</Button>
          </Stack>
        </Stepper.Step>
      </Stepper>
    </Container>
  )
}

export default Forgot