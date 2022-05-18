import { Icon } from "@iconify/react";
import { Anchor, Button, Checkbox, Container, Divider, MultiSelect, PasswordInput, Select, Space, Stack, Stepper, Text, TextInput, Title } from "@mantine/core";
import { useEffect, useState, MouseEvent, useRef, useContext} from "react";
import { Link } from "react-router-dom";
import loc from "./geoloc.json";
import { showNotification } from '@mantine/notifications';
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { Account } from "../main";

const Register = () => {
  const [active, setActive] = useState(0);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [bday, setBday] = useState(new Date());
  const [errors, setErrors] = useState<any>({});
  const [accept, setAccept] = useState(false);
  const [account, refetch] = useContext(Account);
  const loginCheck = useContext(Account)[2];

  const regionOpts = Object.keys(loc).sort().map(key => ({value: key, label: (loc as any)[key].region_name}));
  const provinceOpts = Object.keys((loc as any)[region]?.["province_list"] ?? {})?.map(key => ({value: key, label: key}));
  const cityOpts = Object.keys((loc as any)[region]?.["province_list"]?.[province]?.["municipality_list"] ?? {})?.map(key => ({value: key, label: key}));
  const barangayOpts = (loc as any)[region]?.["province_list"]?.[province]?.["municipality_list"]?.[city]?.["barangay_list"]?.map((key: any) => ({value: key, label: key})) ?? [];

  useEffect(() => {
    active != 3 && setProvince("");
  }, [region])

  useEffect(() => {
    active != 3 && setCity("");
  }, [province])

  useEffect(() => {
    active != 3 && setAddress2("");
  }, [city])

  useEffect(() => {
    active != 3 && setAddress1("");
  }, [address2])

  let strength = [];
  const ref = useRef<HTMLInputElement>(null);

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


    fetch("/api/code.php?ec=" + email)
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

  const submit = () => {
    fetch("/api/auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        create: {
          email,
          password,
          phone,
          emailConsent,
          bday: dayjs(bday).unix(),
          lastName,
          firstName,
          middleName,
          address1,
          address2,
          city,
          province,
          region,
        }
      })
    }).then(res => res.json())
    .then(res => {
      if (res.status == 200) {
        refetch();
        showNotification({
          title: "Success",
          message: "Redirecting, you to the profile page",
          color: "green"
        })
        return;
      }
      showNotification({
        title: "Error",
        message: res.message,
        color: "red"
      })
    })
  }
  let err = errors;
  function verify() {
    err = {}
    
    if (firstName.length  > 50) err['firstName']  = "First name is too long";
    if (middleName.length > 50) err['middleName'] = "Middle name is too long";
    if (lastName.length   > 50) err['lastName']   = "Last name is too long";
    if (password.length  > 128) err['password']   = "Password is too long";
    if (phone.match(/[^0-9]/) ) err['phone']      = "Phone number must be numeric";
    if (phone.length     != 10) err['phone']      = "Phone number must be 10 digits";

    if (firstName == "")      err['firstName'] = "First name is required";
    if (lastName  == "")      err['lastName']  = "Last name is required";
    if (password  == "")      err['password']  = "Password is required";
    if (confirm   == "")      err['confirm']   = "Confirm password is required";
    if (phone     == "")      err['phone']     = "Phone number is required";
    if (address1  == "")      err['address1']  = "Address is required";
    if (address2  == "")      err['address2']  = "Barangay is required";
    if (city      == "")      err['city']      = "City is required";
    if (province  == "")      err['province']  = "Province is required";
    if (region    == "")      err['region']    = "Region is required";
    if (bday      == null)    err['bday']      = "Birthday is required";
    if (password  != confirm) err['confirm']   = "Passwords do not match";

    let testBday = dayjs().unix() - dayjs(bday).unix();
    if (testBday < 536112000)  err['bday'] = "You must be at least 18 years old to use our service";
    if (testBday > 3784320000) err['bday'] = "Please check your birthday and try again";

    console.log(err["bday"])

    Object.keys(err).length == 0 ? setActive(3) : setErrors(err);
  }


  return (
    <Container size={400} my={80} fluid={false}>
      <Title align="center" mt={80}>Register</Title> 
      <Stepper active={active} mt={40} >
        <Stepper.Step icon={<Icon icon="tabler:at" height={24}/>}>
          <Stack mt={20}>
            <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <Checkbox checked={emailConsent} onChange={e => setEmailConsent(e.currentTarget.checked)} label="I want to receive news, promotions and updates" />
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

            <Divider label="Personal Information (Impormasyon)" />
            <TextInput  error={errors.firstName  ?? undefined} label="First Name"                  value={firstName}  onChange={(e) => setFirstName(e.target.value)} required/>
            <TextInput  error={errors.middleName ?? undefined} label="Middle Name"                 value={middleName} onChange={(e) => setMiddleName(e.target.value)}/>
            <TextInput  error={errors.lastName   ?? undefined} label="Last Name"                   value={lastName}   onChange={(e) => setLastName(e.target.value)}  required/>
            <DatePicker error={errors.bday       ?? undefined} label="Birthday (Kaarawan)"         value={bday}       onChange={(e) => setBday(e ?? new Date())}     required/>
            <TextInput  error={errors.phone      ?? undefined} label="Phone (Telepono)" type="tel" value={phone}      onChange={(e) => setPhone(e.target.value)}     required icon={<Text size="sm">+63</Text>}/>

            <Divider label="Address (Lugar ng Tirahan)"/>
            <Select clearable searchable label="Region"   error={errors.region      ?? undefined} value={region}   data={regionOpts}   onChange={(e) => setRegion(e ?? "")}   required/>
            <Select clearable searchable label="Province" error={errors.province    ?? undefined} value={province} data={provinceOpts} onChange={(e) => setProvince(e ?? "")} required disabled={region  .length == 0}/>
            <Select clearable searchable label="City"     error={errors.city        ?? undefined} value={city}     data={cityOpts}     onChange={(e) => setCity(e ?? "")}     required disabled={province.length == 0}/>
            <Select clearable searchable label="Barangay" error={errors.address2    ?? undefined} value={address2} data={barangayOpts} onChange={(e) => setAddress2(e ?? "")} required disabled={city    .length == 0}/>
            <TextInput label="House No /Bldg No / Street" error={errors.address1    ?? undefined} value={address1} onChange={(e) => setAddress1(e.target.value)}              required disabled={address2.length == 0}/>

            <Divider label="Login Information (Inpormasiyon sa paglologin)"/>
            <PasswordInput label="Desired Password" value={password} ref={ref} onChange={(e) => setPassword(e.target.value)} icon={passwordIcon()} required/>
            {!!password && strength.length > 0 && (
            <Stack spacing={0}>
                <Text size="sm" color={strength.includes(2) ? "green" : "red"}><code>[{"{8}"}]</code> Password must be at least 8 characters</Text>
                <Text size="sm" color={strength.includes(3) ? "green" : "red"}><code>[{"a-z"}]</code> Must include small letters</Text>
                <Text size="sm" color={strength.includes(4) ? "green" : "red"}><code>[{"A-Z"}]</code> Must include capital letters</Text>
                <Text size="sm" color={strength.includes(5) ? "green" : "red"}><code>[{"0-9"}]</code> Must include any number</Text>
            </Stack>
            )}
            <PasswordInput label="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} icon={confirmIcon()} required error={confirm && password != confirm && "Password and Confirm Password does not match"}/> 


            <Button onClick={verify}>Next Step</Button>
          </Stack>
        </Stepper.Step>
        <Stepper.Step icon={<Icon icon="tabler:ad-2" height={24}/>}>
          <Stack>
            <Text align="center">Recheck all of the details</Text>
            <Text>
              <b>Email:</b><br/>
              {email}
            </Text>
            <Text>
              <b>Name:</b><br/>
              {lastName}, {firstName} {middleName ? middleName.split(" ").map(word => word[0]).join(" ") + "." : ""}
            </Text>
            <Text>
              <b>Phone:</b><br/>
              +63{phone}
            </Text>
            <Text>
              <b>Address:</b><br/>
              {address1.toUpperCase()} {address2}, {city} {province}, {(loc as any)[region]?.region_name}
            </Text>
            <Text>
              <b>Birthday</b><br/>
              {dayjs(bday).format("MMMM DD, YYYY")}
            </Text>
            <Text>
              <b>Password:</b><br/>
              {"*".repeat(password.length)}
            </Text>
            <Stack>
              <Checkbox checked={emailConsent} onChange={e => setEmailConsent(e.currentTarget.checked)} label="I want to receive news, promotions and updates" />
              <Checkbox checked={accept} onChange={e => setAccept(e.currentTarget.checked)} label="I agree to the sites Privacy Terms" />
            </Stack>
            <Button mb={-8} variant="outline" onClick={() => setActive((p) => p - 1)}>Edit Details</Button>
            <Button onClick={submit} disabled={!accept}>Submit</Button>
          </Stack>
        </Stepper.Step>
      </Stepper>
      <Text align="center" my="lg">
        <Anchor component={Link} to="/login">Already have an account?</Anchor>
      </Text>
    </Container>
  )
}

export default Register;