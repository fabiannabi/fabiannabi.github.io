// Ships the manifest inside the server's dist, so the published package is self-contained.
import { copyFileSync } from "node:fs";
copyFileSync(new URL("../../blueprint/dist/manifest.json", import.meta.url), new URL("../dist/manifest.json", import.meta.url));
console.log("copied manifest.json into dist/");
