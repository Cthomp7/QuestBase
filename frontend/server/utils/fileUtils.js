import fs from "fs";
import path from "path";

export function readDirectoryRecursively(dir, dirPath) {
  const entries = fs.readdirSync(dirPath);
  return entries
    .map((entry) => {
      const fullPath = path.join(dirPath, entry);
      const stats = fs.statSync(fullPath);
      const relativePath = path.relative(
        path.join(process.cwd(), `src/pages/${dir}/data`),
        fullPath
      );

      if (stats.isDirectory()) {
        return {
          name: entry,
          path: `/${dir}/${relativePath}`,
          type: "folder",
          children: readDirectoryRecursively(dir, fullPath),
        };
      } else if (entry.endsWith(".md")) {
        return {
          name: entry.replace(".md", ""),
          path: `/${dir}/${relativePath}`,
          type: ".md",
        };
      }
      return null;
    })
    .filter(Boolean);
}
