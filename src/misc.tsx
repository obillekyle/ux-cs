import { IconProps, Icon } from "@iconify/react";
import {
  useMantineTheme,
  Table,
  Group,
  Space,
  Center,
  Text,
  Box,
  ScrollArea,
  Paper,
  ActionIcon,
  Checkbox,
  DefaultMantineColor,
  Stack,
  Menu,
  Tooltip,
  Modal,
  Select,
  TextInput,
} from "@mantine/core";
import { BoxSx } from "@mantine/core/lib/components/Box/use-sx/use-sx";
import { useDebouncedValue, useIntersection } from "@mantine/hooks";
import { CircularProgress } from "@mui/material";
import { useState, useEffect, Fragment, useLayoutEffect, useMemo } from "react";
import loc from "./pages/geoloc.json";

export type DataTableColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  align?: "left" | "right" | "center";
};

export type DataTableFunction = {
  label?: 
    | ((opts: { page: number; selected: string[] }) => string) 
    | string;
  props?: IconProps;
  color?: DefaultMantineColor;
  icon: string;
  active?: 
    | ((opts: { page: number; selected: string[] }) => boolean) 
    | boolean;
  onClick: (opts: { page: number; selected: string[] }) => any;
};

export type DataTableAction = {
  label?:
    | ((opts: { page: number; data: DataTableData | number }) => string)
    | string;
  props?: IconProps;
  color?: DefaultMantineColor;
  icon: string;
  active?: 
    | ((opts: { page: number; data: DataTableData }) => boolean) 
    | boolean;
  onClick: (opts: { page: number; data: DataTableData }) => any;
};

export type DataTableData = {
  id?: string;
  [key: string]: any;
};

export type DataTableInitialValues = {
  sort?: string;
  dir?: "asc" | "desc";
  page?: number;
  search?: string;
  selected?: string[];
};

export type DataTableProps = {
  title?: string;
  onSelect?: (ids: string[]) => void;
  onPage?: (page: number) => void;
  onSearch?: (query: string) => void;
  onDebouncedSearch?: (query: string) => void;
  hasNextPage?: boolean | ((page: number) => boolean);
  onEndScroll?: (opts: {
    elem: HTMLTableRowElement;
    observer: IntersectionObserverEntry;
  }) => void;
  onSort?: (opts: { sort: string; dir: string }) => void;
  selected: string[];
  itemHeight?: number;
  noHeader?: boolean;
  noFooter?: boolean;
  pages?: [number, number?];
  initialValue?: DataTableInitialValues;
  actions?: DataTableAction[];
  columns: DataTableColumn[];
  data?: DataTableData[] | null;
  functions?: DataTableFunction[];
  readonly?: boolean;
  radius?: number;
  sx?: BoxSx;
};

/**
 * `title?`: Table Title Header\
 * `onSelect?`: Function to call when a row is selected\
 * `onPage?`: Function to call when a page is changed\
 * `onSearch?`: Function to call when a search is performed\
 * `onSort?`: Function to call when a sort is performed\
 * `onEndScroll?`: Function to call when the table reaches the end\
 * `hasNextPage?`: Determine if there is a next page\
 * `itemHeight?`: Height of each row\
 * `noHeader?`: Do not show the header\
 * `noFooter?`: Do not show the footer\
 * `pages[current, total?]?`: Sets the page and the total number of pages\
 * `initialValue?`: Initial values to set\
 * `actions?`: Actions to show in the row in menus\
 * `columns`: Columns to show\
 * `data`: Data to show\
 * `functions?`: Functions to show in the row\
 * `readonly?`: Do not allow the user to interact with the table\
 * `radius?`: Radius of the table\
 * `sx?`: Style to apply to the table\
 */
