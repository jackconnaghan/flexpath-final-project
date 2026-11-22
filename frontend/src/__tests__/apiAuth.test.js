// Level 1: a pure function. No DOM, no React, no mocks.
// Pattern for every test: Arrange (set up input) → Act (call it) → Assert (expect).

//for apiAuth code
import { getRoles } from "../logic/apiUtils";
import { makeToken } from "../__testSetup__/testUtils";

describe("apiAuth", () => {
  test("returns the authorities from a valid token", () => {
    const token = makeToken({ sub: "admin", authorities: ["USER", "ADMIN"] });

    const roles = getRoles(token);

    // toEqual compares contents; toBe would compare identity and fail for arrays.
    expect(roles).toEqual(["USER", "ADMIN"]);
  });

  test("returns an empty array when the token has no authorities claim", () => {
    const token = makeToken({ sub: "admin" });

    expect(getRoles(token)).toEqual([]);
  });

  test("returns an empty array instead of throwing on garbage input", () => {
    expect(getRoles("not-a-jwt")).toEqual([]);
    expect(getRoles(undefined)).toEqual([]);
  });
});