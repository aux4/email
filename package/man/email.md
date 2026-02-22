#### Description

The `email` command provides a complete email client for managing emails via IMAP and SMTP. It supports listing, reading, sending emails and managing attachments. Compatible with Gmail, Outlook, Yahoo, and any provider that supports IMAP/SMTP.

Before using email commands, configure your server settings with `aux4 email config set`.

#### Usage

```bash
aux4 email <subcommand>
```

Available subcommands: list, read, send, attachment, config

#### Example

```bash
aux4 email list all
aux4 email read 12345
aux4 email send --to user@example.com --subject "Hello" --body "Hi there"
```
