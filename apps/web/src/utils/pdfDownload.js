import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadReportPdf(report, interview) {
  const doc = new jsPDF();
  const title = interview?.interview_name || "Interview Report";

  doc.setFontSize(18);
  doc.text("PrepEdge AI - Interview Report", 14, 20);
  doc.setFontSize(12);
  doc.text(title, 14, 30);
  doc.text(`Final Score: ${report.finalScore ?? "N/A"}%`, 14, 38);

  if (report.summary) {
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(report.summary, 180);
    doc.text("Summary:", 14, 48);
    doc.text(summaryLines, 14, 54);
  }

  const tableData = (report.answers || []).map((a, i) => [
    i + 1,
    a.question?.slice(0, 60) + (a.question?.length > 60 ? "..." : ""),
    a.score ?? "-",
  ]);

  autoTable(doc, {
    startY: report.summary ? 80 : 50,
    head: [["#", "Question", "Score"]],
    body: tableData,
  });

  doc.save(`${title.replace(/\s+/g, "_")}_report.pdf`);
}
