import { Box, Modal, Stack, Text, rem } from '@mantine/core';
import { IconAt, IconBooks, IconPhone, IconSun } from '@tabler/icons-react';

interface Iprops {
  opened: boolean;
  close: () => void;
}
interface ContactIconProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  icon: typeof IconAt;
  title: React.ReactNode;
  description: React.ReactNode;
  href?: string;
}

function ContactIcon({ icon: Icon, title, description, href, ...others }: ContactIconProps) {
  return (
    <div {...others} style={{ display: 'flex', padding: rem(4) }}>
      <Box mr="md" mt={rem(10)}>
        <Icon style={{ width: rem(24), height: rem(24) }} />
      </Box>

      <div>
        <Text size="xs">{title}</Text>
        {href ? (
          <Text component="a" href={href} target="_blank">
            {description}
          </Text>
        ) : (
          <Text>{description}</Text>
        )}
      </div>
    </div>
  );
}

export default function HelpModal({ opened, close }: Iprops) {
  const Links = [
    {
      title: 'Docs',
      description: 'View the documentation',
      icon: IconBooks,
      href: 'https://aarforms.docs.aarsleff.co.uk',
    },
    {
      title: 'Email',
      description: 'ithelp@aarsleff.co.uk',
      icon: IconAt,
      href: 'mailto:ithelp@aarsleff.co.uk?subject=AarForms%20Help',
    },
    { title: 'Phone', description: '01636 551636', icon: IconPhone, href: 'tel:01636551636' },
    { title: 'Working hours', description: '8 a.m. – 5 p.m.', icon: IconSun },
  ];

  const items = Links.map((item, index) => <ContactIcon key={index} {...item} />);

  return (
    <Modal opened={opened} onClose={close} title="Help" centered>
      <Text pb={rem(20)}>
        We are here to help. Pleaase take a look at the app documentation but if you need help feel
        free to contact us.
      </Text>
      <Stack>{items}</Stack>
    </Modal>
  );
}
