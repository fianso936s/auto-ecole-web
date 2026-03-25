interface PrintReportOptions {
  title: string;
  subtitle?: string;
  stats?: { label: string; value: string | number }[];
  columns: string[];
  rows: string[][];
}

export function printReport({ title, subtitle, stats, columns, rows }: PrintReportOptions) {
  const w = window.open("", "_blank");
  if (!w) return;

  const statsHTML = stats
    ? `<div class="stats-grid">${stats.map((s) => `<div class="stat-card"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`).join("")}</div>`
    : "";

  const tableHTML = `
    <table>
      <thead><tr>${columns.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  `;

  w.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title} - bayaNail</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #2C2C2C; padding: 40px; }
    .header { border-bottom: 3px solid #D4A0A0; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 24px; font-weight: 700; color: #2C2C2C; }
    .header .subtitle { font-size: 13px; color: #888; margin-top: 4px; }
    .header .brand { font-size: 12px; color: #B87878; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }
    .header .date { font-size: 11px; color: #aaa; margin-top: 4px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .stat-card { border: 1px solid #eee; border-radius: 8px; padding: 16px; text-align: center; }
    .stat-value { font-size: 22px; font-weight: 700; color: #B87878; }
    .stat-label { font-size: 11px; color: #888; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f8f4f2; color: #2C2C2C; font-weight: 600; text-align: left; padding: 10px 12px; border-bottom: 2px solid #D4A0A0; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
    td { padding: 8px 12px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) td { background: #fdfbfa; }
    .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #eee; text-align: center; font-size: 10px; color: #aaa; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">bayaNail CRM</div>
    <h1>${title}</h1>
    ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ""}
    <div class="date">Généré le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
  </div>
  ${statsHTML}
  ${tableHTML}
  <div class="footer">bayaNail - Bar à Ongles Aubervilliers</div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`);
  w.document.close();
}
