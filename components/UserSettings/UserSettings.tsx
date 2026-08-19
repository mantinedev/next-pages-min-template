import {
  Card,
  Grid,
  Group,
  Loader,
  Switch,
  Text,
} from "@mantine/core";
import classes from "./UserSettings.module.css";
import { UseFormReturnType } from "@mantine/form";
import { IusersForm } from "@/pages/users";
import { KeyedMutator } from "swr";
import UsersAutocomplete from "../UsersAutocomplete/UsersAutocomplete";
import { TEMPLATE_PERMISSIONS } from "@/lib/permissions";

const data = Object.entries(TEMPLATE_PERMISSIONS).map(([schema, item]) => ({
  ...item,
  schema,
}));

interface Iprops {
  form: UseFormReturnType<IusersForm>;
  // eslint-disable-next-line no-unused-vars
  setUser: (value: string) => void;
  refreshSettings: KeyedMutator<any>;
  loading: boolean;
}
export default function UserSettings({
  form,
  setUser,
  refreshSettings,
  loading,
}: Iprops) {
  const items = data.map((item) => (
    <Group
      justify="space-between"
      className={classes.item}
      wrap="nowrap"
      gap="xl"
      key={item.title}
    >
      <div>
        <Text>{item.title}</Text>
        <Text size="xs" c="dimmed">
          {item.description}
        </Text>
      </div>
      {loading ? (
        <Loader size="sm" />
      ) : (
        <Switch
          onLabel="ON"
          offLabel="OFF"
          className={classes.switch}
          size="lg"
          {...form.getInputProps(item.schema, {
            type: "checkbox",
          })}
        />
      )}
    </Group>
  ));

  return (
    <Card withBorder radius="md" p="xl" className={classes.card} my="xl">
      <Grid>
        <Grid.Col span={6}>
          <Text fz="lg" className={classes.title} fw={500}>
            Configure permissions
          </Text>
          <Text fz="xs" c="dimmed" mt={3} mb="xl">
            Choose which permissions the selected user should have
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <UsersAutocomplete
            form={form}
            label="User"
            placeholder="User"
            schema="user"
            onOptionSubmit={(value) => {
              setUser(value);
              refreshSettings();
            }}
          />
        </Grid.Col>
      </Grid>
      {items}
    </Card>
  );
}
