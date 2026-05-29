import { Command, Flag } from "effect/unstable/cli";
import type * as CliCommand from "effect/unstable/cli/Command";
import { legacyConfigDiff } from "./diff.handler.ts";

const config = {
  projectRef: Flag.string("project-ref").pipe(
    Flag.withDescription("Project ref of the Supabase project."),
    Flag.optional,
  ),
} as const;

export type LegacyConfigDiffFlags = CliCommand.Command.Config.Infer<typeof config>;

export const legacyConfigDiffCommand = Command.make("diff", config).pipe(
  Command.withDescription("Diffs local config.toml against the linked project."),
  Command.withShortDescription("Diff local config against linked project"),
  Command.withExamples([
    {
      command: "supabase config diff",
      description: "Diff local config against the linked project",
    },
    {
      command: "supabase config diff --project-ref abcdefghijklmnopqrst",
      description: "Diff local config against a specific project",
    },
  ]),
  Command.withHandler((flags) => legacyConfigDiff(flags)),
);
