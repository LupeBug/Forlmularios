const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const files = [
    "leccion1/index.html",
    "leccion2/index.html",
    "leccion3/index.html",
    "leccion4/index.html",
    "leccion5/index.html",
    "leccion6/index.html",
    "leccion7/index.html",
    "leccion8/index.html",
    "leccion9/index.html",
    "leccion10/index.html",
    "leccion11/index.html",
    "leccion12/index.html",
    "leccion13/index.html",
  ];

  const pdfBuffers = [];

  for (const [i, file] of files.entries()) {
    const filePath = "file://" + path.resolve(file);
    await page.goto(filePath, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    pdfBuffers.push(pdfBuffer);
    console.log(`✅ Generado PDF temporal para: ${file}`);
  }

  await browser.close();

  // Combinar todos los buffers con pdf-lib
  const mergedPdf = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const finalPdfBytes = await mergedPdf.save();
  fs.writeFileSync("curso_completo.pdf", finalPdfBytes);

  console.log("✅ PDF final generado: curso_completo.pdf");
})();
