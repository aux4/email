#### Description

Displays the current email configuration. Shows the IMAP and SMTP server settings, username, and a masked password. Uses `aux4/config` to read values from the config file.

#### Usage

```bash
aux4 email config show [--configFile <path>]
```

--configFile  Path to config file (default: ~/.config/aux4/email.yaml)

#### Example

```bash
aux4 email config show
```

```text
IMAP Host: imap.gmail.com
IMAP Port: 993
SMTP Host: smtp.gmail.com
SMTP Port: 465
User: you@gmail.com
Password: ********
```
