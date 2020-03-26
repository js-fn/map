import { execFileSync } from "child_process";
import {
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
  statSync,
} from "fs";

import { basename } from "path";

function start() {
  const packageName = basename(process.cwd());
  for (let filename of readdirSync(".")) {
    if (filename === "setup.mjs") {
      continue;
    }

    const stat = statSync(filename);
    if (stat.isDirectory()) {
      continue;
    }

    let fileContent = readFileSync(filename, "utf8");
    fileContent = fileContent.replace(/__package_name__/g, packageName);
    unlinkSync(filename);
    filename = filename.replace(/__package_name__/g, packageName);
    writeFileSync(filename, fileContent);
  }

  execFileSync("npm", ["ci"], { stdio: "inherit" });
  execFileSync("npm", ["test"], { stdio: "inherit" });
}

start();
