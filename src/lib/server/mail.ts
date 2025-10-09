import { LocalInvite } from '@/lib/server/localStore';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function getEnv(name: string, optional = false): string | undefined {
  const v = process.env[name];
  if (!v && !optional) throw new Error(`${name} not set`);
  return v;
}

export async function sendBrevoEmail(params: {
  to: { email: string; name?: string }[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: { email: string; name?: string };
}) {
  const apiKey = getEnv('BREVO_API_KEY');
  const senderEmail = getEnv('BREVO_SENDER_EMAIL');
  const senderName = getEnv('BREVO_SENDER_NAME', true) || 'RDC Assay';

  const payload = {
    sender: { email: senderEmail, name: senderName },
    to: params.to,
    subject: params.subject,
    htmlContent: params.html,
    textContent: params.text,
    ...(params.replyTo ? { replyTo: params.replyTo } : {}),
  } as any;

  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey as string,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.message || `Brevo HTTP ${res.status}`);
  }
  return await res.json().catch(() => ({}));
}

export function computeBaseUrlFromHeaders(headers: Record<string, any>): string {
  const proto = (headers['x-forwarded-proto'] || headers['X-Forwarded-Proto'] || 'https') as string;
  const host = (headers['x-forwarded-host'] || headers['X-Forwarded-Host'] || headers['host'] || headers['Host']) as string;
  const envBase = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL;
  if (envBase) return envBase.replace(/\/$/, '');
  if (host) return `${proto}://${host}`;
  return 'http://localhost:3000';
}

export async function sendInviteEmail(invite: LocalInvite, baseUrl: string) {
  const url = `${baseUrl.replace(/\/$/, '')}/api/auth/client-redeem?code=${encodeURIComponent(invite.code)}`;
  const subject = 'Your RDC Assay access link';
  const html = `
    <div style="font-family:Arial,sans-serif;">
      <h2>Welcome to RDC Assay</h2>
      <p>Click the button to access your client space:</p>
      <p><a href="${url}" style="background:#0ea5e9;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;">Access now</a></p>
      <p>If the button doesn't work, copy this link:</p>
      <p style="word-break:break-all;"><a href="${url}">${url}</a></p>
      <hr/>
      <p>This link expires at: <strong>${new Date(invite.expiresAt).toLocaleString()}</strong></p>
    </div>
  `;
  const text = `Access your account: ${url}\nExpires at: ${new Date(invite.expiresAt).toLocaleString()}`;
  await sendBrevoEmail({
    to: [{ email: invite.email }],
    subject,
    html,
    text,
  });
}
