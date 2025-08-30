import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";

const dir = "./logs";

export function writeLog(file: string, data: unknown) {
  const path = `${dir}/${file}`;
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return writeFile(path, JSON.stringify(data, null, 2));
}
