import { useEffect, useRef, useState } from 'react';
// import * as Sentry from "@sentry/nextjs";
import { IconSpeakerphone } from '@tabler/icons-react';
import { LinksGroup } from '../SideNav/NavbarLinksGroup/NavbarLinksGroup';

export default function FeedbackButton() {
  const [feedback, setFeedback] = useState<any | undefined>(undefined);
  // Read `getFeedback` on the client only, to avoid hydration errors during server rendering
  // useEffect(() => {
  //   setFeedback(Sentry.getFeedback());
  // }, []);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (feedback && buttonRef.current) {
      const unsubscribe = feedback.attachTo(buttonRef.current, {
        colorScheme: 'system',
        showBranding: false,
        isEmailRequired: false,
        isNameRequired: true,
        useSentryUser: {
          name: 'name',
          email: 'email',
        },
        formTitle: 'Send us your feedback',
        submitButtonLabel: 'Submit',
        messagePlaceholder: "What's the bug? What would make this better?",
      });
      return unsubscribe;
    }
    return () => {};
  }, [feedback]);

  return <LinksGroup icon={IconSpeakerphone} label={'Feedback'} ref={buttonRef} />;
}
