import { CreateEmailOptions, Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

export async function sendMail(options: CreateEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: "takie.eldeen1998@gmail.com",
    ...options,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}

export const generateMailTemplate = ({
  title,
  user,
  content,
  actionSubtitle,
  actionLink,
  actionTitle,
}: {
  title?: string;
  user?: string;
  content?: string;
  actionSubtitle?: string;
  actionLink?: string;
  actionTitle?: string;
}) => {
  return `<!DOCTYPE html>
<html lang="ar" dir="${"ltr"}">
  <head>
    <meta charset="UTF-8" />
    <title>${title ?? "--"}</title>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');

      body, p, h1, h4, a {
        font-family: 'Cairo', Arial, sans-serif;
      }
    </style>
  </head>
  <body style="margin:12px; padding:8px; background-color:#0d181c; font-family: Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 80px;">
          <table role="presentation" dir="${"ltr"}" cellpadding="0" cellspacing="0" width="600" style="background-color:#111e22; color:#ffffff; padding:20px; border-radius:6px; text-align:${"left"};">
            
            <tr>
              <td align="center" style="padding-bottom:12px; border-bottom:1px solid #555;">
                <img src="https://uqpumrtyzgbrmjwnvcud.supabase.co/storage/v1/object/sign/massar-bucket/FULL_DARK.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMDQyYWVlOS05YjQzLTRmZjctYWJhMC01YTAxMDU0NTQ2MDgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXNzYXItYnVja2V0L0ZVTExfREFSSy5wbmciLCJpYXQiOjE3Njc5ODI3MDcsImV4cCI6MTc5OTUxODcwN30.N2s5mKzGjBM1oc4aZNXM6BGmN0e-B9uM7IVb7chbkho" alt="Massar Logo" width="150" style="display:block;" />
              </td>
            </tr>

            <tr>
              <td style="padding:24px;">
                <h1 style="color:#ffffff; font-size:24px; margin:0; font-weight:bold;">${
                  title ?? "--"
                }</h1>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px;">
                <h4 style="color:#dddddd; margin:0; font-size:16px;">${"Welcome "}, ${
    user ?? "--"
  }</h4>
              </td>
            </tr>

            <tr>
              <td style="padding:6px 24px;">
                <p style="color:#bbbbbb; margin:0; font-size:14px;">
                  ${content ?? "--"}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 24px;">
                <p style="color:#bbbbbb; margin:0; font-size:14px;">
                  ${actionSubtitle ?? "--"}
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:20px 0;">
                <a href="${actionLink ?? "/"}" 
                  style="background-color:#4CAF50; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:4px; display:inline-block; font-size:16px;">
                  ${actionTitle ?? "--"}
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:20px;">
                <p style="color:#999999; font-size:12px; margin:0;">
                If you’re not sure why you received this email, you can safely ignore it.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
