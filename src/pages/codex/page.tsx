import { marked } from "marked";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TableOfContents from "../../components/TableOfContents/TableOfContents";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

const stripFrontmatter = (content: string): string => {
  if (!content) return content;
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
  const stripped = content.replace(frontmatterRegex, "");
  return stripped;
};

const Codex = () => {
  const { "*": path } = useParams();
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCodexEntries = async () => {
      try {
        console.log(`${API_BASE_URL}/api/codex`);
        const response = await fetch(`${API_BASE_URL}/api/codex`);
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON response, but got something else.");
        }
        const data = await response.json();
        const filteredData = data.filter(
          (entry: CodexEntry) => entry.name !== "codex"
        );
        setEntries(filteredData);
      } catch (error) {
        console.error("Error fetching codex entries:", error);
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
        console.log(
          `${API_BASE_URL}/api/codex/content?path=${encodeURIComponent(
            currentPath
          )}`
        );
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
      } catch (error) {
        console.error("Error loading content:", error);
        setContent("");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [path]);

  return (
    <div className={styles.container}>
      <TableOfContents entries={entries} currentPath={path} />
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
