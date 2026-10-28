import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// A URL scheme, of at least two characters so a Windows drive letter (C:) is a path
const SCHEME = /^[a-z][a-z0-9+.-]+:/i;

/**
 * Turns a location into a path on disk.
 *
 * A location written as an IRI in a pipeline, like `<./state.json>`, is
 * resolved against the pipeline and reaches the processor as a `file:` URL:
 * that becomes the path it names, with percent-escapes such as `%20` decoded.
 * A URL of another scheme is returned as it is, and so is a path, unless a
 * `base` directory is given: a relative path is then resolved against it.
 *
 * @param base The directory a relative path is relative to, as a path or a
 * `file:` URL.
 */
export function toPath(location: string, base?: string): string {
    if (location.startsWith("file:")) return fileURLToPath(location);
    if (base === undefined || SCHEME.test(location)) return location;
    return resolve(toPath(base), location);
}

/**
 * Turns a path on disk into a location, the analogue of {@link toPath}.
 *
 * A path becomes a `file:` URL, with characters such as spaces
 * percent-escaped. A relative path is resolved against the `base` directory,
 * or against the working directory without one. A URL, of any scheme, is
 * returned as it is.
 *
 * @param base The directory a relative path is relative to, as a path or a
 * `file:` URL.
 */
export function fromPath(path: string, base?: string): string {
    if (SCHEME.test(path)) return path;
    const absolute = base === undefined ? path : resolve(toPath(base), path);
    return pathToFileURL(absolute).href;
}
