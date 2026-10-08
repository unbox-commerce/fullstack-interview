import { describe, expect, test } from "bun:test";
import { testClient } from "../../../tests/helpers";
import { creators } from "../../db/schema";

describe("creator routes", () => {
  test("lists only the organization's creators", async () => {
    const { tx, organization, request } = await testClient();
    const { organization: other } = await testClient();

    await tx.insert(creators).values([
      { organizationId: organization.organizationId, username: "mine", displayName: "Mine" },
      { organizationId: other.organizationId, username: "theirs", displayName: "Theirs" },
    ]);

    const res = await request("/creators");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.creators.map((c: { username: string }) => c.username)).toContain("mine");
    expect(body.creators.map((c: { username: string }) => c.username)).not.toContain("theirs");
  });

  test("caps limit at 100", async () => {
    const { request } = await testClient();
    const res = await request("/creators?limit=5000");
    expect(res.status).toBe(400);
  });

  test("count respects search filter", async () => {
    const { tx, organization, request } = await testClient();
    await tx.insert(creators).values([
      { organizationId: organization.organizationId, username: "alpha", displayName: "Alpha" },
      { organizationId: organization.organizationId, username: "beta", displayName: "Beta" },
    ]);

    const res = await request("/creators/count?search=alp");
    const body = await res.json();
    expect(body.total).toBe(1);
  });
});
