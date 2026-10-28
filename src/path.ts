import { fileURLToPath, pathToFileURL } from "node:url";

// A URL scheme, of at least two characters so a Windows drive letter (C:) is a path
const SCHEME = /^[a-z][a-z0-9+.-]+:/i;

/**
 * Turns a location into a path on disk.
 *
 * A location written as an IRI in a pipeline, like `<./state.json>`, is
 * resolved against the pipeline and reaches the processor as a `file:` URL:
 * that becomes the path it names, with percent-escapes such as `%20` decoded.
 * Anything else, a path or a URL of another scheme, is returned as it is.
 */
export function toPath(location: string): string {
    return location.startsWith("file:") ? fileURLToPath(location) : location;
}

/**
 * Turns a path on disk into a location, the analogue of {@link toPath}.
 *
 * A path becomes a `file:` URL, a relative path resolved against the working
 * directory, with characters such as spaces percent-escaped. A URL, of any
 * scheme, is returned as it is.
 */
export function fromPath(path: string): string {
    return SCHEME.test(path) ? path : pathToFileURL(path).href;
}
