import { zValidator as honoValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { z } from "zod";
import { ValidationError } from "../errors";

export const zValidator = <T extends z.ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  honoValidator(target, schema, (result) => {
    if (!result.success) {
      throw new ValidationError(result.error.issues.map((i) => i.message).join(", "));
    }
  });
