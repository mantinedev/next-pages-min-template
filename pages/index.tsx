import { Box } from "@mantine/core";
import { CSSProperties } from "@mantine/emotion";

function Demo({ styles: styles }: { styles: CSSProperties }) {
  return (
    <Box
      sx={(theme) => ({
        padding: 40,
        ...styles,
      })}
    >
      Box with emotion sx prop
    </Box>
  );
}

export default function IndexPage(props: { styles: CSSProperties }) {
  return <Demo styles={props.styles} />;
}

IndexPage.getInitialProps = async () => {
  const styles = {
    backgroundColor: "#e0e0e0",
    color: "#333",
    "&:hover": {
      backgroundColor: "#bdbdbd",
    },
  };

  return { styles };
};
