#### Description

Lists all emails in the mailbox, showing the most recent emails first. By default, displays the latest 20 emails. Use `--limit` to change the number of results. Use `--mailbox` to list emails from a different folder.

The output includes UID (used to reference emails in other commands), date, sender address, and subject line.

#### Usage

```bash
aux4 email list all [--limit <number>] [--mailbox <folder>] [--configFile <path>]
```

--limit     Maximum number of emails to display (default: 20)
--mailbox   Mailbox/folder name (default: INBOX)
--configFile  Path to config file (default: ~/.config/aux4/email.yaml)

#### Example

```bash
aux4 email list all
```

```text
UID       DATE                FROM                            SUBJECT
--------  ------------------  ------------------------------  --------------------------------------------------
12345     2025-01-15 10:30    john@example.com                Meeting Tomorrow
12344     2025-01-15 09:15    jane@example.com                Project Update
```
