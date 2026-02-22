#### Description

Lists emails from a specific sender address. Searches the mailbox for emails matching the given sender and displays them in reverse chronological order. Use `--limit` to control how many results are shown.

#### Usage

```bash
aux4 email list from <email> [--limit <number>] [--mailbox <folder>] [--configFile <path>]
```

email       Sender email address to filter by (required)
--limit     Maximum number of emails to display (default: 20)
--mailbox   Mailbox/folder name (default: INBOX)
--configFile  Path to config file (default: ~/.config/aux4/email.yaml)

#### Example

```bash
aux4 email list from john@example.com
```

```text
UID       DATE                FROM                            SUBJECT
--------  ------------------  ------------------------------  --------------------------------------------------
12345     2025-01-15 10:30    john@example.com                Meeting Tomorrow
12340     2025-01-14 16:00    john@example.com                Weekly Report
```
