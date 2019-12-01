import axios from "axios";
import xmlparser from "fast-xml-parser";
import { sha512 } from "sha.js";
import urljoin from "url-join";

interface HX {
    type: string;
    ikod: string;
    salt: string;
}

function prependWithZero(toPrepend: number): string {
    return toPrepend >= 10 ? toPrepend.toString() : `0${toPrepend.toString()}`;
}

export async function getHx(url: string, username: string): Promise<HX> {
    const response = await axios.get(urljoin(url, `?gethx=${username}`));
    const object = xmlparser.parse(response.data);
    if (object.results === undefined || object.results.res !== 1) throw new Error("Invalid URL or username");
    return { type: object.results.typ, ikod: object.results.ikod, salt: object.results.salt };
}

export function hashPassword(hx: HX, password: string): string {
    return new sha512().update(hx.salt + hx.ikod + hx.type + password).digest("base64");
}

export function computeToken(username: string, hashedPwd: string): string {
    const date = new Date();
    const dateString = `${date.getUTCFullYear()}${prependWithZero(date.getUTCMonth() + 1)}${prependWithZero(date.getUTCDate())}`;
    const hash = new sha512().update(`*login*${username}*pwd*${hashedPwd}*sgn*ANDR${dateString}`).digest("base64");
    return hash.replace(/\\|\//g, "_").replace(/\+/g, "-");
}
