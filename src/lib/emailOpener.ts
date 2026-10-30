export type EmailOpenMethod = 'app' | 'web';

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
}

const PREF_KEY = 'ta_email_open_method';
export const EMAIL_METHOD_EVENT = 'ta:choose-email-method';

export function getSavedEmailMethod(): EmailOpenMethod | null {
  try {
    const saved = localStorage.getItem(PREF_KEY);
    return saved === 'app' || saved === 'web' ? saved : null;
  } catch {
    return null;
  }
}

export function saveEmailMethod(method: EmailOpenMethod) {
  try {
    localStorage.setItem(PREF_KEY, method);
  } catch {
    // storage unavailable — preference simply won't persist
  }
}

export function openWithMethod(draft: EmailDraft, method: EmailOpenMethod) {
  if (method === 'web') {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(draft.to)}&su=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
    window.open(url, '_blank');
  } else {
    // mailto opens the device's email app (Gmail app on Android when installed)
    window.location.href = `mailto:${draft.to}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  }
}

/**
 * Opens a booking email using the visitor's saved preference.
 * If no preference exists yet, asks via the global choice dialog.
 */
export function openEmailDraft(draft: EmailDraft) {
  const saved = getSavedEmailMethod();
  if (saved) {
    openWithMethod(draft, saved);
    return;
  }
  window.dispatchEvent(new CustomEvent<EmailDraft>(EMAIL_METHOD_EVENT, { detail: draft }));
}
