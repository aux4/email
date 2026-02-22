#### Description

Downloads a specific attachment from an email. Specify the email UID and the attachment filename (as shown by `aux4 email attachment list`). By default, the file is saved to the current directory with its original filename. Use `--output` to specify a different output path.

If the specified filename is not found in the email, the command lists all available attachments.

#### Usage

```bash
aux4 email attachment download <uid> --file <filename> [--output <path>] [--mailbox <folder>] [--configFile <path>]
```

uid         Email UID (required)
--file      Attachment filename to download (required)
--output    Output file path (default: current directory with original filename)
--mailbox   Mailbox/folder name (default: INBOX)
--configFile  Path to config file (default: ~/.config/aux4/email.yaml)

#### Example

```bash
aux4 email attachment download 12345 --file report.pdf
```

```text
Downloaded: /Users/you/report.pdf (1.2 MB)
```
