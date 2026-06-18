import {
  IconApps,
  IconDatabase,
  IconHelp,
  IconHome,
  IconLock,
  IconNotes,
  IconUser,
} from '@tabler/icons-react';
import { ScrollArea } from '@mantine/core';
import { useAuth, useUser } from '@clerk/nextjs';
import { LinksGroup, type LinksGroupProps } from './NavbarLinksGroup/NavbarLinksGroup';
import { UserButton } from './UserButton/UserButton';
import classes from './SideNav.module.css';
import FeedbackButton from '../FeedbackButton/FeedbackButton';

export const createLinkData = (
  email?: string | null,
  admin?: boolean | null,
  userAdmin?: boolean | null,
): LinksGroupProps[] => {
  const briefingLink = email?.includes('centrumpile.co.uk')
    ? '/forms/BriefingRegisterCentrum'
    : '/forms/BriefingRegister';

  const timesheetName = () => {
    switch (email?.split('@')?.[1]) {
      case 'cannonpiling.com':
        return 'Cannon Timesheet';
      default:
        return 'AarTime';
    }
  };

  const timesheetLink = () => {
    switch (email?.split('@')?.[1]) {
      case 'cannonpiling.com':
        return 'https://timesheet.cannonpiling.com/';
      default:
        return 'https://aartime.aarsleff.co.uk';
    }
  };

  const links: LinksGroupProps[] = [
    { label: 'Home', icon: IconHome, link: '/' },
    {
      label: 'Forms',
      icon: IconNotes,
      forceOpen: true,
      links: [
        { label: 'Goods Received', link: '/forms/egr' },
        { label: 'Briefing Register', link: briefingLink },
        { label: 'Goods Returned', link: '/forms/GoodsReturned' },
        { label: 'Site Paperwork', link: '/forms/SitePaperwork' },
        { label: 'Vehicle Checks', link: '/forms/VehicleChecks' },
      ],
    },
    { label: 'Data', icon: IconDatabase, link: '/data' },
  ];

  if (admin) {
    links.push({
      label: 'Admin',
      icon: IconLock,
      forceOpen: false,
      links: [
        { label: 'Vehicle Users', link: '/vehicle-users' },
        { label: 'Export', link: '/export' },
        { label: 'Stats', link: '/stats' },
      ],
    });
  }

  if (userAdmin) {
    links.push({ label: 'Users', icon: IconUser, link: '/users' });
  }

  links.push(
    {
      label: 'Other Apps',
      icon: IconApps,
      links: [
        { label: timesheetName(), link: timesheetLink() },
        {
          label: 'AarCompliance',
          link: 'https://aarcompliance.aarsleff.co.uk',
        },
        { label: 'AarAudit', link: 'https://aaraudit.aarsleff.co.uk' },
        {
          label: 'SRW Production',
          link: 'https://aar-production-srw.vercel.app',
        },
        {
          label: 'AarForms',
          link: 'https://aarforms.aarsleff.co.uk',
        },
      ],
    },
    { label: 'Docs', icon: IconHelp, link: '/docs' },
  );

  return links;
};

export default function SideNav() {
  const { user } = useUser();
  const { sessionClaims } = useAuth();
  const linkData = createLinkData(
    user?.primaryEmailAddress?.emailAddress,
    sessionClaims?.metadata?.admin,
    sessionClaims?.metadata?.user_admin,
  );
  const links = linkData.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          {links}
          <FeedbackButton />
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
