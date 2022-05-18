import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
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
  useContext,
  useEffect,
  useMemo,
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

const Voters = () => {
  const [sort, setSort] = useState("id");
  const [dir, setDir] = useState("asc");
  const [select, setSelect] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("edit");
  const [open, setOpen] = useState(false);
  const [aOpen, setAOpen] = useState(false);
  const [address, setAddress] = useState<AddressData | undefined>();
  const [searchUser, setSearchUser] = useState("");
  const [user, setUser] = useState("");
  const [debounce] = useDebouncedValue(searchUser, 500);

  useEffect(() => {
    setAddress(undefined);
  }, [select]);

  const { data, refetch } = useQuery(["voters", { sort, dir, page, search }], () => {
    return fetch(
      "/admin/api/?q=" +
        window.btoa(
          JSON.stringify({
            voters: {
              search,
              sort,
              dir,
              page,
            }
          })
        )
    ).then((res) => res.json());
  });

  const { data: data2 } = useQuery(["users", { debounce }], () => {
    return fetch(
      "/admin/api/?q=" +
        window.btoa(
          JSON.stringify({
            users: {
              search: debounce,
            },
            unv_users: {
              search: debounce,
            }
          })
        )
    ).then((res) => res.json());
  });

  const usersData = useMemo(() => {
    return [
      {value: "NULL", label: "No voter"},
      ...(data2?.data?.users?.map((v: any) => ({
        label: `${v.lastName ? (v.lastName + ", ") : ""}${v.firstName} ${v.middleName}`,
        value: v.id,
      })) || []),
      ...(data2?.data?.unv_users?.map((v: any) => ({
        label: `${v.lastName ? (v.lastName + ", ") : ""}${v.firstName} ${v.middleName}`,
        value: v.id,
      })) || []),
    ];
  }, [data2]);

  const tableData = useMemo(() => {
    return data &&
    data.data?.voters?.map((v: any) => ({
      id: v.id,
      prec_id: v.prec_id,
      no: v.no,
      name: v.name,
      state: v.state,
      address: v.address,
      status: (
        <Text weight={700} color={v.status == "1" ? "green" : "orange"}>
          {v.status == "1" ? "Active" : "Inactive"}
        </Text>
      )
    }))
  },[data])


  const columns: DataTableColumn[] = [
    {
      label: "ID",
      key: "id",
      sortable: true,
      width: "10ch",
      align: "right",
    },
    {
      label: "Precinct",
      key: "prec_id",
      sortable: true,
      width: "8ch",
      align: "right",
    },
    {
      label: "#",
      key: "no",
      sortable: true,
      width: "10ch",
      align: "right",
    },
    {
      label: "State",
      key: "state",
      sortable: true,
      width: "8ch",
      align: "right",
    },
    {
      label: "Name",
      key: "name",
      sortable: true,
      width: "36ch",
      align: "left",
    },
    {
      label: "Address",
      key: "address",
      sortable: true,
      width: "28ch",
      align: "right",
    },
    {
      label: "Status",
      key: "status",
      sortable: true,
      width: "10ch",
      align: "right",
    },
  ];

  const functions: DataTableFunction[] = [
    {
      label: "Edit Voter",
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
      label: "Create New Voter",
      icon: "tabler:plus",
      color: "green",
      onClick: () => {
        setOpen(true);
        setAction("create");
      }
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
      onClick: ({ data }) => {
        setSelect([data.id!]);
        setAction("delete");
        setOpen(true);
      },
    },
    {
      label: "Edit",
      icon: "tabler:edit",
      color: "blue",
      onClick: ({ data }) => {
        setSelect([data.id!]);
        setAction("edit");
        setOpen(true);
      },
    },
    {
      label: "Change / Set Voter",
      icon: "tabler:user",
      color: "green",
      onClick: ({ data }) => {
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
        deleteVoter: {
          user: select,
        },
      }),
    }).then((res) => {
      if (res.ok) {
        showNotification({
          title: "Delete voter",
          message: "Users deleted",
          color: "green",
        });
        refetch();
        setOpen(false);
        return;
      } 
      showNotification({
        title: "Delete voter",
        message: "Error deleting voter",
        color: "red",
      });
    });
  };

  const submitEdit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const name = form.elements.namedItem("name") as HTMLInputElement;
    const precinct = form.precinct;
    const no = form.no;
    const status = form.status;
    const state = form.state;
    const addr = form.address;
    const button = form.go;

    const elems = [button, name, precinct, no, status, state, addr];
    elems.forEach((elem) => (elem.disabled = true));

    fetch("/admin/api/", {
      method: action == "create" ? "POST" : "PUT",
      body: JSON.stringify({
        [action + "Voter"]: {
          id: select[0] ?? 0,
          name: name.value.toUpperCase(),
          precinct: precinct.value,
          no: no.value,
          status: status.value,
          state: state.value.toUpperCase(),
          address: addr.value.toUpperCase(),
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
            title: "Voter",
            message: "Successfully modified",
            color: "green",
          });
          return;
        }
        elems.forEach((elem) => (elem.disabled = false));
        showNotification({
          title: "Voter",
          message: "Voter not modified: " + res.message,
          color: "red",
        });
      });
  };

  const verifyUser = (e: MouseEvent<HTMLButtonElement>, user?: string) => {
    e.preventDefault();

    user ??= select[0];

    fetch("/admin/api/", {
      method: "PATCH",
      body: JSON.stringify({
        verifyUser: {
          id: select[0],
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
        title="Voters"
        data={tableData}
        pages={[page, data && data.data?.total?.voters?.[1]]}
        columns={columns}
        actions={actions}
        functions={functions}
        onDebouncedSearch={(search) => setSearch(search.toUpperCase())}
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
          (action == "edit" && "Editing Voter") ||
          (action == "delete" &&
            `Delete ${select.length == 1 ? "a" : select.length} ${
              select.length > 1 ? "selected items" : "selected item"
            }?`)
        }
        onClose={() => setOpen(false)}
      >
        {(action === "edit" || action === "create") && (
          <form onSubmit={submitEdit}>
            {action == "edit" && data &&
              select[0] &&
              data.data?.voters
                ?.filter((u: any) => u.id === select[0])
                .map((u: any) => {
                  const l = address;
                  return (
                    <Stack>
                      <TextInput
                        name="name"
                        label="Full Name"
                        defaultValue={u.name}
                        required
                      />
                      <Group grow spacing={6}>
                        <TextInput
                          name="precinct"
                          label="Precinct"
                          defaultValue={u.prec_id}
                          required
                        />
                        <NumberInput
                          name="no"
                          label="#"
                          min={1}
                          hideControls
                          defaultValue={parseInt(u.no)}
                          required
                        />
                        <TextInput
                          name="state"
                          label="State"
                          defaultValue={u.state}
                        />
                        <Select
                          name="status"
                          label="Is Active?"
                          defaultValue={u.status}
                          data={[
                            { label: "Active", value: "1" },
                            { label: "Inactive", value: "0" },
                          ]}
                        />
                      </Group>
                      <TextInput
                        name="address"
                        label="address"
                        defaultValue={u.address}
                        required
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
                }
              )
            }
            {action == "create" && data && 
              <Stack>
                <TextInput
                  name="name"
                  label="Full Name"
                  required
                />
                <Group grow spacing={6}>
                  <TextInput
                    name="precinct"
                    label="Precinct"
                    required
                  />
                  <NumberInput
                    name="no"
                    label="#"
                    min={1}
                    hideControls
                    required
                  />
                  <TextInput
                    name="state"
                    label="State"
                  />
                  <Select
                    name="status"
                    label="Is Active?"
                    data={[
                      { label: "Active", value: "1" },
                      { label: "Inactive", value: "0" },
                    ]}
                  />
                </Group>
                <TextInput
                  name="address"
                  label="Address"
                  required
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
            }
          </form>
        )}
        {action === "delete" && (
          <Stack>
            <Text align="center">Are you sure you want to delete the selected voter?</Text>
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
            <Text align="center">Select a user that will be connected to this voter</Text>
            <Select
              searchable
              onSearchChange={setSearchUser}
              onChange={e => setUser(e ?? "")}
              data={usersData}
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

export default Voters;
