import { describe, expect, it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { CliOutput, Command } from "effect/unstable/cli";

import { LegacyGoProxy } from "../../../shared/legacy/go-proxy.service.ts";
import { textCliOutputFormatter } from "../../../shared/output/text-formatter.ts";
import { legacyConfigCommand } from "./config.command.ts";

function mockLegacyConfigGoProxy() {
  const calls: Array<ReadonlyArray<string>> = [];
  const layer = Layer.succeed(LegacyGoProxy, {
    exec: (args) =>
      Effect.sync(() => {
        calls.push([...args]);
      }),
  });

  return { layer, calls };
}

const legacyConfigTestRoot = Command.make("supabase").pipe(
  Command.withSubcommands([legacyConfigCommand]),
);

describe("legacy config command integration", () => {
  it.live("proxies config diff to the Go CLI", () => {
    const proxy = mockLegacyConfigGoProxy();
    const run = Effect.gen(function* () {
      yield* Command.runWith(legacyConfigTestRoot, { version: "0.0.0-test" })([
        "config",
        "diff",
        "--project-ref",
        "abcdefghijklmnopqrst",
      ]);

      expect(proxy.calls).toEqual([["config", "diff", "--project-ref", "abcdefghijklmnopqrst"]]);
    }).pipe(Effect.provide(Layer.mergeAll(proxy.layer, CliOutput.layer(textCliOutputFormatter()))));

    return run as Effect.Effect<void>;
  });
});
