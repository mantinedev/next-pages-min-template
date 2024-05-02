import { Box } from "@mantine/core";

function Demo() {
  return (
    <Box
      sx={(theme, u) => ({
        padding: 40,

        [u.light]: {
          backgroundColor: theme.colors.blue[0],
          color: theme.colors.blue[9],

          "&:hover": {
            backgroundColor: theme.colors.blue[1],
          },
        },
      })}
    >
      Box with emotion sx prop
    </Box>
  );
}

export default function IndexPage() {
  return <Demo />;
}
