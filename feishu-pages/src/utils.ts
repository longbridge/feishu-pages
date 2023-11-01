import { FileDoc } from "./summary";

export const normalizeSlug = (slug: string | number) => {
  // force convert slug into string
  slug = String(slug);
  return slug.replace(/^wik(cn|en)/, '');
};

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export const humanizeFileSize = (bytes, dp = 1) => {
  const thresh = 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + ' ' + units[u];
};

const allowKeys = [
  "depth",
  "title",
  "slug",
  "filename",
  "node_token",
  "parent_node_token",
  "children",
  "obj_create_time",
  "obj_edit_time",
  "obj_token",
  "has_child",
  "meta",
  "position"
];

export function cleanupDocsForJSON(docs: FileDoc[]) {
  const nodesToDelete = [];

  for (let idx = 0; idx < docs.length; idx++) {
    const doc = docs[idx];

    Object.keys(doc).forEach(key => {
      if (!allowKeys.includes(key)) {
        delete doc[key];
      }
    });

    if (doc.meta?.hide) {
      nodesToDelete.push(idx);
    }

    if (doc.children) {
      cleanupDocsForJSON(doc.children);
    }
  }

  // Delete nodes in reverse order to avoid index issues
  for (let i = nodesToDelete.length - 1; i >= 0; i--) {
    docs.splice(nodesToDelete[i], 1);
  }
}
