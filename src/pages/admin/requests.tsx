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
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import {
  FormEventHandler,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import {
  AddressData,
  AddressPicker,
  DataTable,
  DataTableAction,
  DataTableColumn,
  DataTableFunction,
} from "../../misc";

const Requests = () => {
  const [sort, setSort] = useState("r_id");
  const [dir, setDir] = useState("asc");
  const [select, setSelect] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("accept");
  const [open, setOpen] = useState(false);

  const { data, refetch } = useQuery(["requests", { sort, dir, page, search }], () => {
    return fetch(
      "/admin/api/?q=" +
        window.btoa(
          JSON.stringify({
            requests: {
              search,
              sort,
              dir,
              page,
            }
          })
        )
    ).then((res) => res.json());
  });

  const columns: DataTableColumn[] = [
    {
      label: "ID",
      key: "r_id",
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
      label: "Type",
      key: "type",
      sortable: true,
      width: "20ch",
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
  ];

  const submit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const target = e.currentTarget;
    target.disabled = true;

    fetch("/admin/api/", {
      method: "DELETE",
      body: JSON.stringify({
        [action + "Request"]: {
          req: action == "accept" ? select[0] : select
        }
      }),
    }).then(res => res.json())
    .then(res => {
      if (res.status == 200) {
        refetch();
        showNotification({
          title: "Request " + action + "ed",
          message: res.message,
          color: "yellow",
        });
        return
      }
      target.disabled = false;
      showNotification({
        title: "Request failed",
        message: res.message,
        color: "red",
      })
    }).catch(err => {
      target.disabled = false;
      showNotification({
        title: "Request failed",
        message: err.message,
        color: "red",
      })
      throw err
    })
  }

    


  const functions: DataTableFunction[] = [
    {
      label: "Accept Request",
      icon: "tabler:check",
      color: "orange",
      active: ({ selected }) => selected.length === 1,
      onClick: () => {
        setOpen(true); 
        setAction("accept");
      },
    },
    {
      label: ({ selected }) =>
        "Reject " +
        selected.length +
        " item" +
        (selected.length > 1 ? "s" : "") +
        "?",
      icon: "tabler:x",
      color: "red",
      active: ({ selected }) => selected.length > 0,
      onClick: () => {
        setOpen(true);
        setAction("reject");
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
      label: "Accept",
      icon: "tabler:check",
      color: "orange",
      onClick: ({ data }) => {
        setSelect([data.id!]);
        setAction("accept");
        setOpen(true);
      },
    },
    {
      label: "reject",
      icon: "tabler:edit",
      color: "blue",
      onClick: ({ data }) => {
        setSelect([data.id!]);
        setAction("reject");
        setOpen(true);
      },
    },
  ];

  return (
    <Box>
      <DataTable
        title="User Requests"
        data={
          data &&
          data.data?.requests?.map((r: any) => ({
            id: r.r_id,
            lastName: `${r.lastName && r.lastName + ","} ${r.firstName} ${
              r.middleName
            }`,
            type: (
              <Text component={Group}>
                <Text 
                  component={Icon} 
                  height={24} 
                  color={r.type == "deleteUser" ? "orange" : "blue"}
                  icon={r.type == "deleteUser" ? "tabler:trash" : "tabler:edit"} 
                />
                {r.type == "deleteUser" ? "Account Deletion" : "Edit Details"}
              </Text>
            ),
            email: r.email,
            phone: r.phone,
          }))
        }
        pages={[page, data && data.data?.total?.requests?.[1]]}
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
      <Modal opened={open} onClose={() => setOpen(false)}>
        <Stack>
          <Text>Do you want to {action} this request?</Text>
          <Stack>
            <Button variant="outline" onClick={() => setOpen(false)}>No</Button>
            <Button onClick={submit}>Yes</Button>
          </Stack>
        </Stack>
      </Modal>
    </Box>
  );
};

export default Requests;
