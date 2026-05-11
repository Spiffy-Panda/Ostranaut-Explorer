// save-zip-reader.js — minimal in-browser ZIP reader for Ostranauts save
// archives. Uses the platform DecompressionStream API (no third-party
// libraries) so the page still runs from file:// without a build step.
//
// Browser support for DecompressionStream("deflate-raw"):
//   Chrome 113+, Firefox 113+, Safari 16.4+. The page will fail loudly
//   (uploadError with a hint) when running in an older browser.
//
// Exposes:
//   window.SaveZipReader.readEntries(uint8Array)
//     → Promise<[{ name, compressedSize, uncompressedSize, getBytes() }]>
//
// Each entry's getBytes() returns a Promise<Uint8Array> lazily — we
// don't decompress every ship up front (a 42 MB save has ~250 MB of
// uncompressed ships). Decompress only the entry the modder selects.
//
// We deliberately skip ZIP64 support and any non-DEFLATE compression
// methods other than STORE. Game-engine saves are well under 4 GB and
// always use either STORE or DEFLATE; if some future save violates
// that, the error message points the modder at the failing entry.

(function () {
  "use strict";

  // ─── ZIP format constants ──────────────────────────────────────────────
  const SIG_LFH  = 0x04034b50;  // local file header
  const SIG_CDH  = 0x02014b50;  // central directory header
  const SIG_EOCD = 0x06054b50;  // end of central directory

  const METHOD_STORE   = 0;
  const METHOD_DEFLATE = 8;

  // ─── byte-level helpers ────────────────────────────────────────────────
  function u16(view, off) { return view.getUint16(off, /*littleEndian*/ true); }
  function u32(view, off) { return view.getUint32(off, /*littleEndian*/ true); }

  // Decode a filename. ZIP stores it as bytes; bit 11 of the GP flag means
  // UTF-8. Otherwise the spec says CP437, but in practice nothing modern
  // produces non-ASCII filenames without the UTF-8 bit, and the Ostranauts
  // save zips have plain ASCII paths. Treat as UTF-8 either way — it's a
  // pure superset of ASCII so plain paths come through unchanged.
  const UTF8 = new TextDecoder("utf-8");

  // ─── locate the End-of-Central-Directory record ────────────────────────
  // EOCD is at the tail of the file. It has an 18-byte fixed part + a
  // variable-length zip-file comment. The comment is rarely present in
  // practice — scan back from the file end up to 64 KB for the signature.
  function findEOCD(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const minPos = Math.max(0, bytes.length - 65536 - 22);
    for (let i = bytes.length - 22; i >= minPos; i--) {
      if (u32(view, i) === SIG_EOCD) {
        return {
          offset: i,
          totalEntries:    u16(view, i + 10),
          cdSize:          u32(view, i + 12),
          cdOffset:        u32(view, i + 16),
        };
      }
    }
    throw new Error("Not a ZIP file (end-of-central-directory record not found).");
  }

  // ─── walk the central directory ────────────────────────────────────────
  // Returns the entry metadata + offset of each entry's local file header.
  function walkCD(bytes, eocd) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const entries = [];
    let p = eocd.cdOffset;
    for (let i = 0; i < eocd.totalEntries; i++) {
      if (u32(view, p) !== SIG_CDH) {
        throw new Error(`ZIP central directory entry ${i} has wrong signature.`);
      }
      const flags         = u16(view, p + 8);
      const method        = u16(view, p + 10);
      const compressedSize = u32(view, p + 20);
      const uncompressedSize = u32(view, p + 24);
      const nameLen       = u16(view, p + 28);
      const extraLen      = u16(view, p + 30);
      const commentLen    = u16(view, p + 32);
      const lfhOffset     = u32(view, p + 42);
      const nameBytes     = bytes.subarray(p + 46, p + 46 + nameLen);
      const name          = UTF8.decode(nameBytes);
      entries.push({
        name, flags, method, compressedSize, uncompressedSize, lfhOffset,
      });
      p += 46 + nameLen + extraLen + commentLen;
    }
    return entries;
  }

  // ─── decompress one entry's data ───────────────────────────────────────
  // The local file header has the *real* nameLen + extraLen (the central
  // dir's extra-field bytes can differ from the LFH's). Re-read them to
  // skip past the header correctly.
  async function readEntryBytes(bytes, entry) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const p = entry.lfhOffset;
    if (u32(view, p) !== SIG_LFH) {
      throw new Error(`Local file header for "${entry.name}" has wrong signature.`);
    }
    const nameLen  = u16(view, p + 26);
    const extraLen = u16(view, p + 28);
    const dataStart = p + 30 + nameLen + extraLen;
    const dataEnd   = dataStart + entry.compressedSize;
    const compressed = bytes.subarray(dataStart, dataEnd);

    if (entry.method === METHOD_STORE) {
      // Copy so callers can treat the result as owned (avoid surprises
      // when the underlying buffer is held by the file upload).
      return new Uint8Array(compressed);
    }
    if (entry.method !== METHOD_DEFLATE) {
      throw new Error(
        `Unsupported ZIP compression method ${entry.method} for "${entry.name}". ` +
        `Only STORE (0) and DEFLATE (8) are supported.`);
    }
    if (typeof DecompressionStream === "undefined") {
      throw new Error(
        "This browser lacks DecompressionStream. Use a recent Chrome, " +
        "Firefox, or Safari (113+/113+/16.4+).");
    }
    // ZIP uses raw DEFLATE (no zlib wrapper) — hence "deflate-raw".
    const stream = new Blob([compressed]).stream()
      .pipeThrough(new DecompressionStream("deflate-raw"));
    const out = await new Response(stream).arrayBuffer();
    return new Uint8Array(out);
  }

  // ─── public API ────────────────────────────────────────────────────────

  async function readEntries(uint8Array) {
    const eocd = findEOCD(uint8Array);
    const meta = walkCD(uint8Array, eocd);
    // Lazy bytes getter per entry — decompress only when asked.
    return meta.map((entry) => ({
      name: entry.name,
      compressedSize: entry.compressedSize,
      uncompressedSize: entry.uncompressedSize,
      method: entry.method,
      getBytes: () => readEntryBytes(uint8Array, entry),
      // Convenience: read + decode as UTF-8 text.
      getText: async function () {
        const bytes = await readEntryBytes(uint8Array, entry);
        return UTF8.decode(bytes);
      },
    }));
  }

  window.SaveZipReader = { readEntries };
})();
