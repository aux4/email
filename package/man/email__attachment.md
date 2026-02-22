#### Description

The `attachment` command group provides subcommands for listing and downloading email attachments. Use the email UID (from `aux4 email list all`) to reference the email containing the attachments.

#### Usage

```bash
aux4 email attachment <subcommand>
```

Available subcommands: list, download

#### Example

```bash
aux4 email attachment list 12345
aux4 email attachment download 12345 --file document.pdf
```
