import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./TableOfContents.module.css";
import downArrow from "../../assets/chevron-down.svg";
import chevronsDownUp from "../../assets/chevrons-down-up.svg";
import chevronsUpDown from "../../assets/chevrons-up-down.svg";
import Fuse from "fuse.js";

interface CodexEntry {
  name: string;
  path: string;
  type: string;
  children?: CodexEntry[];
}

interface TableOfContentsProps {
  entries: CodexEntry[];
  currentPath?: string;
}

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
      const normalizedExpandedPath = entry.path
        .replace(/\\/g, "/")
        .replace(/^\/codex\//, "");
      const isExpanded = expandedFolders.has(normalizedExpandedPath);

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
                      newExpandedFolders.delete(normalizedExpandedPath);
                    } else {
                      newExpandedFolders.add(normalizedExpandedPath);
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

// Function to get all folder paths
const getAllFolderPaths = (entries: CodexEntry[]): string[] => {
  const paths: string[] = [];
  entries.forEach((entry) => {
    if (entry.type === "folder") {
      const normalizedPath = entry.path
        .replace(/\\/g, "/")
        .replace(/^\/codex\//, "");
      paths.push(normalizedPath);
      if (entry.children) {
        paths.push(...getAllFolderPaths(entry.children));
      }
    }
  });
  return paths;
};

// Function to flatten entries for search
const flattenEntries = (entries: CodexEntry[]): CodexEntry[] => {
  return entries.reduce((acc: CodexEntry[], entry) => {
    acc.push(entry);
    if (entry.children) {
      acc.push(...flattenEntries(entry.children));
    }
    return acc;
  }, []);
};

// Function to get all parent paths for a given path
const getAllParentPaths = (path: string): string[] => {
  // Normalize the path by replacing backslashes with forward slashes and removing leading /codex/
  const normalizedPath = path.replace(/\\/g, "/").replace(/^\/codex\//, "");
  const parts = normalizedPath.split("/");
  const parents: string[] = [];
  let currentPath = "";

  for (let i = 0; i < parts.length - 1; i++) {
    currentPath += (i === 0 ? "" : "/") + parts[i];
    parents.push(currentPath);
  }

  return parents;
};

// Function to filter entries based on search
const filterEntries = (
  entries: CodexEntry[],
  searchQuery: string,
  expandedFolders: Set<string>,
  setExpandedFolders: (folders: Set<string>) => void
): CodexEntry[] => {
  if (!searchQuery.trim()) {
    // Reset expanded folders to default state when search is empty
    setExpandedFolders(new Set());
    // Return the original entries without any filtering
    return entries;
  }

  const flattenedEntries = flattenEntries(entries);
  const fuse = new Fuse(flattenedEntries, {
    keys: ["name"],
    threshold: 0.3,
    includeScore: true,
  });

  const results = fuse.search(searchQuery);
  const matchedPaths = new Set(results.map((result) => result.item.path));

  // Get all parent paths for matched items
  const parentPaths = new Set<string>();
  results.forEach((result) => {
    const parents = getAllParentPaths(result.item.path);
    parents.forEach((parent) => parentPaths.add(parent));
  });

  // Function to filter entries while preserving structure
  const filterEntriesRecursive = (entries: CodexEntry[]): CodexEntry[] => {
    return entries.filter((entry) => {
      // If this entry matches, keep it and its children
      if (matchedPaths.has(entry.path)) {
        if (entry.children) {
          entry.children = filterEntriesRecursive(entry.children);
        }
        return true;
      }

      // If this is a folder with children
      if (entry.children) {
        // Filter its children
        entry.children = filterEntriesRecursive(entry.children);
        // Keep the folder if it has any matching children
        return entry.children.length > 0;
      }

      // If this is a file and doesn't match, remove it
      return false;
    });
  };

  // Create a deep copy of entries to avoid mutating the original
  const entriesCopy = JSON.parse(JSON.stringify(entries));
  const filtered = filterEntriesRecursive(entriesCopy);

  // Update expanded folders to include all parents of matched items
  const newExpandedFolders = new Set(expandedFolders);
  parentPaths.forEach((path) => {
    // Normalize the path before adding it to the set
    const normalizedPath = path.replace(/\\/g, "/").replace(/^\/codex\//, "");
    newExpandedFolders.add(normalizedPath);
  });
  setExpandedFolders(newExpandedFolders);

  return filtered;
};

const TableOfContents = ({ entries, currentPath }: TableOfContentsProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [allExpanded, setAllExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CodexEntry[]>([]);

  // Function to toggle all folders
  const toggleAllFolders = () => {
    if (allExpanded) {
      setExpandedFolders(new Set());
    } else {
      const allPaths = getAllFolderPaths(entries);
      setExpandedFolders(new Set(allPaths));
    }
    setAllExpanded(!allExpanded);
  };

  // Update search results when query changes
  useEffect(() => {
    const filtered = filterEntries(
      entries,
      searchQuery,
      expandedFolders,
      setExpandedFolders
    );
    setSearchResults(filtered);
  }, [searchQuery, entries]);

  // Expand folders with active children
  useEffect(() => {
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
  }, [currentPath, entries]);

  return (
    <div className={styles.table_of_contents}>
      <h1>Table of Contents</h1>
      <div className={styles.search_container}>
        <input
          type="text"
          className={styles.search_input}
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={toggleAllFolders} className={styles.toggle_all_button}>
          <img
            src={allExpanded ? chevronsDownUp : chevronsUpDown}
            alt={allExpanded ? "Collapse all" : "Expand all"}
            className={styles.toggle_icon}
          />
        </button>
      </div>
      {entries.length > 0 ? (
        renderCodexEntries(
          searchResults,
          currentPath,
          expandedFolders,
          setExpandedFolders
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TableOfContents;
