import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import imagekit from "../db/imagekit.js";

export const createBeautifulPDF = async (req, res) => {
  try {
    const { patient, doctor, diagnosis, medicines, checkups, notes } = req.body;

    // ABSOLUTE TEMP FOLDER
    const folder = path.join(process.cwd(), "temp_pdf");
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    const fileName = `prescription_${Date.now()}.pdf`;
    const filePath = path.join(folder, fileName);

    console.log("📁 Creating PDF at:", filePath);

    // CREATE PDF
    const doc = new PDFDocument({ size: "A4" });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // ------------------ PDF CONTENT --------------------
    doc.fontSize(20).text("CITYCARE MULTISPECIALITY HOSPITAL", { align: "center" });
    doc.moveDown();

    doc.fontSize(11).text("MG Road, Indore | +91 98765 43210", { align: "center" });
    doc.moveDown();

    doc.fontSize(16).text("PRESCRIPTION REPORT", { align: "center" });
    doc.moveDown();

    doc.fontSize(13).text("👤 PATIENT DETAILS", { underline: true });
    doc.fontSize(11);
    doc.text(`Name: ${patient?.name || "N/A"}`);
    doc.text(`Age/Gender: ${patient?.age || "?"} / ${patient?.gender || "?"}`);
    doc.text(`Patient ID: ${patient?.id || "N/A"}`);
    doc.text(`Date: ${new Date().toDateString()}`);
    doc.moveDown();

    doc.end();

    // WAIT UNTIL PDF IS FULLY WRITTEN
    await new Promise((resolve) => writeStream.on("finish", resolve));
    console.log("📄 PDF Finished Writing!");

    // CHECK IF PDF EXISTS + SIZE
    console.log("📄 PDF exists:", fs.existsSync(filePath));
    console.log("📄 PDF size:", fs.statSync(filePath).size, "bytes");

    const pdfBuffer = fs.readFileSync(filePath);

    // DEBUG BEFORE UPLOAD
    console.log("📤 Uploading to ImageKit...");
    console.log("📤 Buffer length:", pdfBuffer.length);
    console.log("📤 Upload path:", "prescriptions/" + fileName);

    // ------------------ IMAGEKIT UPLOAD --------------------
    const upload = await imagekit.upload({
      file: pdfBuffer,
      fileName: fileName,
      folder: "prescriptions" // no leading slash
    });

    console.log("✅ ImageKit Upload Success:", upload.url);

    // DELETE TEMP PDF
    fs.unlinkSync(filePath);

    return res.json({
      success: true,
      pdfUrl: upload.url
    });

  } catch (err) {
    console.log("🔥 RAW ERROR:", err);

    if (err?.response) {
      console.log("🔥 RESPONSE ERROR:", err.response);
    }

    if (err?.error) {
      console.log("🔥 IMAGEKIT ERROR:", err.error);
    }

    if (err?.message) {
      console.log("🔥 ERROR MESSAGE:", err.message);
    }

    return res.status(500).json({
      success: false,
      message: "PDF upload failed",
      error: err.message || err
    });
  }
};
