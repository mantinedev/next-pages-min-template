import { useUser } from "@clerk/nextjs";
import { Container } from "@mantine/core";
import Nav from "@/components/Nav/Nav";
import PageTitle from "@/components/PageTitle/PageTitle";
import { UsersList } from "@/components/UsersList/UsersList";

export default function Users() {
  const { user } = useUser();

  return (
    <Nav>
      <Container size="xl">
        <PageTitle title="Users" />
        <UsersList myId={user?.id} />
      </Container>
    </Nav>
  );
}
