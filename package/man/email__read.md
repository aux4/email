#### Description

Reads and displays the full content of an email identified by its UID. Shows the email headers (From, To, Cc, Date, Subject), the message body, and lists any attachments. Use `aux4 email list all` to find email UIDs.

The body is displayed as plain text. If the email only has HTML content, the raw HTML is shown.

#### Usage

```bash
aux4 email read <uid> [--mailbox <folder>] [--configFile <path>]
```

uid         Email UID (required)
--mailbox   Mailbox/folder name (default: INBOX)
--configFile  Path to config file (default: ~/.config/aux4/email.yaml)

#### Example

```bash
aux4 email read 12345
```

```text
From:    John Doe <john@example.com>
To:      you@gmail.com
Date:    2025-01-15 10:30
Subject: Meeting Tomorrow
---
Hi,

Let's meet tomorrow at 10am to discuss the project.

Best,
John

--- Attachments ---
  agenda.pdf (45.2 KB, application/pdf)
```
