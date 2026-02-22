#### Description

Lists all attachments in an email identified by its UID. Displays a table with the filename, size, and MIME type of each attachment. Use this command to find the exact filename before downloading with `aux4 email attachment download`.

#### Usage

```bash
aux4 email attachment list <uid> [--mailbox <folder>] [--configFile <path>]
```

uid         Email UID (required)
--mailbox   Mailbox/folder name (default: INBOX)
--configFile  Path to config file (default: ~/.config/aux4/email.yaml)

#### Example

```bash
aux4 email attachment list 12345
```

```text
FILENAME                                  SIZE          TYPE
----------------------------------------  ------------  ------------------------------
report.pdf                                1.2 MB        application/pdf
screenshot.png                            256.0 KB      image/png
```
