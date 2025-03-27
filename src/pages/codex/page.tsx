import { marked } from "marked";
import styles from "./page.module.css";
import downArrow from "../../assets/chevron-down.svg";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = process.env.VITE_API_BASE_URL;

interface CodexEntry {
  name: string;
  path: string;
  type: string;
  children?: CodexEntry[];
}

marked.setOptions({
  gfm: true, // Enables GitHub-Flavored Markdown
  breaks: true, // Enables line breaks with a single newline
});

const renderCodexEntries = (
  entries: CodexEntry[],
  currentPath: string | undefined,
  expandedFolders: Set<string>,
  setExpandedFolders: (folders: Set<string>) => void
) => (
  <ul className={styles.entries_list}>
    {entries.map((entry) => {
      // Find matching file if entry is a folder
      const matchingFile =
        entry.type === "folder" &&
        entry.children?.find(
          (child) => child.type === ".md" && child.name === entry.name
        );

      //16+4

      // Filter out the matching file from children if it exists
      const filteredChildren = entry.children?.filter(
        (child) => !(child.type === ".md" && child.name === entry.name)
      );

      const entryPath = matchingFile ? matchingFile.path : entry.path;

      // Normalize paths by replacing backslashes with forward slashes and removing leading /codex/
      const normalizedCurrentPath = currentPath?.replace(/\\/g, "/");
      const normalizedEntryPath = entryPath
        .replace(/\\/g, "/")
        .replace(/^\/codex\//, "");

      const isActive = normalizedCurrentPath === normalizedEntryPath;
      const isExpanded = expandedFolders.has(entry.path);

      return (
        <li key={entry.path} className={styles.entry_item}>
          <Link className={styles.entry} to={entryPath}>
            {entry.type === "folder" &&
              filteredChildren &&
              filteredChildren.length > 0 && (
                <button
                  type="button"
                  className={styles.folder_icon_button}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newExpandedFolders = new Set(expandedFolders);
                    if (isExpanded) {
                      newExpandedFolders.delete(entry.path);
                    } else {
                      newExpandedFolders.add(entry.path);
                    }
                    setExpandedFolders(newExpandedFolders);
                  }}
                >
                  <img
                    src={downArrow}
                    alt="down arrow"
                    className={`${styles.folder_icon} ${
                      isExpanded ? styles.expanded : ""
                    }`}
                  />
                </button>
              )}
            <p
              className={`${styles.entry_link} ${
                entry.type === "folder" ? styles.folder : styles.file
              } ${isActive ? styles.active_link : ""}`}
            >
              {entry.name}
            </p>
          </Link>
          {filteredChildren && filteredChildren.length > 0 && isExpanded && (
            <div className={styles.children}>
              {renderCodexEntries(
                filteredChildren,
                currentPath,
                expandedFolders,
                setExpandedFolders
              )}
            </div>
          )}
        </li>
      );
    })}
  </ul>
);

const stripFrontmatter = (content: string): string => {
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
  return content.replace(frontmatterRegex, "");
};

const Codex = () => {
  const { "*": path } = useParams();
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const getCodexEntries = async () => {
      try {
        console.log(`${API_BASE_URL}/api/codex`)
        const response = await fetch(`${API_BASE_URL}/api/codex`);
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON response, but got something else.");
        }
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching codex entries:", error);
        setError("Failed to load codex entries");
        setEntries([]);
      }
    };

    getCodexEntries();
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const currentPath = path ?? "codex.md";
        console.log(`${API_BASE_URL}/api/codex/content?path=${encodeURIComponent(
            currentPath
          )}`)
        const response = await fetch(
          `${API_BASE_URL}/api/codex/content?path=${encodeURIComponent(
            currentPath
          )}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        setContent(data);

        // Expand folders with active children
        const newExpandedFolders = new Set(expandedFolders);
        const expandFoldersWithActiveChildren = (entries: CodexEntry[]) => {
          entries.forEach((entry) => {
            if (entry.type === "folder" && entry.children) {
              // Find matching file if entry is a folder
              const matchingFile = entry.children.find(
                (child) => child.type === ".md" && child.name === entry.name
              );

              // Filter out the matching file from children
              const filteredChildren = entry.children.filter(
                (child) => !(child.type === ".md" && child.name === entry.name)
              );

              const entryPath = matchingFile ? matchingFile.path : entry.path;

              // Normalize paths consistently
              const normalizedCurrentPath = currentPath?.replace(/\\/g, "/");
              const normalizedEntryPath = entryPath
                .replace(/\\/g, "/")
                .replace(/^\/codex\//, "");

              // Check if this entry or any of its children are active
              const isActive = normalizedCurrentPath === normalizedEntryPath;
              const hasActiveChild = filteredChildren.some((child) => {
                // Check if this child is active
                const childPath = child.path
                  .replace(/\\/g, "/")
                  .replace(/^\/codex\//, "");
                const isChildActive = childPath === normalizedCurrentPath;

                // If this is a folder, recursively check its children
                if (child.type === "folder" && child.children) {
                  const checkDescendants = (entries: CodexEntry[]): boolean => {
                    return entries.some((entry) => {
                      const entryPath = entry.path
                        .replace(/\\/g, "/")
                        .replace(/^\/codex\//, "");
                      if (entryPath === normalizedCurrentPath) {
                        return true;
                      }
                      if (entry.type === "folder" && entry.children) {
                        return checkDescendants(entry.children);
                      }
                      return false;
                    });
                  };
                  return isChildActive || checkDescendants(child.children);
                }

                return isChildActive;
              });

              if (isActive || hasActiveChild) {
                newExpandedFolders.add(entry.path);
                expandFoldersWithActiveChildren(filteredChildren);
              }
            }
          });
        };
        expandFoldersWithActiveChildren(entries);
        setExpandedFolders(newExpandedFolders);
      } catch (error) {
        console.error("Error loading content:", error);
        setError("Failed to load content");
        setContent("");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [path, entries]);

  return (
    <div className={styles.container}>
      <div className={styles.table_of_contents}>
        <h1>Table of Contents</h1>
        {error && <p className={styles.error}>{error}</p>}
        {entries.length > 0 ? (
          renderCodexEntries(entries, path, expandedFolders, setExpandedFolders)
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className={styles.page_container}>
        {loading ? (
          <p>Loading content...</p>
        ) : (
          <div
            className={styles.page}
            dangerouslySetInnerHTML={{
              __html: marked.parse(stripFrontmatter(content)),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Codex;