export const DataTable = ({
  columns,
  data,
  readonly,
  actions,
  ...p
}: DataTableProps) => {
  const theme = useMantineTheme();
  const [sort, setSort] = useState(p.initialValue?.sort || columns[0].key);
  const [dir, setDir] = useState(p.initialValue?.dir || "asc");
  const [page, setPage] =
    p.pages?.[0] && p.onPage
      ? [p.pages[0], p.onPage]
      : useState(p.initialValue?.page || 1);
  const [search, setSearch] = useState(p.initialValue?.search || "");
  const [debounce] = useDebouncedValue(search, 500);
  const [select, setSelect] =
    p.selected && p.onSelect
      ? [p.selected, p.onSelect]
      : useState(p.initialValue?.selected || []);
  const [ref, observer] = useIntersection<HTMLTableRowElement>({
    threshold: 1,
  });

  useEffect(() => {
    p.onSort && p.onSort({ sort, dir });
  }, [sort, dir]);

  useEffect(() => {
    p.onPage && p.onPage(page);
    setSelect([]);
  }, [page]);

  useEffect(() => {
    p.onSearch && p.onSearch(search);
  }, [search]);

  useEffect(() => {
    p.onDebouncedSearch && p.onDebouncedSearch(debounce);
  }, [debounce]);

  useEffect(() => {
    p.onSelect && !p.selected && p.onSelect(select);
  }, [select]);

  useEffect(() => {
    p.onEndScroll &&
      observer &&
      observer?.isIntersecting &&
      p.onEndScroll({ elem: observer.target as any, observer });
  }, [observer?.isIntersecting]);

  const height = p.itemHeight || 56;
  const toggleSelect = (id: any) =>
    !readonly && select.includes(id)
      ? setSelect(select.filter((s) => s !== id))
      : setSelect([...select, id]);
  const span = columns.length + (readonly ? 0 : 1) + (actions ? 1 : 0);

  const functions = useMemo(
    () =>
      p.functions?.map((f, i) => (
        <ActionIcon
          variant="transparent"
          key={i}
          size="lg"
          color={f.color}
          disabled={
            !(typeof f.active == "function"
              ? f.active({ page, selected: select })
              : f.active ?? true)
          }
          onClick={() => f.onClick({ page, selected: select })}
        >
          <Tooltip
            label={
              typeof f.label == "function"
                ? f.label({ page, selected: select })
                : f.label
            }
          >
            <Icon {...f.props} icon={f.icon} height={24} />
          </Tooltip>
        </ActionIcon>
      )),
    [p.functions]
  );

  console.log((<div ref={ref}/>).props)

  const items = useMemo(
    () => (
      <Fragment>
        {data?.map((rest, i: number) => {
          const id: any = rest.id ?? i;
          return (
            <tr
              ref={data.length - 1 === i ? ref : undefined}
              key={id}
              onClick={() =>
                select.length >= 1 && !readonly && toggleSelect(id)
              }
              onDoubleClick={() =>
                !readonly &&
                (select.length == 0 ? setSelect([id]) : toggleSelect(id))
              }
              style={
                select.includes(id)
                  ? {
                      background: theme.fn.rgba(
                        theme.colors[theme.primaryColor][6],
                        0.1
                      ),
                    }
                  : undefined
              }
            >
              {columns.map(({ key, align }, i) => (
                <Fragment key={i}>
                  {i === 0 && !readonly && (
                    <td>
                      <Checkbox
                        px={12}
                        checked={select.includes(id)}
                        onChange={() => toggleSelect(id)}
                      />
                    </td>
                  )}
                  <td key={key} align={align} height={height}>
                    <Box px={12}>{rest[key]}</Box>
                  </td>
                  {i === columns.length - 1 && actions && (
                    <td width={64} align="center">
                      <Menu
                        control={
                          <ActionIcon variant="transparent" size="lg">
                            <Icon icon="tabler:dots-vertical" />
                          </ActionIcon>
                        }
                        gutter={-24}
                        transition="scale-y"
                        size="sm"
                      >
                        {actions.map((a, i) => (
                          <Menu.Item
                            key={i}
                            color={a.color}
                            icon={<Icon icon={a.icon} />}
                            disabled={
                              !(typeof a.active == "function"
                                ? a.active({ page, data: rest })
                                : a.active ?? true)
                            }
                            onClick={() => a.onClick({ page, data: rest })}
                          >
                            {typeof a.label == "function"
                              ? a.label({ page, data: rest })
                              : a.label}
                          </Menu.Item>
                        ))}
                      </Menu>
                    </td>
                  )}
                </Fragment>
              ))}
            </tr>
          );
        })}
        {(data?.length ?? 0) <= 10 &&
          p.onEndScroll &&
          (typeof p.hasNextPage == "function"
            ? p.hasNextPage(page)
            : p.hasNextPage) && (
            <tr ref={ref}>
              <td colSpan={span} height={height}>
                <Center component={Stack}>
                  <CircularProgress />
                </Center>
              </td>
            </tr>
          )}
        {data === undefined && (
          <tr>
            <td colSpan={span} height={height * 10}>
              <Center>
                {observer?.isIntersecting ? (
                  <CircularProgress />
                ) : (
                  <Text color="gray">Load More...</Text>
                )}
              </Center>
            </td>
          </tr>
        )}
        {data === null ||
          (data?.length == 0 && (
            <tr>
              <td colSpan={span} height={height * 10}>
                <Center component={Stack}>
                  <Icon
                    icon="flat-color-icons:answers"
                    style={{ filter: "grayscale(1)" }}
                    height={48}
                  />
                  <Text color="gray">No items found</Text>
                </Center>
              </td>
            </tr>
          ))}
        {data && data.length != 0 &&
          [...Array(10 - data.length)].map((k, i) => (
            <tr key={i}>
              <td colSpan={span} height={height} />
            </tr>
          ))}
      </Fragment>
    ),
    [select, data]
  );

  const allColumns = useMemo(
    () =>
      columns.map(({ label, key, sortable, width, align }, i) => (
        <Fragment key={i}>
          {i === 0 && !readonly && (
            <th style={{ width: 1 }}>
              <Checkbox
                px={12}
                indeterminate={
                  select.length > 0 && select.length < (data?.length ?? 0)
                }
                checked={
                  select.length > 0 
                  ? select.length == data?.length
                  : false 
                }
                onChange={() =>
                  setSelect(
                    select.length == data?.length
                      ? []
                      : data?.map((d) => d.id ?? (i as any)) ?? []
                  )
                }
              />
            </th>
          )}
          <th
            style={{ minWidth: width }}
            onClick={
              sort == key
                ? () => setDir(dir == "asc" ? "desc" : "asc")
                : () => setSort(key)
            }
          >
            {sortable ? (
              <Group
                spacing={4}
                px={12}
                sx={{
                  flexWrap: "nowrap",
                  flexDirection: align === "right" ? "row-reverse" : "row",
                }}
              >
                <Text>{label}</Text>
                <Space sx={{ flexGrow: 1 }} />
                <Icon
                  opacity={sort == key ? 1 : 0}
                  icon="tabler:arrow-up"
                  vFlip={dir === "asc"}
                />
              </Group>
            ) : (
              <Text align={align} px={8}>
                {label}
              </Text>
            )}
          </th>
          {i === columns.length - 1 && actions && <th style={{ width: 64 }} />}
        </Fragment>
      )),
    [sort, dir, columns, readonly, data, select]
  );

  return (
    <Box
      sx={{
        border:
          "2px solid " +
          (theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[3]),
        borderRadius: p.radius ?? 4,
        ...p.sx,
      }}
    >
      {!p.noHeader && (
        <Paper px={12}>
          <Group sx={{ justifyContent: "space-between", minHeight: height }}>
            <Group sx={{ alignItems: "center" }}>
              <Text size="lg">{p.title}</Text>
            </Group>
            {!readonly && (
              <Group sx={{ alignItems: "center" }} spacing={6}>
                {functions}
                <TextInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Group>
            )}
          </Group>
        </Paper>
      )}
      <ScrollArea>
        <Table
          horizontalSpacing={0}
          sx={{
            "& tr:nth-child(even)": {
              backgroundColor: "#9991",
            },
          }}
        >
          <thead>
            <Paper
              component="tr"
              px={12}
              sx={{
                display: "table-row",
                "& th:not(:last-child) > *": {
                  borderRight: "1px solid #9994",
                },
              }}
            >
              {allColumns}
            </Paper>
          </thead>
          <tbody style={{ height }}>{items}</tbody>
        </Table>
      </ScrollArea>
      <Paper>
        <Group sx={{ borderTop: "1px solid #9994" }} p={8}>
          {select?.length > 0 ? (
            <Text>
              Selected {select.length} item{select.length > 1 && "s"}
            </Text>
          ) : (
            <Text>No items selected</Text>
          )}
          <Group spacing={4} ml="auto" sx={{ userSelect: "none" }}>
            <Text>
              Page {page}
              {p.pages?.[1] == 0 ? "" : "/" + (p.pages?.[1] ?? 1)}
            </Text>
            <Icon
              icon="tabler:chevron-left"
              height={24}
              onClick={() => setPage(page == 1 ? 1 : page - 1)}
              color={page - 1 == 0 ? "gray" : undefined}
            />
            <Icon
              icon="tabler:chevron-right"
              height={24}
              onClick={() =>
                setPage(page >= (p.pages?.[1] ?? page + 1) ? page : page + 1)
              }
              color={page == (p.pages?.[1] ?? page + 1) ? "gray" : undefined}
            />
          </Group>
        </Group>
      </Paper>
    </Box>
  );
};

