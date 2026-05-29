import { Effect, Option } from "effect";
import { LegacyGoProxy } from "../../../../shared/legacy/go-proxy.service.ts";
import type { LegacyConfigDiffFlags } from "./diff.command.ts";

export const legacyConfigDiff = Effect.fn("legacy.config.diff")(function* (
  flags: LegacyConfigDiffFlags,
) {
  const proxy = yield* LegacyGoProxy;
  const args: string[] = ["config", "diff"];
  if (Option.isSome(flags.projectRef)) args.push("--project-ref", flags.projectRef.value);
  yield* proxy.exec(args);
});
