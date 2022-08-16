import { BaseUri} from "@blockprotocol/type-system";

describe("BaseURI Class", () => {
    test("errors on invalid URI", async () => {
        const uri = new BaseUri("<>piwadoininvalidURL");
        throw new Error("owinaodiw");
    })
})