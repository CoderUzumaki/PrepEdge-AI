import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { computeSpeechSummary } from "@prepedge/shared";

/**
 * @param {Object} report
 * @param {Object} [interview]
 */
export function downloadReportPdf(report, interview) {
  const doc = new jsPDF();
  const title = interview?.interview_name || report?.interviewName || "Interview Report";
  let y = 20;

  doc.setFontSize(18);
  doc.text("PrepEdge AI - Interview Report", 14, y);
  y += 10;
  doc.setFontSize(12);
  doc.text(title, 14, y);
  y += 8;
  doc.text(`Final Score: ${report.finalScore ?? "N/A"}%`, 14, y);
  y += 10;

  if (report.summary) {
    doc.setFontSize(10);
    doc.text("Summary:", 14, y);
    y += 6;
    const summaryLines = doc.splitTextToSize(report.summary, 180);
    doc.text(summaryLines, 14, y);
    y += summaryLines.length * 5 + 4;
  }

  if (report.strengths) {
    doc.setFontSize(10);
    doc.text("Strengths:", 14, y);
    y += 6;
    const lines = doc.splitTextToSize(report.strengths, 180);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 4;
  }

  if (report.areaOfImprovement) {
    doc.setFontSize(10);
    doc.text("Areas to Improve:", 14, y);
    y += 6;
    const lines = doc.splitTextToSize(report.areaOfImprovement, 180);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 4;
  }

  const speech = computeSpeechSummary(report.answers);
  if (speech) {
    doc.setFontSize(10);
    doc.text(
      `Speech: avg ${speech.avgWpm} WPM, ${speech.totalFillers} filler words across ${speech.questionsWithSpeech} answers`,
      14,
      y
    );
    y += 8;
  }

  const weakTopics = collectTopicTags(report.answers, "weak");
  const strongTopics = collectTopicTags(report.answers, "strong");
  if (weakTopics.length) {
    doc.text(`Weak topics: ${weakTopics.join(", ")}`, 14, y);
    y += 6;
  }
  if (strongTopics.length) {
    doc.text(`Strong topics: ${strongTopics.join(", ")}`, 14, y);
    y += 8;
  }

  (report.answers || []).forEach((a, i) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(11);
    doc.text(`Q${i + 1}: ${truncate(a.question, 90)}`, 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(`Score: ${a.score ?? "N/A"}%`, 14, y);
    y += 5;
    if (a.feedback) {
      const fb = doc.splitTextToSize(`Feedback: ${a.feedback}`, 180);
      doc.text(fb, 14, y);
      y += fb.length * 5;
    }
    if (a.speechMetrics?.wordsPerMinute) {
      doc.text(
        `Speech: ${a.speechMetrics.wordsPerMinute} WPM, ${a.speechMetrics.fillerCount ?? 0} fillers`,
        14,
        y
      );
      y += 5;
    }
    if (a.tags?.length) {
      doc.text(`Tags: ${a.tags.join(", ")}`, 14, y);
      y += 5;
    }
    y += 4;
  });

  const tableData = (report.answers || []).map((a, i) => [
    i + 1,
    truncate(a.question, 50),
    a.score ?? "-",
    a.speechMetrics?.wordsPerMinute ?? "-",
  ]);

  if (y > 200) {
    doc.addPage();
    y = 20;
  }

  autoTable(doc, {
    startY: y,
    head: [["#", "Question", "Score", "WPM"]],
    body: tableData,
    styles: { fontSize: 9 },
  });

  doc.save(`${title.replace(/\s+/g, "_")}_report.pdf`);
}

function truncate(text, max) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function collectTopicTags(answers, kind) {
  const tags = new Set();
  for (const a of answers || []) {
    for (const tag of a.tags || []) {
      const lower = tag.toLowerCase();
      if (kind === "weak" && (lower.includes("weak") || lower.includes("improve"))) {
        tags.add(tag);
      }
      if (kind === "strong" && (lower.includes("strong") || lower.includes("good"))) {
        tags.add(tag);
      }
    }
  }
  return [...tags];
}
