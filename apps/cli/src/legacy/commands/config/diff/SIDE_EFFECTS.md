# `supabase config diff`

## Files Read

| Path                             | Format                    | When                                                       |
| -------------------------------- | ------------------------- | ---------------------------------------------------------- |
| `~/.supabase/access-token`       | plain text (token string) | when `SUPABASE_ACCESS_TOKEN` unset and keyring unavailable |
| `<workdir>/supabase/config.toml` | TOML                      | always, to load local project configuration                |

## Files Written

| Path | Format | When |
| ---- | ------ | ---- |
| —    | —      | —    |

## API Routes

| Method | Path                                | Auth         | Request body | Response (used fields)              |
| ------ | ----------------------------------- | ------------ | ------------ | ----------------------------------- |
| `GET`  | `/v1/projects/{ref}/postgrest`      | Bearer token | none         | PostgREST config object             |
| `GET`  | `/v1/projects/{ref}/config/auth`    | Bearer token | none         | Auth config object                  |
| `GET`  | `/v1/projects/{ref}/config/storage` | Bearer token | none         | Storage config object               |
| `GET`  | `/v1/projects/{ref}/config/database` | Bearer token | none         | Database config object              |

Note: Additional config endpoints may be read depending on the config sections present in `config.toml`.

## Environment Variables

| Variable                | Purpose                                              | Required?                                               |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | auth token (bypasses credential file/keyring lookup) | no (falls back to keyring → `~/.supabase/access-token`) |
| `SUPABASE_API_URL`      | override Management API base URL                     | no (defaults to `https://api.supabase.com`)             |

## Exit Codes

| Code | Condition                                          |
| ---- | -------------------------------------------------- |
| `0`  | success — config diff completed                    |
| `1`  | malformed `config.toml`                            |
| `1`  | authentication error — no valid token found        |
| `1`  | API error — non-2xx response from config endpoints |
| `1`  | network / connection failure                       |

## Output

### `--output-format text` (Go CLI compatible)

Prints project ref to stderr before diffing:

```
Diffing config for project: abcdefghijklmnopqrst
```

Prints unified diffs to stdout using section labels such as:

```
diff remote[api] local[api]
--- remote[api]
+++ local[api]
```

When a section has no changes, prints an up-to-date message to stderr.

### `--output-format json`

Not applicable for this command (Go proxy output).

### `--output-format stream-json`

Not applicable for this command (Go proxy output).

## Notes

- Reads `config.toml` from the working directory (must be run from the project root).
- Performs the read and diff phase of `config push` only.
- Does not prompt, check billing add-ons, or apply remote updates.
- Requires `--project-ref` or a linked project.
