import PDFDocument from "pdfkit";
import { createSeedAdminContent, type AdminContent, type AdminNews, type AdminPerson, type AdminProject, type AdminService } from "@/lib/admin-demo-data";
import { adminNewsToNewsItem, adminServiceTags, getLiveContent, parseAboutMessages } from "@/lib/live-content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PdfDoc = InstanceType<typeof PDFDocument>;

const margin = 42;
const pageBottom = 760;

function clean(value?: string) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function line(value?: string, fallback = "Not specified") {
  return clean(value) || fallback;
}

function truncate(value: string, length = 520) {
  const text = clean(value);
  return text.length > length ? `${text.slice(0, length).trim()}...` : text;
}

function splitLines(value?: string) {
  return (value ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeContent(content: AdminContent): AdminContent {
  const seed = createSeedAdminContent();

  return {
    settings: {
      ...seed.settings,
      ...(content.settings ?? {})
    },
    projects: (content.projects?.length ? content.projects : seed.projects).map(
      (project, index): AdminProject => ({
        ...seed.projects[index % seed.projects.length],
        ...project,
        id: project.id || `project-${index + 1}`,
        media: project.media ?? []
      })
    ),
    services: (content.services?.length ? content.services : seed.services).map(
      (service, index): AdminService => ({
        ...seed.services[index % seed.services.length],
        ...service,
        id: service.id || `service-${index + 1}`
      })
    ),
    news: (content.news?.length ? content.news : seed.news).map(
      (item, index): AdminNews => ({
        ...seed.news[index % seed.news.length],
        ...item,
        id: item.id || `news-${index + 1}`
      })
    ),
    people: (content.people?.length ? content.people : seed.people).map(
      (person, index): AdminPerson => ({
        ...seed.people[index % seed.people.length],
        ...person,
        id: person.id || `person-${index + 1}`
      })
    )
  };
}

function collectPdf(doc: PdfDoc) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

async function imageBuffer(source?: string) {
  if (!source) {
    return null;
  }

  if (source.startsWith("data:image/")) {
    const base64 = source.split(",")[1];
    return base64 ? Buffer.from(base64, "base64") : null;
  }

  try {
    const response = await fetch(source, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!/image\/(jpeg|jpg|png)/i.test(contentType) && !/\.(jpe?g|png)(\?|$)/i.test(source)) {
      return null;
    }

    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  }
}

function addFooter(doc: PdfDoc, companyName: string) {
  const range = doc.bufferedPageRange();
  const width = doc.page.width - margin * 2;
  const activePage = range.start + range.count - 1;
  const activeY = doc.y;
  const footerY = doc.page.height - margin - 28;

  for (let index = range.start; index < range.start + range.count; index += 1) {
    doc.switchToPage(index);
    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor("#777777")
      .text(`${companyName} Catalogue / ${index + 1}`, margin, footerY, {
        width,
        align: "right",
        lineBreak: false
      });
  }

  doc.switchToPage(activePage);
  doc.y = activeY;
}

function ensureSpace(doc: PdfDoc, height: number) {
  if (doc.y + height > pageBottom) {
    doc.addPage();
  }
}

function section(doc: PdfDoc, label: string, title: string) {
  ensureSpace(doc, 92);
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(8).fillColor("#777777").text(label.toUpperCase(), {
    characterSpacing: 2
  });
  doc.moveDown(0.45);
  doc.font("Times-Roman").fontSize(28).fillColor("#111111").text(title, {
    lineGap: 2
  });
  doc.moveDown(0.8);
}

function bodyText(doc: PdfDoc, text: string, width?: number) {
  doc.font("Helvetica").fontSize(9.5).fillColor("#333333").text(clean(text), {
    width: width ?? doc.page.width - margin * 2,
    lineGap: 3
  });
}

function metaText(doc: PdfDoc, text: string, width?: number) {
  doc.font("Helvetica").fontSize(7.5).fillColor("#777777").text(clean(text).toUpperCase(), {
    width: width ?? doc.page.width - margin * 2,
    characterSpacing: 1
  });
}

function metaTextAt(doc: PdfDoc, text: string, x: number, y: number, width: number) {
  doc.font("Helvetica").fontSize(7.5).fillColor("#777777").text(clean(text).toUpperCase(), x, y, {
    width,
    characterSpacing: 1,
    lineBreak: false
  });
}

async function drawImage(doc: PdfDoc, source: string, x: number, y: number, width: number, height: number) {
  const buffer = await imageBuffer(source);
  doc.save();
  doc.rect(x, y, width, height).fill("#f1f1f1");

  if (buffer) {
    try {
      doc.image(buffer, x, y, {
        fit: [width, height],
        align: "center",
        valign: "center"
      });
    } catch {
      doc.rect(x, y, width, height).fill("#f1f1f1");
    }
  }

  doc.restore();
}

async function buildCataloguePdf() {
  const content = normalizeContent(await getLiveContent());
  const width = 595.28 - margin * 2;
  const doc = new PDFDocument({
    size: "A4",
    margin,
    bufferPages: true,
    autoFirstPage: true,
    info: {
      Title: `${line(content.settings.companyName, "Company")} Catalogue`,
      Author: line(content.settings.companyName, "Company"),
      Subject: "Company portfolio catalogue"
    }
  });
  const pdf = collectPdf(doc);

  const logo = await imageBuffer(content.settings.logoUrl);
  if (logo) {
    try {
      doc.image(logo, margin, 54, { fit: [72, 72] });
    } catch {
      doc.rect(margin, 54, 72, 72).fill("#f1f1f1");
    }
  }

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#777777")
    .text(line(content.settings.tagline, "Architecture Studio").toUpperCase(), margin, 155, { characterSpacing: 3 });
  doc
    .font("Times-Roman")
    .fontSize(48)
    .fillColor("#111111")
    .text(line(content.settings.companyName, "Company"), margin, 185, { width, lineGap: 1 });
  doc
    .font("Helvetica")
    .fontSize(13)
    .fillColor("#333333")
    .text(line(content.settings.homeTagline, content.settings.aboutStudioProfile), margin, 315, { width: width * 0.78, lineGap: 5 });

  doc.moveTo(margin, 705).lineTo(margin + width, 705).strokeColor("#111111").stroke();
  doc.font("Helvetica").fontSize(9).fillColor("#333333");
  doc.text(line(content.settings.email), margin, 725, { width: 160 });
  doc.text(line(content.settings.phone), margin + 175, 725, { width: 150 });
  doc.text(line(content.settings.address), margin + 335, 725, { width: 175 });

  doc.addPage();
  section(doc, "Studio Profile", "Company Overview");
  bodyText(doc, line(content.settings.aboutStudioProfile));
  doc.moveDown(0.8);
  bodyText(doc, `Mission: ${line(content.settings.aboutMission)}`);
  doc.moveDown(0.5);
  bodyText(doc, `Vision: ${line(content.settings.aboutVision)}`);
  doc.moveDown(0.5);
  parseAboutMessages(content).forEach((message) => {
    bodyText(doc, `${line(message.name)} / ${line(message.role)}: ${line(message.message)}`);
    doc.moveDown(0.5);
  });
  doc.moveDown(1.2);
  const statY = doc.y;
  [
    ["Years Active", line(content.settings.statYears, "0")],
    ["Projects", line(content.settings.statProjects, `${content.projects.length}`)],
    ["Countries", line(content.settings.statCountries, "0")]
  ].forEach(([label, value], index) => {
    const cellWidth = width / 3;
    const x = margin + index * cellWidth;
    doc.font("Times-Roman").fontSize(30).fillColor("#111111").text(value, x, statY, {
      width: cellWidth,
      align: "center"
    });
    doc.font("Helvetica").fontSize(7.5).fillColor("#777777").text(label.toUpperCase(), x, statY + 38, {
      width: cellWidth,
      align: "center",
      characterSpacing: 1
    });
  });

  doc.addPage();
  section(doc, "Projects", "Selected Portfolio");
  for (const project of content.projects) {
    ensureSpace(doc, 150);
    const y = doc.y;
    const textX = margin + 165;
    const textWidth = width - 165;
    await drawImage(doc, project.image, margin, y, 145, 96);
    metaTextAt(doc, `${line(project.section)} / ${line(project.subsection)} / ${line(project.year)}`, textX, y, textWidth);
    doc.font("Times-Roman").fontSize(19).fillColor("#111111").text(line(project.title, "Untitled Project"), textX, y + 19, {
      width: textWidth
    });
    metaTextAt(doc, line(project.location), textX, y + 43, textWidth);
    doc.font("Helvetica").fontSize(8.6).fillColor("#333333").text(truncate(project.description, 430), textX, y + 62, {
      width: textWidth,
      height: 54,
      lineGap: 2
    });
    doc.y = y + 125;
    doc.moveTo(margin, doc.y).lineTo(margin + width, doc.y).strokeColor("#dddddd").stroke();
    doc.moveDown(0.8);
  }

  doc.addPage();
  section(doc, "Services", "Capabilities");
  for (const service of content.services) {
    ensureSpace(doc, 130);
    const y = doc.y;
    const textX = margin + 142;
    const textWidth = width - 142;
    await drawImage(doc, service.image, margin, y, 122, 82);
    metaTextAt(doc, adminServiceTags(service).join(" / "), textX, y, textWidth);
    doc.font("Times-Roman").fontSize(18).fillColor("#111111").text(line(service.title, "Service"), textX, y + 18, {
      width: textWidth
    });
    doc.font("Helvetica").fontSize(8.8).fillColor("#333333").text(truncate(service.description, 300), textX, y + 46, {
      width: textWidth,
      lineGap: 2
    });
    doc.y = y + 104;
    doc.moveTo(margin, doc.y).lineTo(margin + width, doc.y).strokeColor("#dddddd").stroke();
    doc.moveDown(0.8);
  }

  doc.addPage();
  section(doc, "People", "Team");
  for (const person of content.people) {
    ensureSpace(doc, 112);
    const y = doc.y;
    const textX = margin + 90;
    const textWidth = width - 90;
    await drawImage(doc, person.image, margin, y, 70, 70);
    doc.font("Times-Roman").fontSize(17).fillColor("#111111").text(line(person.name, "Team Member"), textX, y, {
      width: textWidth
    });
    metaTextAt(doc, line(person.role), textX, y + 25, textWidth);
    doc.font("Helvetica").fontSize(8.6).fillColor("#333333").text(truncate(person.bio, 240), textX, y + 42, {
      width: textWidth,
      lineGap: 2
    });
    doc.y = y + 90;
  }

  doc.addPage();
  section(doc, "News", "Recent Updates");
  for (const item of content.news.map(adminNewsToNewsItem)) {
    ensureSpace(doc, 105);
    metaText(doc, `${item.category} / ${item.date}`);
    doc.moveDown(0.25);
    doc.font("Times-Roman").fontSize(17).fillColor("#111111").text(item.title, { width });
    doc.moveDown(0.25);
    bodyText(doc, truncate(item.excerpt, 320));
    doc.moveDown(0.9);
  }

  section(doc, "Contact", "Offices");
  for (const office of splitLines(content.settings.offices)) {
    bodyText(doc, office);
    doc.moveDown(0.25);
  }
  doc.moveDown(0.5);
  bodyText(doc, `${line(content.settings.email)} / ${line(content.settings.phone)} / ${line(content.settings.facebook)}`);

  addFooter(doc, line(content.settings.companyName, "Company"));
  doc.end();
  return {
    buffer: await pdf,
    fileName: `${line(content.settings.companyName, "company")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()}-catalogue.pdf`
  };
}

async function buildFallbackPdf(error: unknown) {
  const doc = new PDFDocument({ size: "A4", margin });
  const pdf = collectPdf(doc);
  const message = error instanceof Error ? error.message : "Unknown PDF error";

  doc.font("Times-Roman").fontSize(28).fillColor("#111111").text("Catalogue", { width: 500 });
  doc.moveDown(0.8);
  doc.font("Helvetica").fontSize(11).fillColor("#333333").text("The catalogue generator could not finish the rich layout. This fallback PDF confirms the endpoint is working and shows the server error for repair:");
  doc.moveDown(0.8);
  doc.font("Helvetica").fontSize(9).fillColor("#880000").text(message, { width: 500 });
  doc.end();

  return {
    buffer: await pdf,
    fileName: "catalogue.pdf"
  };
}

export async function GET() {
  let result: Awaited<ReturnType<typeof buildCataloguePdf>>;

  try {
    result = await buildCataloguePdf();
  } catch (error) {
    result = await buildFallbackPdf(error);
  }

  return new Response(new Uint8Array(result.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${result.fileName}"`
    }
  });
}
