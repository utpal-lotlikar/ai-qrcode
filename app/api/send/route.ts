import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const reqData = await request.json();
  try {
    const data = await resend.emails.send({
      from: "AI QRCode Webmaster <onboarding@resend.dev>",
      to: [process.env.WEBMASTER_EMAIL!],
      subject: reqData.subject,
      react: EmailTemplate({
        name: reqData.name,
        message: reqData.message,
      }) as React.ReactElement,
      // html: `<p>${reqData.message.replaceAll("\n", "<br/>")}</p>`,
    });

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error });
  }
}
