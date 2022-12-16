import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

export type EmailSubmittedContextValue = {
  submittedEmail: string | null;
  setSubmittedEmail: (email: string) => void;
};

export const EmailSubmittedContext =
  createContext<EmailSubmittedContextValue | null>(null);

export const EmailSubmittedProvider = ({ children }: PropsWithChildren) => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const value = useMemo(
    () => ({ submittedEmail, setSubmittedEmail }),
    [submittedEmail, setSubmittedEmail],
  );

  return (
    <EmailSubmittedContext.Provider value={value}>
      {children}
    </EmailSubmittedContext.Provider>
  );
};

export const useEmailSubmitted = () => {
  const context = useContext(EmailSubmittedContext);

  if (!context) {
    throw new Error("no EmailSubmittedContext value has been provided");
  }

  return context;
};
