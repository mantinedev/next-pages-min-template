import { fetcher } from "@/lib/fetcher";
import {
  Avatar,
  Group,
  Loader,
  TextInput,
  Text,
  Select,
  SelectProps,
  MultiSelect,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import useSWR from "swr";
import { useState } from "react";
import { getInitials } from "@/lib/getInitials";


interface Iprops<T> {
  form: UseFormReturnType<T>;
  label: string;
  placeholder?: string;
  schema: string;
  multiSelect?: boolean;
  style?: any;
  // eslint-disable-next-line no-unused-vars
  onOptionSubmit?: (value: string) => void;
}

export default function UsersAutocomplete<T extends unknown>({
  form,
  label,
  placeholder,
  schema,
  onOptionSubmit,
  multiSelect = false,
  style,
}: Iprops<T>) {
  const [searchVal, setSearchVal] = useState("");
  const { data, error, isLoading } = useSWR("/api/clerkUsers", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });

  if (isLoading)
    return (
      <TextInput
        leftSectionPointerEvents="none"
        leftSection={<Loader size="sm" />}
        label={label}
        placeholder="Loading ..."
        disabled
        style={style}
      />
    );

  if (error)
    return (
      <TextInput label={label} error="Failed to load" disabled style={style} />
    );

  const renderAutocompleteOption: SelectProps["renderOption"] = ({
    option,
  }) => {
    const optionUser = data.find((u: any) => u.id === option.value);
    if (!optionUser) return null;
    return (
      <Group gap="sm">
        <Avatar size={36} radius="xl" color="#005fae" src={optionUser.imageUrl}>
          {getInitials(optionUser.name)}
        </Avatar>
        <div>
          <Text size="sm">{optionUser.name}</Text>
          <Text size="xs" opacity={0.5}>
            {optionUser.email}
          </Text>
        </div>
      </Group>
    );
  };

  const users = data.map((user: any) => ({
    value: user.id,
    label: user.name,
  }));

  const props = {
    label,
    placeholder,
    data: users,
    renderOption: renderAutocompleteOption,
    limit: 2,
    onOptionSubmit,
    searchable: true,
    key: form.key(schema),
    style: style,
    ...form.getInputProps(schema, { type: "input" }),
  };

  if (multiSelect) {
    return <MultiSelect {...props} />;
  } else {
    return (
      <Select
        {...props}
        clearable
        searchValue={searchVal}
        onSearchChange={setSearchVal}
        nothingFoundMessage="No users found"
      />
    );
  }
}
