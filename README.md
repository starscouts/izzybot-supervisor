# izzybot-supervisor

## Changing the config

Configuration data is stored in `./src/core.ts`, in the `config` object. 

* `Backup.Frequency` is how often (in seconds) should a backup be taken.
* `Backup.Files` is a list of absolute or relative paths to the files that should be tracked by the backup system.
* `Backup.Keep` is the amount of backups to keep. It is generally useless to keep more than 5 backups.
* `MaxRestarts` is the amount of allowed restarts before the child process enters a failing state and the watchdog gives up.
* `ChecksFrequency` is how often (in seconds) should the memory and CPU information be updated
* `MaxMemory` is how much RAM the child process can use (in KiB) before getting terminated, then killed.

## How to compile and build the thing?
```plaintext
cd ./src
node build.js
cd ../bin
```

This will:
* compile the code
* pack modules
* compress everything

Three files should be generated in `./bin`:
* `ibsuper-bundle-linux`, an all-in-one executable for x86 64bit Linux
* `ibsuper-bundle-darwin`, an all-in-one executable for ARM 64bit macOS (for testing)
* `ibsuper-standalone`, a portable version, requires system-wide NodeJS

## Created files/directories

Backed up files will be stored in their respective slots in `./bin/backups` (or next to the executable), and runtime logs will be stored in `./bin/logs` (or next to the executable)

## Debugging codes

If the supervisor hangs or crashes after reaching a specific code, this could indicate an error.

### Bundle version
| Code           | Meaning                                       |
|----------------|-----------------------------------------------|
| `I`            | Unable to unpack the Node.js binary           |
| `IZ`           | Unable to unpack the supervisor executable    |
| `IZZ`          | Unable to update permissions                  |
| `IZZY`         | Unable to start the application bootstrapper  |
| `IZZY MO`      | Unable to decompress the application          |
| `IZZY MOON`    | Unable to unpack the application              |
| `IZZY MOONBO`  | Unable to check if the application can be run |
| `IZZY MOONBOT` | Unable to start the application               |
| `IBSUPER`      | Unable to clean up temporary data             |

### Standalone version
| Code      | Meaning                                       |
|-----------|-----------------------------------------------|
| `MO`      | Unable to decompress the application          |
| `MOON`    | Unable to unpack the application              |
| `MOONBO`  | Unable to check if the application can be run |
| `MOONBOT` | Unable to start the application               |
| `IBSUPER` | Unable to clean up temporary data             |