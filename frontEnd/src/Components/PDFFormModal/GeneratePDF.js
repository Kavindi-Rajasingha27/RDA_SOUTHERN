// GeneratePDF.js
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const GeneratePDF = async (
  roadName,
  roadType,
  estId,
  myNo = `DPA/MASANAA/EL/${new Date().toLocaleDateString("en-GB")}`,
  region = "Elpitiya",
  regionalEngineer = "Regional Engineer",
  officerInCharge = "Officer in Charge",
  recipientName = "Recipient Name",
  recipientAddress = "Recipient Address",
  paidDate = new Date("25/25/2024")
) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points (width x height)
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman); // Use Times-Roman for a professional look

  // Define consistent padding/margin and font size
  const padding = 50;
  const fontSize = 12; // Set a consistent font size

  // Header texts
  page.drawText("Regional Engineer's Office", {
    x: padding,
    y: height - padding - 30,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // Reference number and date
  page.drawText(`My Number: ${myNo}`, {
    x: padding,
    y: height - padding - 50,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Southern Province Road Development Authority", {
    x: padding,
    y: height - padding - 70,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`${region}.`, {
    x: padding,
    y: height - padding - 90,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`${regionalEngineer}`, {
    x: padding,
    y: height - padding - 110,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // Recipient details
  page.drawText("To:", {
    x: padding,
    y: height - padding - 150,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Officer in Charge", {
    x: padding,
    y: height - padding - 170,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText("National Water Supply and Drainage Board", {
    x: padding,
    y: height - padding - 190,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`${officerInCharge}`, {
    x: padding,
    y: height - padding - 210,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // Add fields for recipient details
  page.drawText(`Name of Water Connection Recipient: ${recipientName}`, {
    x: padding,
    y: height - padding - 290,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Address: ${recipientAddress}`, {
    x: padding,
    y: height - padding - 310,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Road: ${roadName}`, {
    x: padding,
    y: height - padding - 330,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  const capitalizeFirstLetter = (str) => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Main content
  const mainContent = `The provision of a water connection to the above-mentioned location is connected to the letter 
numbered ${estId} dated ${new Date().toLocaleDateString(
    "en-GB"
  )} issued by the manager of the National Water Supply and Drainage
Board.

Since Mr./Mrs. ${recipientName} has made a payment to this office on the date of 
${paidDate.toLocaleDateString(
  "en-GB"
)} for the purpose of compensating for the disturbance of the shoulder and section of the 
road when laying the water pipeline, I hereby grant the necessary approval for this disturbance.

(PF ………………………….)

Since this road is an ${capitalizeFirstLetter(
    roadType
  )} road, permission is granted only for the laying of the water pipeline 
through underground tunneling across the asphalt road.`;

  page.drawText(mainContent, {
    x: padding,
    y: height - padding - 370,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
    lineHeight: 16,
  });

  // Footer notes
  page.drawText("(The money you paid will not be refunded for any reason.)", {
    x: padding,
    y: padding + 100,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText("...............................", {
    x: padding,
    y: padding + 80,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Regional Engineer", {
    x: padding,
    y: padding + 60,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`${region}.`, {
    x: padding,
    y: padding + 40,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // Save PDF and open it
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url);
};
