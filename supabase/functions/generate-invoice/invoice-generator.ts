
import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib@1.17.1";
import { encode } from "npm:@stablelib/base64@1.0.1";

interface InvoiceData {
  order: any;
  company: any;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<string> {
  const { order, company } = data;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a blank page
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points
  
  // Get the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set page margins
  const margin = 50;
  const width = page.getWidth() - 2 * margin;
  
  // Draw the header
  page.drawText('INVOICE', {
    x: margin,
    y: page.getHeight() - margin - 30,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Draw invoice details
  page.drawText(`Invoice Number: ${order.reference}`, {
    x: margin,
    y: page.getHeight() - margin - 60,
    size: 12,
    font: font,
  });
  
  page.drawText(`Date: ${new Date(order.created_at).toLocaleDateString()}`, {
    x: margin,
    y: page.getHeight() - margin - 80,
    size: 12,
    font: font,
  });
  
  // Draw company info if available
  let yPos = page.getHeight() - margin - 120;
  page.drawText('From:', {
    x: margin,
    y: yPos,
    size: 12,
    font: boldFont,
  });
  
  yPos -= 20;
  page.drawText('Culinary Box AB', {
    x: margin,
    y: yPos,
    size: 12,
    font: font,
  });
  
  yPos -= 20;
  page.drawText('123 Food Street', {
    x: margin,
    y: yPos,
    size: 12,
    font: font,
  });
  
  yPos -= 20;
  page.drawText('Stockholm, Sweden', {
    x: margin,
    y: yPos,
    size: 12,
    font: font,
  });
  
  yPos -= 20;
  page.drawText('Org. Number: 123456-7890', {
    x: margin,
    y: yPos,
    size: 12,
    font: font,
  });
  
  // Draw customer info
  yPos = page.getHeight() - margin - 120;
  page.drawText('To:', {
    x: page.getWidth() - margin - 200,
    y: yPos,
    size: 12,
    font: boldFont,
  });
  
  yPos -= 20;
  page.drawText(company ? company.name : order.shipping_name, {
    x: page.getWidth() - margin - 200,
    y: yPos,
    size: 12,
    font: font,
  });
  
  if (company) {
    yPos -= 20;
    page.drawText(`Org. Number: ${company.organization_number}`, {
      x: page.getWidth() - margin - 200,
      y: yPos,
      size: 12,
      font: font,
    });
  }
  
  yPos -= 20;
  page.drawText(order.shipping_address, {
    x: page.getWidth() - margin - 200,
    y: yPos,
    size: 12,
    font: font,
  });
  
  yPos -= 20;
  page.drawText(`Email: ${order.shipping_email}`, {
    x: page.getWidth() - margin - 200,
    y: yPos,
    size: 12,
    font: font,
  });
  
  // Draw order items table
  yPos = page.getHeight() - margin - 250;
  
  // Table header
  page.drawText('Product', {
    x: margin,
    y: yPos,
    size: 12,
    font: boldFont,
  });
  
  page.drawText('Qty', {
    x: margin + 250,
    y: yPos,
    size: 12,
    font: boldFont,
  });
  
  page.drawText('Price', {
    x: margin + 300,
    y: yPos,
    size: 12,
    font: boldFont,
  });
  
  page.drawText('Total', {
    x: margin + 380,
    y: yPos,
    size: 12,
    font: boldFont,
  });
  
  // Draw a line under the header
  page.drawLine({
    start: { x: margin, y: yPos - 10 },
    end: { x: margin + width, y: yPos - 10 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Draw order items
  yPos -= 30;
  for (const item of order.order_items) {
    page.drawText(item.menu_items.name, {
      x: margin,
      y: yPos,
      size: 12,
      font: font,
    });
    
    page.drawText(item.quantity.toString(), {
      x: margin + 250,
      y: yPos,
      size: 12,
      font: font,
    });
    
    page.drawText(`${item.menu_items.base_price} SEK`, {
      x: margin + 300,
      y: yPos,
      size: 12,
      font: font,
    });
    
    page.drawText(`${item.total_price} SEK`, {
      x: margin + 380,
      y: yPos,
      size: 12,
      font: font,
    });
    
    yPos -= 20;
  }
  
  // Draw a line above the totals
  yPos -= 10;
  page.drawLine({
    start: { x: margin + 250, y: yPos },
    end: { x: margin + width, y: yPos },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Draw subtotal
  yPos -= 20;
  page.drawText('Subtotal:', {
    x: margin + 250,
    y: yPos,
    size: 12,
    font: boldFont,
  });
  
  page.drawText(`${order.subtotal_pre_tax} SEK`, {
    x: margin + 380,
    y: yPos,
    size: 12,
    font: font,
  });
  
  // Draw tax
  yPos -= 20;
  const taxAmount = order.product_tax_amount + 
    (order.admin_fee_tax_amount || 0) + 
    (order.delivery_fee_tax_amount || 0);
  
  page.drawText('Tax (25%):', {
    x: margin + 250,
    y: yPos,
    size: 12,
    font: boldFont,
  });
  
  page.drawText(`${taxAmount} SEK`, {
    x: margin + 380,
    y: yPos,
    size: 12,
    font: font,
  });
  
  // Draw discount if any
  if (order.discount_amount > 0) {
    yPos -= 20;
    page.drawText('Discount:', {
      x: margin + 250,
      y: yPos,
      size: 12,
      font: boldFont,
    });
    
    page.drawText(`-${order.discount_amount} SEK`, {
      x: margin + 380,
      y: yPos,
      size: 12,
      font: font,
    });
  }
  
  // Draw total
  yPos -= 30;
  page.drawLine({
    start: { x: margin + 250, y: yPos + 10 },
    end: { x: margin + width, y: yPos + 10 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Total:', {
    x: margin + 250,
    y: yPos,
    size: 14,
    font: boldFont,
  });
  
  page.drawText(`${order.total_amount} SEK`, {
    x: margin + 380,
    y: yPos,
    size: 14,
    font: boldFont,
  });
  
  // Draw payment instructions
  yPos -= 60;
  page.drawText('Payment Instructions', {
    x: margin,
    y: yPos,
    size: 14,
    font: boldFont,
  });
  
  yPos -= 20;
  page.drawText('Please make payment to:', {
    x: margin,
    y: yPos,
    size: 12,
    font: font,
  });
  
  yPos -= 20;
  page.drawText('Bank: Nordea Bank', {
    x: margin,
    y: yPos,
    size: 12,
    font: font,
  });
  
  yPos -= 20;
  page.drawText('Account: 12345-67890', {
    x: margin,
    y: yPos,
    size: 12,
    font: font,
  });
  
  yPos -= 20;
  page.drawText(`Reference: ${order.reference}`, {
    x: margin,
    y: yPos,
    size: 12,
    font: font,
  });
  
  yPos -= 40;
  page.drawText('Thank you for your business!', {
    x: margin,
    y: yPos,
    size: 12,
    font: boldFont,
  });
  
  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  
  // Convert to base64
  return encode(pdfBytes);
}
