#### Description

The `config` command group provides subcommands for managing email server configuration. Configuration includes IMAP and SMTP server settings, username, and password. Settings are stored in a YAML file at `~/.config/aux4/email.yaml` by default.

#### Usage

```bash
aux4 email config <subcommand>
```

Available subcommands: set, show

#### Example

```bash
aux4 email config set --imapHost imap.gmail.com --smtpHost smtp.gmail.com --user you@gmail.com --password app-password
aux4 email config show
```
