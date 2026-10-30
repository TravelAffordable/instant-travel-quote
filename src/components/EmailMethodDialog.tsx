import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Globe } from 'lucide-react';
import {
  EMAIL_METHOD_EVENT,
  EmailDraft,
  EmailOpenMethod,
  openWithMethod,
  saveEmailMethod,
} from '@/lib/emailOpener';

/**
 * Global dialog that asks once how booking emails should be opened:
 * the Gmail app or Gmail on the web. The choice is remembered on the device.
 */
export function EmailMethodDialog() {
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<EmailDraft>).detail;
      if (detail) setDraft(detail);
    };
    window.addEventListener(EMAIL_METHOD_EVENT, handler);
    return () => window.removeEventListener(EMAIL_METHOD_EVENT, handler);
  }, []);

  const choose = (method: EmailOpenMethod) => {
    if (!draft) return;
    if (remember) saveEmailMethod(method);
    openWithMethod(draft, method);
    setDraft(null);
  };

  return (
    <AlertDialog open={!!draft} onOpenChange={(open) => !open && setDraft(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>How would you like to open your email?</AlertDialogTitle>
          <AlertDialogDescription>
            Your booking details are ready to send. Choose how to open the email — we'll remember
            your choice on this device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2 py-2">
          <Checkbox
            id="remember-email-method"
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
          />
          <label
            htmlFor="remember-email-method"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Remember my choice
          </label>
        </div>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => choose('app')} className="gap-2">
            <Mail className="h-4 w-4" />
            Gmail app
          </Button>
          <Button onClick={() => choose('web')} className="gap-2">
            <Globe className="h-4 w-4" />
            Gmail web
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