export type AddressData = {
  region: string;
  province: string;
  city: string;
  address2: string;
  address1: string;
};

export type AddressPickerProps = {
  data: AddressData;
  opened: boolean;
  onClose: () => void;
  onChange?: (data: AddressData) => void;
};

export const AddressPicker = ({
  data,
  opened = false,
  onClose,
  onChange,
}: AddressPickerProps) => {
  const regionOpts = Object.keys(loc)
    .sort()
    .map((key) => ({ value: key, label: (loc as any)[key].region_name }));
  const provinceOpts = Object.keys(
    (loc as any)[data.region]?.["province_list"] ?? {}
  )?.map((key) => ({ value: key, label: key }));
  const cityOpts = Object.keys(
    (loc as any)[data.region]?.["province_list"]?.[data.province]?.[
      "municipality_list"
    ] ?? {}
  )?.map((key) => ({ value: key, label: key }));
  const barangayOpts =
    (loc as any)[data.region]?.["province_list"]?.[data.province]?.[
      "municipality_list"
    ]?.[data.city]?.["barangay_list"]?.map((key: any) => ({
      value: key,
      label: key,
    })) ?? [];

  useEffect(() => {
    onChange && onChange(data);
  }, []);

  return (
    <Modal opened={opened} onClose={onClose} title="Set Address">
      <Select
        clearable
        searchable
        label="Region"
        value={data.region}
        data={regionOpts}
        onChange={(e) => onChange?.({ ...data, region: e ?? data.region })}
        required
      />
      <Select
        clearable
        searchable
        label="Province"
        value={data.province}
        data={provinceOpts}
        onChange={(e) => onChange?.({ ...data, province: e ?? data.province })}
        required
        disabled={data.region.length == 0}
      />
      <Select
        clearable
        searchable
        label="City"
        value={data.city}
        data={cityOpts}
        onChange={(e) => onChange?.({ ...data, city: e ?? data.city })}
        required
        disabled={data.province.length == 0}
      />
      <Select
        clearable
        searchable
        label="Barangay"
        value={data.address2}
        data={barangayOpts}
        onChange={(e) => onChange?.({ ...data, address2: e ?? data.address2 })}
        required
        disabled={data.city.length == 0}
      />
      <TextInput
        label="House No /Bldg No / Street"
        value={data.address1}
        onChange={(e) =>
          onChange?.({ ...data, address1: e.target.value ?? data.address1 })
        }
        required
        disabled={data.address2.length == 0}
      />
    </Modal>
  );
};
