import * as React from "react";

interface EmailTemplateProps {
  name: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  message,
}) => (
  <div>
    <h1>Message from {name}!</h1>
    <pre>{message}</pre>
  </div>
);

export default EmailTemplate;
