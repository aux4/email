#!/usr/bin/env node

import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";
import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// All commands receive connection params as positional args:
// argv[2] = command
// argv[3] = imapHost
// argv[4] = imapPort
// argv[5] = smtpHost
// argv[6] = smtpPort
// argv[7] = user
// argv[8] = password
// argv[9+] = command-specific args

const command = process.argv[2];
const imapHost = process.argv[3];
const imapPort = process.argv[4];
const smtpHost = process.argv[5];
const smtpPort = process.argv[6];
const user = process.argv[7];
const password = process.argv[8];

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 16).replace("T", " ");
}


function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function createImapClient() {
  if (!imapHost || !user || !password) {
    console.error("IMAP connection not configured. Run \"aux4 email config set\" first.");
    process.exit(1);
  }
  const port = parseInt(imapPort) || 993;
  const client = new ImapFlow({
    host: imapHost,
    port,
    secure: port !== 143,
    auth: { user, pass: password },
    logger: false,
  });
  await client.connect();
  return client;
}

async function listEmails(mailbox, limit, fromAddress, subjectFilter) {
  const client = await createImapClient();
  try {
    const lock = await client.getMailboxLock(mailbox);
    try {
      const searchCriteria = fromAddress ? { from: fromAddress } : { all: true };
      if (subjectFilter) searchCriteria.subject = subjectFilter;
      const uids = await client.search(searchCriteria, { uid: true });

      if (uids.length === 0) {
        console.log("[]");
        return;
      }

      const limitedUids = uids.slice(-limit).reverse();
      const messages = [];

      for (const uid of limitedUids) {
        const msg = await client.fetchOne(uid, { envelope: true, uid: true }, { uid: true });
        if (msg) {
          messages.push({
            uid: msg.uid,
            date: formatDate(msg.envelope.date),
            from: msg.envelope.from?.[0]?.address || "unknown",
            subject: msg.envelope.subject || "(no subject)",
          });
        }
      }

      console.log(JSON.stringify(messages));
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
}

async function readEmail(mailbox, uid, raw, bodyOnly) {
  const client = await createImapClient();
  try {
    const lock = await client.getMailboxLock(mailbox);
    try {
      const downloaded = await client.download(uid, undefined, { uid: true });
      if (!downloaded || !downloaded.content) {
        console.error(`Email with UID ${uid} not found.`);
        process.exit(1);
      }

      const parsed = await simpleParser(downloaded.content);
      const body = parsed.text || parsed.html || "(no body)";

      if (bodyOnly === "true") {
        console.log(body);
        return;
      }

      if (raw === "true") {
        console.log(`From:    ${parsed.from?.text || "unknown"}`);
        console.log(`To:      ${parsed.to?.text || "unknown"}`);
        if (parsed.cc) console.log(`Cc:      ${parsed.cc.text}`);
        console.log(`Date:    ${formatDate(parsed.date)}`);
        console.log(`Subject: ${parsed.subject || "(no subject)"}`);
        console.log("---");
        console.log(body);
        if (parsed.attachments && parsed.attachments.length > 0) {
          console.log("\n--- Attachments ---");
          for (const att of parsed.attachments) {
            console.log(`  ${att.filename || "unnamed"} (${formatSize(att.size)}, ${att.contentType})`);
          }
        }
      } else {
        const dim = "\x1b[2m";
        const bold = "\x1b[1m";
        const cyan = "\x1b[36m";
        const green = "\x1b[32m";
        const yellow = "\x1b[33m";
        const magenta = "\x1b[35m";
        const reset = "\x1b[0m";

        console.log(`${dim}From:${reset}    ${bold}${parsed.from?.text || "unknown"}${reset}`);
        console.log(`${dim}To:${reset}      ${parsed.to?.text || "unknown"}`);
        if (parsed.cc) console.log(`${dim}Cc:${reset}      ${parsed.cc.text}`);
        console.log(`${dim}Date:${reset}    ${cyan}${formatDate(parsed.date)}${reset}`);
        console.log(`${dim}Subject:${reset} ${bold}${parsed.subject || "(no subject)"}${reset}`);
        console.log(`${dim}---${reset}`);
        console.log(body);
        if (parsed.attachments && parsed.attachments.length > 0) {
          console.log(`\n${dim}--- ${yellow}Attachments${reset} ${dim}---${reset}`);
          for (const att of parsed.attachments) {
            console.log(`  ${green}${att.filename || "unnamed"}${reset} ${dim}(${formatSize(att.size)}, ${magenta}${att.contentType}${reset}${dim})${reset}`);
          }
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
}

function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve("");
      return;
    }
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
  });
}

async function sendEmail(to, subject, body, cc, bcc, attachment) {
  if (!smtpHost || !user || !password) {
    console.error("SMTP connection not configured. Run \"aux4 email config set\" first.");
    process.exit(1);
  }

  if (!body) {
    body = await readStdin();
  }

  if (!body) {
    console.error("--body is required or provide body via stdin.");
    process.exit(1);
  }

  const port = parseInt(smtpPort) || 465;
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  const mailOptions = {
    from: user,
    to,
    subject,
    text: body,
  };

  if (cc) mailOptions.cc = cc;
  if (bcc) mailOptions.bcc = bcc;
  if (attachment && existsSync(attachment)) {
    mailOptions.attachments = [{ path: resolve(attachment) }];
  }

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent successfully. Message ID: ${info.messageId}`);
}

async function listAttachments(mailbox, uid) {
  const client = await createImapClient();
  try {
    const lock = await client.getMailboxLock(mailbox);
    try {
      const raw = await client.download(uid, undefined, { uid: true });
      if (!raw || !raw.content) {
        console.error(`Email with UID ${uid} not found.`);
        process.exit(1);
      }

      const parsed = await simpleParser(raw.content);

      if (!parsed.attachments || parsed.attachments.length === 0) {
        console.log("[]");
        return;
      }

      const attachments = parsed.attachments.map((att) => ({
        filename: att.filename || "unnamed",
        size: att.size,
        type: att.contentType,
      }));
      console.log(JSON.stringify(attachments));
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
}

async function downloadAttachment(mailbox, uid, filename, outputPath) {
  const client = await createImapClient();
  try {
    const lock = await client.getMailboxLock(mailbox);
    try {
      const raw = await client.download(uid, undefined, { uid: true });
      if (!raw || !raw.content) {
        console.error(`Email with UID ${uid} not found.`);
        process.exit(1);
      }

      const parsed = await simpleParser(raw.content);

      if (!parsed.attachments || parsed.attachments.length === 0) {
        console.error("No attachments found in this email.");
        process.exit(1);
      }

      const attachment = parsed.attachments.find((att) => att.filename === filename);

      if (!attachment) {
        console.error(`Attachment "${filename}" not found.`);
        console.error("Available attachments:");
        for (const att of parsed.attachments) {
          console.error(`  - ${att.filename || "unnamed"}`);
        }
        process.exit(1);
      }

      const outPath = outputPath ? resolve(outputPath) : resolve(attachment.filename);
      writeFileSync(outPath, attachment.content);
      console.log(`Downloaded: ${outPath} (${formatSize(attachment.size)})`);
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
}

async function main() {
  switch (command) {
    case "list-all": {
      // argv[9] = mailbox, argv[10] = limit, argv[11] = subject
      const mailbox = process.argv[9] || "INBOX";
      const limit = parseInt(process.argv[10]) || 20;
      const subject = process.argv[11] || "";
      await listEmails(mailbox, limit, undefined, subject);
      break;
    }

    case "list-from": {
      // argv[9] = mailbox, argv[10] = limit, argv[11] = fromEmail, argv[12] = subject
      const mailbox = process.argv[9] || "INBOX";
      const limit = parseInt(process.argv[10]) || 20;
      const fromEmail = process.argv[11];
      const subject = process.argv[12] || "";
      if (!fromEmail) {
        console.error("Email address is required.");
        process.exit(1);
      }
      await listEmails(mailbox, limit, fromEmail, subject);
      break;
    }

    case "read": {
      // argv[9] = mailbox, argv[10] = uid, argv[11] = raw, argv[12] = bodyOnly
      const mailbox = process.argv[9] || "INBOX";
      const uid = process.argv[10];
      const raw = process.argv[11] || "false";
      const bodyOnly = process.argv[12] || "false";
      if (!uid) {
        console.error("Email UID is required.");
        process.exit(1);
      }
      await readEmail(mailbox, uid, raw, bodyOnly);
      break;
    }

    case "send": {
      // argv[9] = to, argv[10] = subject, argv[11] = body, argv[12] = cc, argv[13] = bcc, argv[14] = attachment
      const to = process.argv[9];
      const subject = process.argv[10];
      const body = process.argv[11];
      const cc = process.argv[12];
      const bcc = process.argv[13];
      const attachment = process.argv[14];
      if (!to) {
        console.error("--to is required.");
        process.exit(1);
      }
      if (!subject) {
        console.error("--subject is required.");
        process.exit(1);
      }
      await sendEmail(to, subject, body, cc, bcc, attachment);
      break;
    }

    case "attachment-list": {
      // argv[9] = mailbox, argv[10] = uid
      const mailbox = process.argv[9] || "INBOX";
      const uid = process.argv[10];
      if (!uid) {
        console.error("Email UID is required.");
        process.exit(1);
      }
      await listAttachments(mailbox, uid);
      break;
    }

    case "attachment-download": {
      // argv[9] = mailbox, argv[10] = uid, argv[11] = filename, argv[12] = output
      const mailbox = process.argv[9] || "INBOX";
      const uid = process.argv[10];
      const filename = process.argv[11];
      const outputPath = process.argv[12];
      if (!uid) {
        console.error("Email UID is required.");
        process.exit(1);
      }
      if (!filename) {
        console.error("Attachment filename is required (--file).");
        process.exit(1);
      }
      await downloadAttachment(mailbox, uid, filename, outputPath);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      console.error("Available commands: list-all, list-from, read, send, attachment-list, attachment-download");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
