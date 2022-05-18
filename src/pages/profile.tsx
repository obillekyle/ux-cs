import { Icon } from "@iconify/react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Modal,
  PasswordInput,
  ScrollArea,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { FormEventHandler, MouseEvent, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Account, Settings, defaultHeaderHeight } from "../main";
import relativeTime from "dayjs/plugin/relativeTime";
import { DatePicker } from "@mantine/dates";
import { AddressData, AddressPicker } from "../misc";

dayjs.extend(relativeTime);

const Profile = () => {
  const navigate = useNavigate();
  const settings = useContext(Settings);
  const [account, refetch, loginCheck] = useContext(Account);
  const height = settings("header-height") || defaultHeaderHeight;
  const [page, setPage] = useState(0);
  const theme = useMantineTheme();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("edit");
  const [aOpen, setAOpen] = useState(false);
  const [address, setAddress] = useState<AddressData | undefined>();
  const [rOpen, setROpen] = useState(false);

  const { data, status, refetch: r } = useQuery(["profile"], () =>
    fetch("/api/profile").then((res) => res.json())
  );

  useEffect(() => {
    if (data?.data && !address) {
      setAddress({
        address1: data.data.address1,
        address2: data.data.address2,
        province: data.data.province,
        city: data.data.city,
        region: data.data.region
      })
    }
  }, [data])

  if (!data || !account) {
    return (
      <Center my={200}>
        <CircularProgress />
      </Center>
    );
  }

  if (data.data?.role === "admin") {
    navigate("/admin");
    return (
      <Center my={200}>
        <CircularProgress />
      </Center>
    );
  }

  if (!data.data) {
    navigate("/login");
    return (
      <Center my={200}>
        <CircularProgress />
      </Center>
    );
  }



  if (status == "success" && (!data.data || !account.data)) {
    showNotification({
      title: "Login required",
      message: "You need to be logged in to view this page",
      color: "red",
    });
    navigate("/login");
    return (
      <Center my={200}>
        <CircularProgress />
      </Center>
    )
  }

  if (!data?.data.voter) {
    return (
      <Center py={120}>
        <Stack align="center" spacing={48}>
          <Title>Waiting for you to get verified</Title>
          <Card
            radius="md"
            withBorder
            p={16}
            sx={{ width: "clamp(100%, 100%, 800px)" }}
          >
            <Group>
              <Avatar size="xl" color="blue">
                {account.data.name[0]}
              </Avatar>
              <Stack>
                <Title order={2}>{account.data.name}</Title>
                <Badge sx={{ alignSelf: "start" }} size="lg" color="red">
                  Unverified
                </Badge>
              </Stack>
            </Group>
          </Card>
          <Text align="center">
            The administration needs to verify your account to prevent bots,{" "}
            <br />
            you may receive texts, phone calls or emails while on this state
          </Text>
        </Stack>
      </Center>
    );
  }

  const logout = () => {
    showNotification({
      id: "logout",
      title: "Logging out",
      message: "Logging you out of the account",
      disallowClose: true,
      color: "orange",
      autoClose: false,
    })
    fetch("/api/auth?logout=1").then(res => {
      navigate("/login");
      refetch();
      updateNotification({
        id: "logout",
        title: "Logged out",
        message: "You have been logged out",
        color: "green",
        autoClose: 2000,
      })
    });
  }

  const addressFinal = data
    ? `${data.data.address1} ${data.data.address2} ${data.data.city}, ${data.data.province}`
    : "";


  const changePassword:FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const target = e.currentTarget;
    const oldP = target.oldPassword;
    const newP = target.newPassword;
    const btn = target.go;

    const elems = [oldP, newP, btn];
    elems.forEach(e => e.disabled = true);

    fetch("/api/", {
      method: "PATCH",
      body: JSON.stringify({
        changePassword: {
          confirm: oldP.value,
          new: newP.value,
        }
      }),
    }).then(res => res.json()).then(res => {
      elems.forEach(e => e.disabled = false);
      if (res.status == 200) {
        elems.forEach(e => e.value = "");
        showNotification({
          title: "Success",
          message: "Your password has been changed",
          color: "green",
        })
        return;
      }
      showNotification({
        title: "Error",
        message: res.message,
        color: "red",
      })
    }).catch(err => {
      elems.forEach(e => e.disabled = false);
      showNotification({
        title: "Error",
        message: "Error:" + err,
        color: "red",
      })
      throw err;
    })
  }

  const options = [
    {
      label: "Profile",
      icon: "tabler:user",
      children: (
        <Box>
          <Stack p={24} spacing={4}>
            <Title order={2}>{account.data.name}</Title>
            <Text weight={700} color="lime">
              {data &&
                (data.data.voter.status == 1 ? "Active" : "Inactive") +
                  " on the database since " +
                  dayjs(data.data.voter.time).format("MMMM DD YYYY")}
            </Text>
            <Text color="gray">
              {data && "Voter Name: " + data.data.voter.name}
            </Text>
          </Stack>
          <Divider />
          <Stack p={24} spacing={0}>
            <Text weight={700} mb={8}>
              INFORMATION
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:cake" height={32} />
              <p>
                {dayjs(data.data.birthday * 1000).format("MMMM DD, YYYY")} (
                {dayjs(data.data.birthday * 1000).fromNow(true)} old)
              </p>
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:map-2" height={32} />
              <p>{addressFinal}</p>
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:phone" height={32} />
              <p>{data.data.phone}</p>
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:at" height={32} />
              <p>{data.data.email}</p>
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:hash" height={32} />
              <p>{"*".repeat(8)}</p>
            </Text>
          </Stack>
          <Stack  p={24} spacing={0}>
            <Text weight={700} mb={8}>
              Voter Information
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:user" height={32} />
              <p>{data.data.voter.name}</p>
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:building" height={32} />
              <p>PREC ID: {data.data.voter.prec_id} - {data.data.voter.no}</p>
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:map" height={32} />
              <p>{data.data.voter.state}</p>
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:map-2" height={32} />
              <p>{data.data.voter.address}</p>
            </Text>
            <Text color="gray" component={Group}>
              <Icon icon="tabler:star" height={32} />
              <p>{data.data.voter.status == 1 ? "Active" : "Inactive"}</p>
            </Text>
          </Stack>
          <Stack p={24} spacing={0}>
            <Text weight={700} mb={8}>
              OTHER
            </Text>
            <Text color="blue" component={Group} onClick={() => {setAction("edit"); setOpen(true)}}>
              <Icon icon="tabler:edit" height={32} />
              <p>Request for info change</p>
            </Text>
            <Text color="red" component={Group} onClick={() => {setAction("delete"); setOpen(true)}}>
              <Icon icon="tabler:trash" height={32} />
              <p>Request for account deletion</p>
            </Text>
          </Stack>
        </Box>
      ),
    },
    {
      label: "Change Password",
      icon: "tabler:key",
      children: (
        <form onSubmit={changePassword}>
          <Stack p={24}>
            <Title order={3}>Change your password</Title>
            <PasswordInput name="oldPassword" label="Old Password" required />
            <PasswordInput name="newPassword" label="New Password" required />
            <Button type="submit" color="green" name="go">Submit</Button>
          </Stack>
        </form>
      ),
    },
    {
      label: "Settings",
      icon: "tabler:settings",
      children: (
        <Stack p={24}>
          <Title order={3}>Settings</Title>
          <Text component={Group}>
            <Icon icon="tabler:color-swatch" height={32} />
            <Stack mr="auto" spacing={0}>
              <Text>Theme</Text>
              <Text size="sm" color="gray">
                Dark or light
              </Text>
            </Stack>
            <Switch
              checked={theme.colorScheme == "light"}
              onChange={(e) =>
                settings("theme", e.currentTarget.checked ? "light" : "dark")
              }
            />
          </Text>
          <Text component={Group}>
            <Icon icon="tabler:palette" height={32} />
            <Stack mr="auto" spacing={0}>
              <Text>Primary Color</Text>
              <Text size="sm" color="gray">
                Color the site as you wish
              </Text>
            </Stack>
            <Select
              value={settings("primaryColor") ?? theme.primaryColor}
              onChange={(e) => settings("primaryColor", e)}
              data={Object.keys(theme.colors).map((key, i) => ({
                value: key,
                label: key[0].toUpperCase() + key.slice(1),
              }))}
            />
          </Text>
          <Text component={Group}>
            <Icon icon="tabler:arrow-autofit-height" height={32} />
            <Stack mr="auto" spacing={0}>
              <Text>Header Height</Text>
              <Text size="sm" color="gray">
                The size of the sites Topbar / Header
              </Text>
            </Stack>
            <Select
              value={(
                settings("header-height") ?? defaultHeaderHeight
              ).toString()}
              onChange={(e) =>
                settings(
                  "header-height",
                  parseInt(e ?? defaultHeaderHeight.toString())
                )
              }
              data={["70", "80", "90", "100"]}
            />
          </Text>
          <Text component={Group}>
            <Icon icon="tabler:arrow-autofit-width" height={32} />
            <Stack mr="auto" spacing={0}>
              <Text>Site Margin</Text>
              <Text size="sm" color="gray">
                Make the site span the whole screen width
              </Text>
            </Stack>
            <Switch
              checked={settings("container-width") ?? false}
              onChange={(e) =>
                settings("container-width", e.currentTarget.checked)
              }
            />
          </Text>
        </Stack>
      ),
    },
  ];

  if (data.data.role == "admin") {
    navigate("/admin");
    return null;
  }

  const submitData:FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const type = "changeData";

    const target = e.currentTarget;
    const fname = target.firstName
    const mname = target.middleName
    const lname = target.lastName
    const phone = target.phone
    const bday = target.birthday
    const addr = target.address
    const elem = target.go

    const elems = [fname, mname, lname, phone, bday, elem, addr]
    elems.forEach(e => e.disabled == true)

    fetch("/api/", {
      method: "POST",
      body: JSON.stringify({
        createRequest: {
          type,
          firstName: fname.value,
          middleName: mname.value,
          lastName: lname.value,
          phone: target.phone.value,
          bday: dayjs(bday.value).unix(),
          ...address
        }
      }),
    }).then(res => res.json()).then(res => {
      if (res.status == 200) {
        setOpen(false);
        showNotification({
          title: "Success",
          message: "Your request has been sent",
          color: "green",
        })
        refetch();
        r();
        return;
      }
      elems.forEach(e => e.disabled = false)
      showNotification({
        title: "Error",
        message: res.message,
        color: "red",
      })
    }).catch(err => {
      showNotification({
        title: "Error",
        message: "Error:" + err,
        color: "red",
      })
      throw err;
    })
  }

  const submitDelete = (e:MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const type = "deleteUser";
    const target = e.currentTarget;
    target.disabled = true;

    fetch("/api/", {
      method: "POST",
      body: JSON.stringify({
        createRequest: {
          type,
        }
      }),
    }).then(res => res.json()).then(res => {
      if (res.status == 200) {
        setOpen(false);
        showNotification({
          title: "Success",
          message: "Your request has been sent",
          color: "green",
        })
        refetch();
        r();
        return;
      }
      target.disabled = false;
      showNotification({
        title: "Error",
        message: res.message,
        color: "red",
      })
    }).catch(err => {
      showNotification({
        title: "Error",
        message: "Error:" + err,
        color: "red",
      })
      throw err;
    })
  }

  const deleteRequest = (e:MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.disabled = true;

    fetch("/api/", {
      method: "DELETE",
      body: JSON.stringify({
        deleteRequest: true
      }),
    }).then(res => res.json()).then(res => {
      if (res.status == 200) {
        setROpen(false);
        showNotification({
          title: "Success",
          message: "Your request has been deleted",
          color: "green",
        })
        refetch();
        r();
        return;
      }
      target.disabled = false;
      showNotification({
        title: "Error",
        message: res.message,
        color: "red",
      })
    }).catch(err => {
      showNotification({
        title: "Error",
        message: "Error:" + err,
        color: "red",
      })
      throw err;
    })
  }

  return (
    <Container py={60}>
      <Modal opened={open} onClose={() => setOpen(false)} withCloseButton={false}>
        {action == "delete" && (
          <Stack align="center">
            <Title order={2} align="center">Request account deletion?</Title>
            <Text align="center">
              Are you sure you want to request an <b>Account Deletion</b>?<br/>
              Because this action can't be reversed once you do so
            </Text>
            <Group>
              <Button onClick={() => setOpen(false)} color="green">No, keep my account</Button>
              <Button onClick={submitDelete} variant="outline" color="red">I'm sure, delete my account</Button>
            </Group>
          </Stack>
        )}
        {action == "edit" && (
          <form onSubmit={submitData}>
            <Stack>
              <Title order={2} align="center">Request info change?</Title>
              <TextInput  name="firstName"        label="First Name"  defaultValue={data.data.firstName}        required/>
              <TextInput  name="middleName"       label="Middle Name" defaultValue={data.data.middleName}       required/>
              <TextInput  name="lastName"         label="Last Name"   defaultValue={data.data.lastName}         required/>
              <TextInput  name="phone" type="tel" label="Phone"       defaultValue={data.data.phone.slice(-10)} required icon="+63"/>
              <DatePicker name="birthday"         label="Birthday"    defaultValue={dayjs(data.data.birthday * 1000).toDate()} required/>
              <TextInput
                readOnly
                name="address"
                label="Address"
                rightSectionWidth={112}
                rightSection={<Button onClick={() => setAOpen(true)}>Edit Address</Button>}
                value={!!(address && address.region.length > 0) ? addressFinal : "No address"} />
              <AddressPicker opened={aOpen} onClose={() => setAOpen(false)} data={address as AddressData} onChange={e => setAddress(e)} />
              <Group sx={{justifyContent: "center"}}>
                <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                <Button type="submit" variant="filled" name="go" >Submit</Button>
              </Group>
            </Stack>
          </form>
        )}
      </Modal>
      <Group>
        <Stack
          pt={48}
          spacing={16}
          sx={{ width: 300, height: "calc(100vh - " + (height + 120) + "px)" }}
        >
          <Group noWrap>
            <Avatar size="lg" color="blue">
              {account.data.name[0]}
            </Avatar>
            <Stack spacing={0}>
              <Text size="lg" weight={600}>
                {account.data.name}
              </Text>
              <Text
                size="sm"
                sx={{ height: 24, overflow: "hidden" }}
                transform="uppercase"
              >
                <Tooltip label={addressFinal}>{addressFinal}</Tooltip>
              </Text>
            </Stack>
          </Group>
          <Divider />
          <ScrollArea sx={{ flexGrow: 1 }}>
            <Stack px={16} py={12} spacing="xl">
              {options.map((option, index) => (
                <Text
                  sx={{ cursor: "pointer" }}
                  component={Group}
                  size="lg"
                  color={
                    index == page
                      ? theme.colors[theme.primaryColor][6]
                      : undefined
                  }
                  onClick={() => setPage(index)}
                >
                  <Icon icon={option.icon} height={24} />
                  <Text weight={700} transform="uppercase" size="lg">
                    {option.label}
                  </Text>
                </Text>
              ))}
            </Stack>
          </ScrollArea>
          <Stack px={16}>
            {data.data.request && (
              <Text
                sx={{ cursor: "pointer" }}
                component={Group}
                size="lg"
                color="orange"
                onClick={() => setROpen(true)}
              >
                <Icon icon={data.data.request.type == "deleteUser" ? "tabler:trash" : "tabler:edit"} height={24} />
                <Text weight={700} transform="uppercase" size="lg">
                  Cancel {data.data.request.type == "deleteUser" ? "Deletion" : "Change"} Request
                </Text>
              </Text>
            )}
            <Text
              sx={{ cursor: "pointer" }}
              component={Group}
              size="lg"
              color="red"
              onClick={logout}
            >
              <Icon icon="tabler:logout" height={24} />
              <Text weight={700} transform="uppercase" size="lg">
                Logout
              </Text>
            </Text>
          </Stack>
        </Stack>
        <Card sx={{ flexGrow: 1 }} withBorder radius="lg">
          <ScrollArea sx={{ height: "calc(100vh - " + (height + 120) + "px)" }}>
            {options[page].children}
          </ScrollArea>
        </Card>
      </Group>
      <Modal opened={rOpen} onClose={() => setROpen(false)} title="Cancel Existing Request?">
        <Stack align="center">
          <Text>Do you wish to cancel existing request?</Text>
          <Group spacing={4}>
            <Button onClick={() => setROpen(false)} variant="outline">No</Button>
            <Button onClick={deleteRequest} variant="filled">Yes</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default Profile;
