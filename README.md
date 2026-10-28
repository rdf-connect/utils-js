# utils-js

[![Build and tests with Node.js](https://github.com/rdf-connect/utils-js/actions/workflows/build-test.yml/badge.svg)](https://github.com/rdf-connect/utils-js/actions/workflows/build-test.yml) [![npm](https://img.shields.io/npm/v/@rdfc/utils-js.svg?style=popout)](https://npmjs.com/package/@rdfc/utils-js)

General utilities for the [RDF-Connect](https://rdf-connect.github.io/rdfc.github.io/) framework, shared by its JavaScript and TypeScript processors.

```
npm install @rdfc/utils-js
```

## Paths and locations

A processor argument that holds a location, like a state file or an output directory, can be written in a pipeline as a string or as an IRI.
An IRI such as `<./state.json>` is resolved against the pipeline and reaches the processor as a `file:` URL.

```ts
import { fromPath, toPath } from "@rdfc/utils-js";

toPath("file:///tmp/my%20data/state.json"); // "/tmp/my data/state.json"
toPath("./state.json"); // "./state.json", a path is kept
toPath("https://example.org/data.ttl"); // "https://example.org/data.ttl", so is a URL of another scheme

fromPath("/tmp/my data/state.json"); // "file:///tmp/my%20data/state.json"
fromPath("./state.json"); // "file:///<working directory>/state.json"
fromPath("https://example.org/data.ttl"); // "https://example.org/data.ttl", a URL is kept
```

- `toPath(location, base?)` turns a `file:` URL into the path on disk it names, decoding percent-escapes such as `%20`; a URL of another scheme is returned as it is, and so is a path, unless a `base` directory is given: a relative path is then resolved against it.
- `fromPath(path, base?)` is its analogue: it turns a path into a `file:` URL, resolving a relative path against the `base` directory, or the working directory without one, and escaping characters such as spaces; a URL is returned as it is.

The `base` directory can be a path or a `file:` URL:

```ts
toPath("processors/echo.ttl", "/etc/rdfc"); // "/etc/rdfc/processors/echo.ttl"
toPath("file:///tmp/echo.ttl", "/etc/rdfc"); // "/tmp/echo.ttl", a file: URL is already absolute
fromPath("state.json", "file:///etc/rdfc/"); // "file:///etc/rdfc/state.json"
```

## Development

```
npm install
npm run build
npm test
```
