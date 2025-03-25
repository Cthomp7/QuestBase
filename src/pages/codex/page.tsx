import { marked } from "marked";
import styles from "./page.module.css";
import downArrow from "../../assets/chevron-down.svg";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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

const renderCodexEntries = (entries: CodexEntry[]) => (
  <ul className={styles.entries_list}>
    {entries.map((entry) => {
      // Find matching file if entry is a folder
      const matchingFile =
        entry.type === "folder" &&
        entry.children?.find(
          (child) => child.type === ".md" && child.name === entry.name
        );

      // Filter out the matching file from children if it exists
      const filteredChildren = entry.children?.filter(
        (child) => !(child.type === ".md" && child.name === entry.name)
      );

      return (
        <li key={entry.path} className={styles.entry_item}>
          <div className={styles.entry}>
            {entry.type === "folder" &&
              entry.children &&
              entry.children.length > 0 && (
                <img
                  src={downArrow}
                  alt="down arrow"
                  className={styles.folder_icon}
                />
              )}
            <Link
              to={matchingFile ? matchingFile.path : entry.path}
              className={`${styles.entry_link} ${
                entry.type === "folder" ? styles.folder : styles.file
              }`}
            >
              {entry.name}
            </Link>
          </div>
          {filteredChildren && filteredChildren.length > 0 && (
            <div className={styles.children}>
              {renderCodexEntries(filteredChildren)}
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

  useEffect(() => {
    const getCodexEntries = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/codex");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
        const currentPath = path ?? "The Codex";
        const response = await fetch(
          `http://localhost:3001/api/codex/content?path=${encodeURIComponent(
            currentPath
          )}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        setContent(data);
      } catch (error) {
        console.error("Error loading content:", error);
        setError("Failed to load content");
        setContent("");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [path]);

  return (
    <div className={styles.container}>
      <div className={styles.table_of_contents}>
        <h1>Table of Contents</h1>
        {error && <p className={styles.error}>{error}</p>}
        {entries.length > 0 ? renderCodexEntries(entries) : <p>Loading...</p>}
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
