import { Icon } from "@iconify/react"
import { Text, Stack, Container, Title, Group, Switch, Select, useMantineTheme } from "@mantine/core"
import { useContext } from "react"
import { defaultHeaderHeight, Settings } from "../../main"

const SettingsPage = () => {
  const settings = useContext(Settings)
  const theme = useMantineTheme()

  return (
    <Container>
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
    </Container>
  )
}

export default SettingsPage