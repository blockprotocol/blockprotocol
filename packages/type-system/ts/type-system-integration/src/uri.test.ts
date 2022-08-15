import init, { BaseUri} from "@blockprotocol/type-system";

describe("BaseURI Class", () => {
    test("errors on invalid URI", async () => {
        await init();
        const uri = new BaseUri("<>piwadoininvalidURL");
        throw new Error("owinaodiw");
    })
})