import { Anchor, Avatar, Box, Card, Center, Divider, Group, Loader, Paper, ScrollArea, Skeleton, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { Fragment, useContext, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Account } from "../../main";
import relativeTime from "dayjs/plugin/relativeTime";
import { InlineIcon } from "@iconify/react";

dayjs.extend(relativeTime);

const Dashboard = () => {
  const [account, refetch] = useContext(Account);

  if (!account) {
    return (
      <Group sx={{ height: "100vh", justifyContent: "center" }}>
        <Loader variant="bars" />
      </Group>
    );
  }

  const { data } = useQuery(["dashboard"], () => fetch(
    `/admin/api/?q=` +
    window.btoa(
      JSON.stringify({
        unv_users: true,
        users: true,
        requests: true,
      })
    )
  ).then(res => res.json()));

  const cards = [
    {
      label: "Total Users",
      value: data && data.data.total.users[0],
      color: "green",
    },
    {
      label: "Total Unverified Users",
      value: data && data.data.total.unv_users[0],
      color: "yellow",
    },
    {
      label: "Total Requests",  
      value: data && data.data.total.requests[0],
      color: "grape",
    },
  ];


  const random = (min:number, max:number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <Stack>
      <Title order={2}>Dashboard</Title>
      <Group>
        {!data
          ? cards.map((k, i) => (
              <Card sx={{ width: 300 }} key={i}>
                <Stack spacing={6}>
                  <Skeleton height={16} width={random(100, 160)} />
                  <Skeleton height={48} width={random(40, 80)} />
                </Stack>
              </Card>
            ))
          : cards.map((k, i) => (
              <Card sx={{ width: 300 }}>
                <Stack spacing={6}>
                  <Text weight={700} color={k.color} transform="uppercase">
                    {k.label}
                  </Text>
                  <Title color={k.color}>{k.value}</Title>
                </Stack>
              </Card>
            ))}
      </Group>
      <Divider variant="dotted" />
      <Text>Please use the sidebar to navigate between pages</Text>
      <Box>
        <Group
          sx={{ justifyContent: "space-between", textTransform: "uppercase" }}
        >
          <Text weight={800} color="gray">
            New Unverified User
          </Text>
          <Anchor component={Link} to="/admin/verify" weight={800}>
            Show all
          </Anchor>
        </Group>
        <Paper sx={{ width: "100%" }}>
          <ScrollArea>
            <Group
              noWrap
              px={32}
              spacing={32}
              sx={{ 
                whiteSpace: 'nowrap',
                minWidth: "800px", height: 80,
                justifyContent: "space-between",
                "& *": {flexWrap: 'nowrap'}
              }}
            >
              {!data ? (
                <Skeleton height={56} width="100%" />
              ) : data.data.unv_users[0] ? (
                <Fragment>
                  <Group>
                    <Stack spacing={0}>
                      <Text weight={700}>ID</Text>
                      <Text>{data.data.unv_users[0].id}</Text>
                    </Stack>
                    <Avatar radius={32} size="lg" color="blue">{data.data.unv_users[0].lastName[0]}</Avatar>
                    <Stack spacing={0}>
                      <Text size="lg" weight={700}>{`${data.data.unv_users[0].lastName}, ${data.data.unv_users[0].firstName} ${data.data.unv_users[0].middleName}`}</Text>
                      <Text transform="uppercase">{data.data.unv_users[0].address1} {data.data.unv_users[0].address2} {data.data.unv_users[0].city}</Text>
                    </Stack>
                  </Group>
                  <Stack spacing={0} align="center">
                    <Text>{data.data.unv_users[0].email}</Text>
                    <Text>{data.data.unv_users[0].phone}</Text>
                  </Stack>
                  <Stack spacing={0}>
                    <Text weight={700}>Birthday</Text>
                    <Text size="sm">{dayjs(data.data.unv_users[0].birthday * 1000).format("MMMM DD, YYYY")} ({dayjs(data.data.unv_users[0].birthday * 1000).fromNow(true)} old)</Text>
                  </Stack>
                  <Stack spacing={0} align="center">
                    <Text>
                      {dayjs(data.data.unv_users[0].firstLogin).fromNow()}
                    </Text>
                    <Text>{data.data.unv_users[0].firstLogin}</Text>
                  </Stack>
                </Fragment>
              ) : (
                <Center>
                  <Text>No new unverified users</Text>
                </Center>
              )}
            </Group>
          </ScrollArea>
        </Paper>
      </Box>
      <Box>
        <Group
          sx={{ justifyContent: "space-between", textTransform: "uppercase" }}
        >
          <Text weight={800} color="gray">
            Recent Requests
          </Text>
          <Anchor component={Link} to="/admin/requests" weight={800}>
            Show all
          </Anchor>
        </Group>
        <Paper sx={{ width: "100%" }}>
          <ScrollArea>
            <Group
              noWrap
              px={32}
              spacing={32}
              sx={{
                whiteSpace: 'nowrap',
                minWidth: "800px", height: 80,
                justifyContent: "space-between",
                "& *": {flexWrap: 'nowrap'}
              }}
            >
              {!data ? (
                <Skeleton height={56} width="100%" />
              ) : data.data.requests[0] ? (
                <Fragment>
                  <Group>
                    <Stack spacing={0}>
                      <Text weight={700}>ID</Text>
                      <Text align="center">{data.data.requests[0].r_id}</Text>
                    </Stack>
                    <Avatar radius={32} size="lg" color="blue">{data.data.requests[0].lastName[0]}</Avatar>
                    <Stack spacing={0}>
                      <Text size="lg" weight={700}>{`${data.data.requests[0].lastName}, ${data.data.requests[0].firstName} ${data.data.requests[0].middleName}`}</Text>
                      <Text transform="uppercase">{data.data.requests[0].address1} {data.data.requests[0].address2} {data.data.requests[0].city}</Text>
                    </Stack>
                  </Group>
                  <Stack spacing={0}>
                    <Text weight={700}>Action</Text>
                    {data.data.requests[0].type == "deleteUser" ? (
                      <Group spacing={4}>
                        <InlineIcon icon="tabler:trash" color="orangered"/>
                        <Text>Account Deletion</Text>
                      </Group>
                    ) : ( 
                      <Group spacing={4}>
                        <InlineIcon icon="tabler:edit" color="#008cfd"/>
                        <Text>Edit Details</Text>
                      </Group>
                    )}
                  </Stack>
                  <Stack spacing={0} align="center">
                    <Text>{dayjs(data.data.requests[0].time).fromNow()}</Text>
                    <Text>{data.data.requests[0].time}</Text>
                  </Stack>
                </Fragment>
              ) : (
                <Center>
                  <Text>No new requests</Text>
                </Center>
              )}
            </Group>
          </ScrollArea>
        </Paper>
      </Box>
    </Stack>
  );
  
}

export default Dashboard;