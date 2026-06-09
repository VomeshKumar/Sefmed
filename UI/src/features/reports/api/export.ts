import { logAuditEvent } from "@/features/sales/api/index";

export function exportToCSV(
  headers: { label: string; fieldName: string }[],
  rows: Record<string, any>[],
  filename: string,
  reportId = "custom",
  userId = "emp-004"
) {
  const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(",");
  const bodyRows = rows.map((row) =>
    headers
      .map((h) => {
        const val = row[h.fieldName] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csvContent = [headerRow, ...bodyRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  logAuditEvent("report.exported", `Report downloaded as CSV. Rows: ${rows.length}`, reportId, userId);
}

export function exportToExcel(
  headers: { label: string; fieldName: string }[],
  rows: Record<string, any>[],
  filename: string,
  reportId = "custom",
  userId = "emp-004"
) {
  let xml = '<?xml version="1.0"?>\n';
  xml += '<?mso-application progid="Excel.Sheet"?>\n';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
  xml += ' xmlns:o="urn:schemas-microsoft-com:office:binoculars"\n';
  xml += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
  xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
  xml += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
  xml += ' <Styles>\n';
  xml += '  <Style ss:ID="Header">\n';
  xml += '   <Font ss:Bold="1" ss:Color="#FFFFFF"/>\n';
  xml += '   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>\n';
  xml += '  </Style>\n';
  xml += '  <Style ss:ID="Default">\n';
  xml += '   <Alignment ss:Vertical="Center"/>\n';
  xml += '  </Style>\n';
  xml += ' </Styles>\n';
  xml += ' <Worksheet ss:Name="Sheet1">\n';
  xml += '  <Table>\n';

  // Headers
  xml += '   <Row ss:Height="22">\n';
  headers.forEach((h) => {
    xml += `    <Cell ss:StyleID="Header"><Data ss:Type="String">${h.label}</Data></Cell>\n`;
  });
  xml += "   </Row>\n";

  // Rows
  rows.forEach((row) => {
    xml += "   <Row>\n";
    headers.forEach((h) => {
      const val = row[h.fieldName];
      const isNum = typeof val === "number" && !isNaN(val);
      const cellType = isNum ? "Number" : "String";
      const cleanVal = val !== undefined && val !== null ? String(val) : "";
      xml += `    <Cell><Data ss:Type="${cellType}">${cleanVal}</Data></Cell>\n`;
    });
    xml += "   </Row>\n";
  });

  xml += "  </Table>\n";
  xml += " </Worksheet>\n";
  xml += "</Workbook>\n";

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  logAuditEvent("report.exported", `Report downloaded as Excel. Rows: ${rows.length}`, reportId, userId);
}
