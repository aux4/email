# aux4/email

Email client for listing, reading, sending emails and managing attachments via IMAP and SMTP. Works with Gmail, Outlook, Yahoo, and any provider that supports IMAP/SMTP.

## Installation

```bash
aux4 aux4 pkger install aux4/email
```

## Configuration

Create the config file at `~/.config/aux4/email.yaml`:

```yaml
imap:
  host: imap.gmail.com
  port: "993"
smtp:
  host: smtp.gmail.com
  port: "465"
user: your.email@gmail.com
password: xxxx xxxx xxxx xxxx
```

### Provider Examples

**Gmail:**
```yaml
imap:
  host: imap.gmail.com
  port: "993"
smtp:
  host: smtp.gmail.com
  port: "465"
user: your.email@gmail.com
password: xxxx xxxx xxxx xxxx
```

**Outlook:**
```yaml
imap:
  host: outlook.office365.com
  port: "993"
smtp:
  host: smtp.office365.com
  port: "587"
user: your.email@outlook.com
password: xxxx xxxx xxxx xxxx
```

**Yahoo:**
```yaml
imap:
  host: imap.mail.yahoo.com
  port: "993"
smtp:
  host: smtp.mail.yahoo.com
  port: "465"
user: your.email@yahoo.com
password: xxxx xxxx xxxx xxxx
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

## Commands

| Command | Description |
|---------|-------------|
| `aux4 email list all` | List all emails in the mailbox |
| `aux4 email list from <email>` | List emails from a specific sender |
| `aux4 email read <uid>` | Read an email by UID |
| `aux4 email send` | Send an email |
| `aux4 email attachment list <uid>` | List attachments of an email |
| `aux4 email attachment download <uid>` | Download an attachment |

## License

Apache-2.0
