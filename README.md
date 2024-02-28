# vscode-url-for-line README

This is a vscode extension that can create a vscode:// URL linking to the
current line and current column in the current file.

Note this _not_ the same as several other available extensions (that I use and
enjoy) that create links to the file in GitHub or other version control systems'
web interfaces.  This extension creates a vscode:// link that you can put in the
Notes app, Obsidian, etc, that when you click on it it'll **reopen in your
local editor** the exact file at that exact line and column.

## Features

Creates a link to the current line in the current file.

### The `Copy URL to clipboard` command

Copies the URL that points to the current file, current line and current column
to the clipboard.

For example, if you're editing the `/Users/markfowler/.zshrc` file and your
cursor is on line 4, column 6, then invoking the `Copy URL to clipboard` command
will copy `vscode://file//Users/markfowler/.zshrc:4:6` to your clipboard.

### The `Copy Markdown link to clipboard` command

Copies a markdown link that points to the current file, current line, and current
column.

For example, if you're editing the `/Users/markfowler/.zshrc` file and your
cursor is on line 4, column 6, then invoking the
`Copy Markdown link to clipboard` command will copy
`[/Users/markfowler/.zshrc line 4 column 6](vscode://file//Users/markfowler/.zshrc:4:6)`
to your clipboard.

If your cursor is on column 1 then that will be omitted from the link
description (i.e. `/Users/markfowler/.zshrc line 4` not
`/Users/markfowler/.zshrc line 4 column 1`).  If you're on the first column of
the first line of the file then both line and column will be omitted (i.e.
`/Users/markfowler/.zshrc` not `/Users/markfowler/.zshrc line 1 column 1`).

If you are editing a file where vscode has a concept of a _relative path_
because it has a folder or a workspace open then that will be used in the
description (i.e. `.circleci/config.yml` not
`/Users/markfowler/myproject/.circleci/config.yml`).

## Known Issues

This extension creates links to a particular line and column in a particular
file.  If you move or rename that file, the link will no longer work.  If you
edit the file and insert lines above where you're linking to, the link will
effectively point to a different place in the file.  Them's the breaks.

## Release Notes

### 0.0.1

Initial release of vscode-url-for-line
