/** Strict CSV: quoted newlines and escaped quotes are supported; malformed rows fail closed. */
export function parseCsv(text: string): string[][] {
  if (Buffer.byteLength(text) > 5 * 1024 * 1024) throw new Error('CSV exceeds 5 MiB.');
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false, closed = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else field += c;
    } else if (c === ',' || c === '\n' || c === '\r') {
      row.push(field); field = ''; closed = false;
      if (c !== ',') {
        rows.push(row); row = [];
        if (c === '\r' && text[i + 1] === '\n') i++;
        if (rows.length > 10001) throw new Error('CSV exceeds 10000 records.');
      }
    } else if (c === '"' && field === '' && !closed) quoted = true;
    else {
      if (closed || c === '"') throw new Error('Malformed CSV quoting.');
      field += c;
    }
  }
  if (quoted) throw new Error('Unclosed CSV quote.');
  if (field || row.length || closed) { row.push(field); rows.push(row); }
  if (rows.length > 10001) throw new Error('CSV exceeds 10000 records.');
  return rows;
}
