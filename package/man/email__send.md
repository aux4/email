#### Description

Sends an email via SMTP. Requires `--to`, `--subject`, and `--body` parameters. Optionally supports CC, BCC recipients and file attachments. The sender address is taken from the configured `user` in the config file.

For multiple recipients in `--to`, `--cc`, or `--bcc`, use comma-separated addresses.

#### Usage

```bash
aux4 email send --to <email> --subject <text> --body <text> [--cc <email>] [--bcc <email>] [--attachment <file>] [--configFile <path>]
```

--to          Recipient email address (required)
--subject     Email subject line (required)
--body        Email body text (required)
--cc          CC recipients (comma-separated)
--bcc         BCC recipients (comma-separated)
--attachment  Path to a file to attach
--configFile  Path to config file (default: ~/.config/aux4/email.yaml)

#### Example

```bash
aux4 email send --to recipient@example.com --subject "Hello" --body "Hi there!"
```

```text
Email sent successfully. Message ID: <abc123@smtp.gmail.com>
```
