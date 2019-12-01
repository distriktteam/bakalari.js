import MockDate from "mockdate";

import * as pwdutils from "./pwdutils";

describe("pwdutils", () => {
    const hashedPassword = "v+X97lAKBbTUNOMtN1EcZho+qLJh97vlIyr8T+PvqLsLDLLTeqwc45EsIuMwas7ZOo14dE/yu1G8fycZYXL6yQ==";
    beforeAll(() => { MockDate.set(new Date(1512820800000)); });
    afterAll(() => { MockDate.reset(); });

    // Not mocking axios right now
    /*test("gets user hx from server", async () => {
        const hx = await pwdutils.getHx("https://example.com/login.aspx", "JanNovak");
        expect(hx).toBe({ type: "R", ikod: "GR10N", salt: "KWKG" });
    });*/

    test("computes correct password SHA-512 hash", () => {
        const hash = pwdutils.hashPassword({ type: "R", ikod: "GR10N", salt: "KWKG" }, "tajneheslo");
        expect(hash).toBe(hashedPassword);
    });

    test("computes correct token", () => {
        const token = pwdutils.computeToken("JanNovak", hashedPassword);
        expect(token).toBe("niGnyKbTc0xyChLYuMquVqIiqB_ZzaW0W5OQ6izXoKjHiXnYSpBc9qKJhprK54ZnbZb4fnZbqkwe7RhLRE_xZg==");
    });
});
