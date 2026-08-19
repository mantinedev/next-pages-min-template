import Nav from "@/components/Nav/Nav";
import PageTitle from "@/components/PageTitle/PageTitle";
import UserSettings from "@/components/UserSettings/UserSettings";
import { fetcher } from "@/lib/fetcher";
import safeFetch from "@/lib/safeFetch";
import { TemplatePermissions, pickPermissions } from "@/lib/permissions";
import { Button, Container, Group } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import useSWR from "swr";

const emptyPermissions = pickPermissions(undefined);

export interface IusersForm extends TemplatePermissions {
  user: string | null;
}

export default function Users() {
  const [selectedUser, setSelectedUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    selectedUser ? [`/api/users?user=${selectedUser}`, { method: "GET" }] : null,
    ([url, options]) => fetcher(url, options)
  );

  const form = useForm<IusersForm>({
    initialValues: {
      user: null,
      ...emptyPermissions,
    },
    validate: {
      user: isNotEmpty("User is required"),
    },
  });

  useEffect(() => {
    if (data) {
      form.setValues(data as TemplatePermissions);
    } else {
      form.setValues(emptyPermissions);
    }
  }, [isLoading, data]);

  async function handleSubmit() {
    setIsSubmitting(true);
    await safeFetch([
      "/api/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.values),
      },
    ])
      .then(() => {
        setIsSubmitting(false);
        notifications.show({
          title: "Success",
          message: "User updated",
          color: "green",
        });
        form.reset();
      })
      .catch((error) => {
        setIsSubmitting(false);
        notifications.show({
          title: "Error",
          message: error,
          color: "red",
        });
      });
  }

  return (
    <Nav>
      <Container size="xl">
        <PageTitle title="User Settings" />
        <UserSettings
          form={form}
          setUser={setSelectedUser}
          refreshSettings={mutate}
          loading={isLoading}
        />
        <Group justify="center">
          <Button variant="default" onClick={form.reset}>
            Reset
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Submit
          </Button>
        </Group>
      </Container>
    </Nav>
  );
}
