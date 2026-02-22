# email config show

## should display configuration

````file:.aux4
{
  "scope": "aux4",
  "name": "email",
  "version": "1.0.0",
  "description": "Email client",
  "license": "Apache-2.0",
  "dependencies": ["aux4/config"],
  "profiles": [
    {
      "name": "main",
      "commands": [
        {
          "name": "email",
          "execute": ["profile:email"],
          "help": { "text": "Email commands" }
        }
      ]
    },
    {
      "name": "email",
      "commands": [
        {
          "name": "config",
          "execute": ["profile:email_config"],
          "help": { "text": "Configure email settings" }
        }
      ]
    },
    {
      "name": "email_config",
      "commands": [
        {
          "name": "set",
          "execute": [
            "touch value(configFile)",
            "aux4 config set --file value(configFile) --name imap.host value(imapHost)",
            "aux4 config set --file value(configFile) --name imap.port value(imapPort)",
            "aux4 config set --file value(configFile) --name smtp.host value(smtpHost)",
            "aux4 config set --file value(configFile) --name smtp.port value(smtpPort)",
            "aux4 config set --file value(configFile) --name user value(user)",
            "aux4 config set --file value(configFile) --name password value(password)",
            "log:Configuration saved"
          ],
          "help": {
            "text": "Configure",
            "variables": [
              { "name": "imapHost", "text": "IMAP host" },
              { "name": "imapPort", "text": "IMAP port", "default": "993" },
              { "name": "smtpHost", "text": "SMTP host" },
              { "name": "smtpPort", "text": "SMTP port", "default": "465" },
              { "name": "user", "text": "Email user" },
              { "name": "password", "text": "Password" },
              { "name": "configFile", "text": "Config file", "default": "~/.config/aux4/email.yaml" }
            ]
          }
        },
        {
          "name": "show",
          "execute": [
            "echo \"IMAP Host: $(aux4 config get --file ${configFile} imap.host)\"",
            "echo \"IMAP Port: $(aux4 config get --file ${configFile} imap.port)\"",
            "echo \"SMTP Host: $(aux4 config get --file ${configFile} smtp.host)\"",
            "echo \"SMTP Port: $(aux4 config get --file ${configFile} smtp.port)\"",
            "echo \"User:      $(aux4 config get --file ${configFile} user)\"",
            "echo \"Password:  ********\""
          ],
          "help": {
            "text": "Show config",
            "variables": [
              { "name": "configFile", "text": "Config file", "default": "~/.config/aux4/email.yaml" }
            ]
          }
        }
      ]
    }
  ]
}
````

```execute
aux4 email config set --imapHost imap.gmail.com --smtpHost smtp.gmail.com --user test@gmail.com --password secret --configFile ./test-email.yaml
```

```execute
aux4 email config show --configFile ./test-email.yaml
```

```expect
IMAP Host: imap.gmail.com
IMAP Port: 993
SMTP Host: smtp.gmail.com
SMTP Port: 465
User: test@gmail.com
Password: ********
```

## afterEach

```execute
rm -f ./test-email.yaml
```
