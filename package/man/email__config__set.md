#### Description

Configures email server settings using `aux4/config`. Sets IMAP and SMTP server hostnames, ports, username, and password. All parameters are optional and only provided values are updated, allowing incremental configuration changes.

The configuration is saved as a YAML file. Default ports are 993 for IMAP (TLS) and 465 for SMTP (TLS). Use port 587 for SMTP with STARTTLS (common with Outlook).

Most email providers require an app-specific password rather than your regular account password.

#### Usage

```bash
aux4 email config set [--imapHost <host>] [--imapPort <port>] [--smtpHost <host>] [--smtpPort <port>] [--user <email>] [--password <password>] [--configFile <path>]
```

--imapHost    IMAP server hostname (e.g., imap.gmail.com)
--imapPort    IMAP server port (default: 993)
--smtpHost    SMTP server hostname (e.g., smtp.gmail.com)
--smtpPort    SMTP server port (default: 465)
--user        Email address / username
--password    Email password or app-specific password
--configFile  Path to config file (default: ~/.config/aux4/email.yaml)

#### Example

```bash
aux4 email config set \
  --imapHost imap.gmail.com \
  --smtpHost smtp.gmail.com \
  --user you@gmail.com \
  --password abcd-efgh-ijkl-mnop
```

```text
Configuration saved
```
