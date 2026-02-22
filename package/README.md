# aux4/email

Email client for listing, reading, sending emails and managing attachments via IMAP and SMTP. Works with Gmail, Outlook, Yahoo, and any provider that supports IMAP/SMTP.

## Installation

```bash
aux4 aux4 pkger install aux4/email
```

## Configuration

Before using the email commands, configure your email server settings:

```bash
aux4 email config set \
  --imapHost imap.gmail.com \
  --imapPort 993 \
  --smtpHost smtp.gmail.com \
  --smtpPort 465 \
  --user your.email@gmail.com \
  --password your-app-password
```

Configuration is stored in `~/.config/aux4/email.yaml` via `aux4/config`. Use `--configFile` to specify an alternative path.

### Provider Examples

**Gmail:**
```bash
aux4 email config set --imapHost imap.gmail.com --smtpHost smtp.gmail.com --user you@gmail.com --password your-app-password
```

**Outlook:**
```bash
aux4 email config set --imapHost outlook.office365.com --smtpHost smtp.office365.com --smtpPort 587 --user you@outlook.com --password your-app-password
```

**Yahoo:**
```bash
aux4 email config set --imapHost imap.mail.yahoo.com --smtpHost smtp.mail.yahoo.com --user you@yahoo.com --password your-app-password
```

> **Note:** Most providers require an app-specific password instead of your regular account password. See your provider's documentation for generating app passwords.

## Usage

### List Emails

```bash
# List latest 20 emails
aux4 email list all

# List more emails
aux4 email list all --limit 50

# List emails from a specific sender
aux4 email list from user@example.com

# List from a different mailbox
aux4 email list all --mailbox Sent
```

### Read an Email

```bash
aux4 email read 12345
```

### Send an Email

```bash
aux4 email send --to recipient@example.com --subject "Hello" --body "Message body"

# With CC, BCC, and attachment
aux4 email send \
  --to recipient@example.com \
  --cc other@example.com \
  --subject "Report" \
  --body "Please find the report attached." \
  --attachment ./report.pdf
```

### Manage Attachments

```bash
# List attachments of an email
aux4 email attachment list 12345

# Download a specific attachment
aux4 email attachment download 12345 --file document.pdf

# Download to a specific path
aux4 email attachment download 12345 --file document.pdf --output ~/Downloads/document.pdf
```

### Configuration

```bash
# Show current configuration
aux4 email config show

# Update a single setting
aux4 email config set --smtpPort 587
```

## Commands

| Command | Description |
|---------|-------------|
| `aux4 email list all` | List all emails in the mailbox |
| `aux4 email list from <email>` | List emails from a specific sender |
| `aux4 email read <uid>` | Read an email by UID |
| `aux4 email send` | Send an email |
| `aux4 email attachment list <uid>` | List attachments of an email |
| `aux4 email attachment download <uid>` | Download an attachment |
| `aux4 email config set` | Configure email settings |
| `aux4 email config show` | Show current configuration |

## License

Apache-2.0
