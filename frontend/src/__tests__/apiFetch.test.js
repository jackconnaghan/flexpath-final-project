// Level 1 (with a mock): apiFetch talks to the network, so we replace fetch
// with jest.fn() (done in setupTests.js) and control what it returns.
import { apiFetch } from "../logic/api"; 
import { fakeResponse } from "../__testSetup__/testUtils";

describe("apiFetch", () => {
  test("sends a plain GET with no auth header when there's no token", async () => {
    fetch.mockResolvedValue(fakeResponse(200, [{ id: 1, title: "Let the Great World Spin" }]));

    const data = await apiFetch("/api/books");

    expect(data).toEqual([{ id: 1, title: "Let the Great World Spin" }]);
    // mock.calls[0] is the argument list of the first call: [url, options]
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe("/api/books");
    expect(options.method).toBe("GET");
    expect(options.headers.Authorization).toBeUndefined();
  });

  test("adds the Bearer header and JSON body when given a token and body", async () => {
    fetch.mockResolvedValue(fakeResponse(200, { id: 7 }));

    await apiFetch("/api/wishlists/create", {
      token: "abc123",
      method: "POST",
      body: { list_title: "Summer" },
    });

    const [, options] = fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer abc123");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.body).toBe(JSON.stringify({ list_title: "Summer" }));
  });

  test("returns null for a 204 without trying to read a body", async () => {
    const response = fakeResponse(204);
    response.json = jest.fn();
    fetch.mockResolvedValue(response);

    const data = await apiFetch("/api/reviews/delete/3", { token: "t", method: "DELETE" });

    expect(data).toBeNull();
    expect(response.json).not.toHaveBeenCalled();
  });

  test("throws an error carrying the status and server message on failure", async () => {
    fetch.mockResolvedValue(fakeResponse(409, { detail: "Book already exists" }));

    //use the below for most/all expects that have to await
    await expect(apiFetch("/api/books/create", { method: "POST", body: {} })).rejects.toMatchObject({
      status: 409,
      message: "Book already exists",
    });
  });

  test("falls back to a generic message when the error body isn't JSON", async () => {
    const response = fakeResponse(401);
    response.json = async () => {
      throw new SyntaxError("Unexpected end of JSON");
    };
    fetch.mockResolvedValue(response);

    await expect(apiFetch("/api/reviews/mine")).rejects.toMatchObject({
      status: 401,
      message: "Request failed with status 401",
    });
  });
});