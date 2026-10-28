import { describe, expect, test } from "vitest";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { fromPath, toPath } from "../src/index.js";

describe("toPath", () => {
    test("keeps paths", () => {
        expect(toPath("./state.json")).toBe("./state.json");
        expect(toPath("data/*.ttl")).toBe("data/*.ttl");
        expect(toPath("/tmp/out.txt")).toBe("/tmp/out.txt");
    });

    test("keeps URLs of other schemes", () => {
        expect(toPath("https://example.org/rmlmapper.jar")).toBe(
            "https://example.org/rmlmapper.jar",
        );
    });

    test("turns a file: URL into the path it names", () => {
        expect(toPath("file:///tmp/out.txt")).toBe("/tmp/out.txt");
        expect(toPath("file:///tmp/ldes-disk/")).toBe("/tmp/ldes-disk/");
    });

    test("decodes percent-escapes", () => {
        expect(toPath("file:///tmp/my%20data/out.txt")).toBe(
            "/tmp/my data/out.txt",
        );
        expect(toPath("file:///tmp/a%23b%25c")).toBe("/tmp/a#b%c");
    });

    test("resolves a relative path against a base directory", () => {
        expect(toPath("processors/echo.ttl", "/etc/rdfc")).toBe(
            "/etc/rdfc/processors/echo.ttl",
        );
        expect(toPath("../echo.ttl", "/etc/rdfc/")).toBe("/etc/echo.ttl");
        expect(toPath("echo.ttl", "file:///etc/my%20rdfc/")).toBe(
            "/etc/my rdfc/echo.ttl",
        );
    });

    test("keeps absolute paths and URLs, whatever the base directory", () => {
        expect(toPath("/tmp/out.txt", "/etc/rdfc")).toBe("/tmp/out.txt");
        expect(toPath("file:///tmp/out.txt", "/etc/rdfc")).toBe("/tmp/out.txt");
        expect(toPath("https://example.org/data.ttl", "/etc/rdfc")).toBe(
            "https://example.org/data.ttl",
        );
    });
});

describe("fromPath", () => {
    test("turns an absolute path into a file: URL", () => {
        expect(fromPath("/tmp/out.txt")).toBe("file:///tmp/out.txt");
        expect(fromPath("/tmp/ldes-disk/")).toBe("file:///tmp/ldes-disk/");
    });

    test("resolves a relative path against the working directory", () => {
        expect(fromPath("./state.json")).toBe(
            pathToFileURL(resolve("./state.json")).href,
        );
        expect(fromPath("state.json")).toBe(fromPath("./state.json"));
    });

    test("escapes characters a URL cannot hold", () => {
        expect(fromPath("/tmp/my data/out.txt")).toBe(
            "file:///tmp/my%20data/out.txt",
        );
        expect(fromPath("/tmp/a#b%c")).toBe("file:///tmp/a%23b%25c");
    });

    test("keeps URLs", () => {
        expect(fromPath("file:///tmp/out.txt")).toBe("file:///tmp/out.txt");
        expect(fromPath("https://example.org/data.ttl")).toBe(
            "https://example.org/data.ttl",
        );
    });

    test("reads a drive letter as a path, not a scheme", () => {
        expect(fromPath("C:/data")).not.toBe("C:/data");
    });

    test("resolves a relative path against a base directory", () => {
        expect(fromPath("state.json", "/etc/my rdfc")).toBe(
            "file:///etc/my%20rdfc/state.json",
        );
        expect(fromPath("state.json", "file:///etc/rdfc/")).toBe(
            "file:///etc/rdfc/state.json",
        );
        expect(fromPath("/tmp/out.txt", "/etc/rdfc")).toBe(
            "file:///tmp/out.txt",
        );
        expect(fromPath("https://example.org/data.ttl", "/etc/rdfc")).toBe(
            "https://example.org/data.ttl",
        );
    });
});

describe("toPath and fromPath", () => {
    test("toPath undoes fromPath", () => {
        for (const path of [
            "/tmp/my data/out.txt",
            "/tmp/a#b%c",
            "/tmp/dir/",
        ]) {
            expect(toPath(fromPath(path))).toBe(path);
        }
        expect(toPath(fromPath("./state.json"))).toBe(resolve("./state.json"));
    });

    test("fromPath undoes toPath", () => {
        for (const url of [
            "file:///tmp/my%20data/out.txt",
            "https://example.org/data.ttl",
        ]) {
            expect(fromPath(toPath(url))).toBe(url);
        }
    });
});
