import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import {
  FormEventHandler,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { Account } from "../../main";
import {
  AddressData,
  AddressPicker,
  DataTable,
  DataTableAction,
  DataTableColumn,
  DataTableFunction,
} from "../../misc";

const Users = () => {
  const [sort, setSort] = useState("id");
  const [dir, setDir] = useState("asc");
  const [select, setSelect] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("edit");
  const [open, setOpen] = useState(false);
  const [aOpen, setAOpen] = useState(false);
  const [address, setAddress] = useState<AddressData | undefined>();
  const [searchVoter, setSearchVoter] = useState("");
  const [voter, setVoter] = useState("");
  const [debounce] = useDebouncedValue(searchVoter, 500);

  useEffect(() => {
    setAddress(undefined);
  }, [select]);

  const { data, refetch } = useQuery(["users", { sort, dir, page, search }], () => {
    return fetch(
      "/admin/api/?q=" +
        window.btoa(
          JSON.stringify({
            users: {
              search,
              sort,
              dir,
              page,
            }
          })
        )
    ).then((res) => res.json());
  });  
  
  const { data: data2 } = useQuery(["voters", { debounce }], () => {
    return fetch(
      "/admin/api/?q=" +
        window.btoa(
          JSON.stringify({
            voters: {
              search: debounce.toUpperCase(),
            },
          })
        )
    ).then((res) => res.json());
  });


  const columns: DataTableColumn[] = [
    {
      label: "ID",
      key: "id",
      sortable: true,
      width: "10ch",
      align: "right",
    },
    {
      label: "Voter",
      key: "voter",
      sortable: true,
      width: "10ch",
      align: "right",
    },
    {
      label: "Name",
      key: "lastName",
      sortable: true,
      width: "40ch",
      align: "left",
    },
    {
      label: "Email",
      key: "email",
      sortable: true,
      width: "28ch",
      align: "right",
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      width: "16ch",
      align: "right",
    },
    {
      key: "address",
      label: "Address",
      sortable: false,
      width: "24px",
      align: "left",
    }
  ];

  const functions: DataTableFunction[] = [
    {
      label: "Edit User",
      icon: "tabler:edit",
      active: ({ selected }) => selected.length === 1,
      onClick: () => {
        setOpen(true); 
        setAction("edit");
      },
    },
    {
      label: "Change / Set Voter",
      icon: "tabler:user",
      active: ({ selected }) => selected.length === 1,
      onClick: () => {  
        setOpen(true); 
        setAction("verify");
      },
    },
    {
      label: ({ selected }) =>
        "Delete " +
        selected.length +
        " item" +
        (selected.length > 1 ? "s" : "") +
        "?",
      icon: "tabler:trash",
      color: "red",
      active: ({ selected }) => selected.length > 0,
      onClick: () => {
        setOpen(true);
        setAction("delete");
      },
    },
    {
      label: "Refresh",
      icon: data ? "ic:outline-refresh" : "eos-icons:arrow-rotate",
      onClick: () => refetch(),
    },
  ];

  const actions: DataTableAction[] = [
    {
      label: "Delete",
      icon: "tabler:trash",
      color: "red",
      onClick: ({data}) => {
        setSelect([data.id!]); 
        setAction("delete"); 
        setOpen(true);
      },
    },
    {
      label: "Edit",
      icon: "tabler:edit",
      color: "blue",
      onClick: ({data}) => {
        setSelect([data.id!]); 
        setAction("edit"); 
        setOpen(true);
      },
    },
    {
      label: "Change / Set Voter",
      icon: "tabler:user",
      color: "green",
      onClick: ({data}) => {
        setSelect([data.id!]); 
        setAction("verify"); 
        setOpen(true);
      },
    },
  ];

  const submitDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    fetch("/admin/api/", {
      method: "DELETE",
      body: JSON.stringify({
        deleteUser: {
          user: select,
        },
      }),
    }).then((res) => {
      if (res.ok) {
        showNotification({
          title: "Delete user",
          message: "Users deleted",
          color: "green",
        });
        refetch();
        setOpen(false);
        return;
      } 
      showNotification({
        title: "Delete user",
        message: "Error deleting user",
        color: "red",
      });
    });
  };

  const submitEdit:FormEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const fName = form.firstName;
    const mName = form.middleName;
    const lName = form.lastName;
    const email = form.email;
    const phone = form.phone;
    const bDay = form.birthday;
    const addr = form.address;
    const button = form.go;

    const elems = [button, fName, mName, lName, email, phone, bDay, addr];
    elems.forEach((elem) => (elem.disabled = true));

    fetch("/admin/api/", {
      method: "PUT",
      body: JSON.stringify({
        updateUser: {
          id: select[0],
          firstName: fName.value,
          middleName: mName.value,
          lastName: lName.value,
          email: email.value,
          phone: phone.value,
          birthday: dayjs(bDay.value).unix(),
          ...address,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          setOpen(false);
          setAOpen(false);
          setSelect([]);
          refetch();
          showNotification({
            title: "Edited User",
            message: "User updated successfully",
            color: "green",
          });
        }
        elems.forEach((elem) => (elem.disabled = false));
        showNotification({
          title: "Edit User",
          message: "User not updated",
          color: "red",
        });
      });
  }, [address, select[0]]);

  const verifyUser = (e: MouseEvent<HTMLButtonElement>, user?: string) => {
    e.preventDefault();

    user ??= select[0];

    fetch("/admin/api/", {
      method: "PATCH",
      body: JSON.stringify({
        verifyUser: {
          id: voter,
          user,
        },
      }),
    }).then(() => {
      showNotification({
        title: "Verify User",
        message: "User verified",
        color: "green",
      });
      refetch();
      setOpen(false);
      setSelect([]);
    })
  };

  return (
    <Box>
      <DataTable
        title="Users"
        data={
          data &&
          data.data?.users?.map((u: any) => ({
            id: u.id,
            voter: (
              <Tooltip label={u.voter.name}>{u.voter.id}</Tooltip>
            ),
            lastName: `${u.lastName && u.lastName + ","} ${u.firstName} ${
              u.middleName
            }`,
            email: u.email,
            phone: u.phone,
            address: (
              <Tooltip label={`${u.address1} ${u.address2} ${u.city}, ${u.province}`}>
                <Icon icon="tabler:map-2"/>
              </Tooltip> 
            )
          }))
        }
        pages={[page, data && data.data?.total?.users?.[1]]}
        columns={columns}
        actions={actions}
        functions={functions}
        onDebouncedSearch={(search) => setSearch(search)}
        onSort={({ sort, dir }) => {
          setSort(sort);
          setDir(dir);
        }}
        selected={select}
        onPage={(page) => setPage(page)}
        onSelect={(id) => setSelect(id)}
      />
      <Modal
        opened={open}
        title={
          (action == "edit" && "Editing User") ||
          (action == "delete" &&
            `Delete ${select.length == 1 ? "a" : select.length} ${
              select.length > 1 ? "selected items" : "selected item"
            }?`)
        }
        onClose={() => setOpen(false)}
      >
        {action === "edit" && (
          <form onSubmit={submitEdit}>
            {data &&
              select[0] &&
              data.data?.users
                ?.filter((u: any) => u.id === select[0])
                .map((u: any) => {
                  const l = address;
                  !l &&
                    setAddress({
                      region: u.region,
                      province: u.province,
                      address1: u.address1,
                      address2: u.address2,
                      city: u.city,
                    });
                  return (
                    <Stack>
                      <TextInput
                        name="firstName"
                        label="First Name"
                        defaultValue={u.firstName}
                        required
                      />
                      <TextInput
                        name="middleName"
                        label="Middle Name"
                        defaultValue={u.middleName}
                        required
                      />
                      <TextInput
                        name="lastName"
                        label="Last Name"
                        defaultValue={u.lastName}
                        required
                      />
                      <TextInput
                        name="email"
                        label="Email"
                        defaultValue={u.email}
                        required
                      />
                      <TextInput
                        name="phone"
                        type="tel"
                        label="Phone"
                        defaultValue={u.phone.slice(-10)}
                        required
                        icon="+63"
                      />
                      <DatePicker
                        name="birthday"
                        label="Birthday"
                        defaultValue={dayjs(u.birthday * 1000).toDate()}
                        required
                      />
                      <TextInput
                        readOnly
                        name="address"
                        label="Address"
                        rightSectionWidth={112}
                        rightSection={
                          <Button onClick={() => setAOpen(true)}>
                            Edit Address
                          </Button>
                        }
                        value={
                          !!(l && l.region.length > 0)
                            ? `${l.address1} ${l.address2} ${l.city}, ${l.province} - ${l.region}`
                            : "No address"
                        }
                      />
                      <AddressPicker
                        opened={aOpen}
                        onClose={() => setAOpen(false)}
                        data={l as AddressData}
                        onChange={(e) => setAddress(e)}
                      />
                      <Group sx={{justifyContent: "center"}} mt={24}>
                        <Button
                          onClick={() => setOpen(false)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" name="go" variant="filled">
                          Submit
                        </Button>
                      </Group>
                    </Stack>
                  );
                })}
          </form>
        )}
        {action === "delete" && (
          <Stack>
            <Text align="center">Are you sure you want to delete the selected user?</Text>
            <Group sx={{justifyContent: "center"}} mt={24}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="outline"
                color="red"
                onClick={submitDelete}
              >
                Delete
              </Button>
            </Group>
          </Stack>
        )}
        {action === "verify" && (
          <Stack spacing={12}>
            <Text align="center">Select a voter that corresponds to this account</Text>
            <Select
              searchable
              onSearchChange={setSearchVoter}
              onChange={e => setVoter(e ?? "")}
              data={[
                {value: "NULL", label: "No voter"},
                ...(data2?.data?.voters?.map((v: any) => ({
                  label: v.name,
                  value: v.id,
                }))) || [],
              ]}
            />
            <Group sx={{justifyContent: "center"}} mt={24}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="outline"
                color="green"
                onClick={verifyUser}
              >
                Verify
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
};

export default Users;
