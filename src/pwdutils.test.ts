import mockAxios from "jest-mock-axios";
import MockDate from "mockdate";

import * as pwdutils from "./pwdutils";

afterEach(() => { mockAxios.reset(); });

describe("pwdutils", () => {
    const hashedPassword = "v+X97lAKBbTUNOMtN1EcZho+qLJh97vlIyr8T+PvqLsLDLLTeqwc45EsIuMwas7ZOo14dE/yu1G8fycZYXL6yQ==";
    beforeAll(() => { MockDate.set(new Date(1512820800000)); });
    afterAll(() => { MockDate.reset(); });

    test("gets user hx from server", (done) => {
        const thenFn = (response: any) => {
            expect(response).toEqual({ type: "R", ikod: "GR10N", salt: "KWKG" });
            done();
        };
        const catchFn = (error: any) => {
            fail(error);
            done();
        };

        pwdutils.getHx("https://example.com/login.aspx", "JanNovak")
            .then(thenFn).catch(catchFn);

        expect(mockAxios.get).toHaveBeenCalledWith("https://example.com/login.aspx?gethx=JanNovak");

        mockAxios.mockResponse({
            data: '<?xml version="1.0" encoding="UTF-8"?><results><res>01</res><typ>R</typ><ikod>GR10N</ikod><salt>KWKG</salt><pheslo></pheslo></results>',
        });
    });

    test("fails getting non-existent user hx from server", (done) => {
        const thenFn = () => {
            fail("Should've failed as response is not valid");
            done();
        };
        const catchFn = () => done();

        pwdutils.getHx("https://example.com/login.aspx", "idonotexist")
            .then(thenFn).catch(catchFn);

        expect(mockAxios.get).toHaveBeenCalledWith("https://example.com/login.aspx?gethx=idonotexist");

        mockAxios.mockResponse({
            data: '<?xml version="1.0" encoding="UTF-8"?><results><res>02</res></results>',
        });
    });

    test("computes correct password SHA-512 hash", () => {
        const hash = pwdutils.computePassword({ type: "R", ikod: "GR10N", salt: "KWKG" }, "tajneheslo");
        expect(hash).toBe(hashedPassword);
    });

    test("computes correct token", () => {
        const token = pwdutils.computeToken("JanNovak", hashedPassword);
        expect(token).toBe("niGnyKbTc0xyChLYuMquVqIiqB_ZzaW0W5OQ6izXoKjHiXnYSpBc9qKJhprK54ZnbZb4fnZbqkwe7RhLRE_xZg==");
    });
});
