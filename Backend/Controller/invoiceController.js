const Invoice = require('../Modal/Invoicemodal.js');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

const convertImageToBase64 = (filePath) => {
  const imageData = fs.readFileSync(filePath);
  const base64Image = imageData.toString('base64');
  const mimeType = 'image/png'; // Update to correct mime type if necessary
  return `data:${mimeType};base64,${base64Image}`;
};

const fillTemplate = (template, data) => {
  let filledTemplate = template;
  Object.keys(data).forEach((key) => {
    const placeholder = `{{${key}}}`;
    filledTemplate = filledTemplate.replace(new RegExp(placeholder, 'g'), data[key]);
  });
  return filledTemplate;
};

const generatePdfContent = async (invoice) => {
  const templatePath = path.join(__dirname, '../InvoicegeneraterPDF/invoicegenerater.html');
  const templateContent = fs.readFileSync(templatePath, 'utf-8');

  const logoPath = path.join(__dirname, '../InvoicegeneraterPDF/logo.png');
  const logoBase64 = convertImageToBase64(logoPath);

  const filledContent = fillTemplate(templateContent, {
    companyName: invoice.sellerDetails.name,
    billingAddress: `${invoice.billingDetails.address}, ${invoice.billingDetails.city}, ${invoice.billingDetails.state} - ${invoice.billingDetails.pincode}`,
    shippingAddress: `${invoice.shippingDetails.address}, ${invoice.shippingDetails.city}, ${invoice.shippingDetails.state} - ${invoice.shippingDetails.pincode}`,
    panNo: invoice.sellerDetails.panNo || '',
    gstNo: invoice.sellerDetails.gstNo || '',
    stateUTCode: invoice.billingDetails.state || '',
    placeOfSupply: invoice.placeOfSupply || '',
    placeOfDelivery: invoice.placeOfDelivery || '',
    orderNumber: invoice.orderDetails.orderId || '',
    orderDate: new Date(invoice.orderDetails.orderDate).toLocaleDateString() || '',
    invoiceNumber: invoice.invoiceDetails.invoiceNumber || '',
    invoiceDate: new Date(invoice.invoiceDetails.invoiceDate).toLocaleDateString() || '',
    totalAmount: invoice.totalAmount.toFixed(2),
    totalAmountInWords: invoice.totalAmountInWords || '',
    itemsRows: invoice.items.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.description}</td>
        <td>${item.unitPrice.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
        <td>${item.taxRate}%</td>
        <td>${item.taxRate ? 'GST' : 'N/A'}</td>
        <td>${((item.unitPrice * item.quantity) * (item.taxRate / 100)).toFixed(2)}</td>
        <td>${((item.unitPrice * item.quantity) * (1 + (item.taxRate / 100))).toFixed(2)}</td>
      </tr>
    `).join(''),
    logoBase64,
  });

  return filledContent;
};

const calculateTotalAmount = (items) => {
  let total = 0;
  items.forEach(item => {
    const netAmount = item.unitPrice * item.quantity;
    const taxAmount = (netAmount * item.taxRate) / 100;
    total += netAmount + taxAmount;
  });
  return total;
};

const convertToWords = (amount) => {
  // Placeholder function for converting amount to words
  return 'One Thousand Two Hundred Thirty-Four and Fifty-Six Cents';
};

const createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    const newInvoice = new Invoice(invoiceData);

    newInvoice.totalAmount = calculateTotalAmount(newInvoice.items);
    newInvoice.totalAmountInWords = convertToWords(newInvoice.totalAmount);

    await newInvoice.save();

    const htmlContent = await generatePdfContent(newInvoice);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const pdfDirectory = path.join(__dirname, '../GeneratedPdf');
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true });
    }
    const uniqueFileName = `invoice_${newInvoice.invoiceDetails.invoiceNumber || uuidv4()}.pdf`;
    const pdfFilePath = path.join(pdfDirectory, uniqueFileName);
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    res.download(pdfFilePath, 'invoice.pdf',(err) => {
      if (err) {
        console.error('Error downloading PDF:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error generating or downloading the PDF' });
        }
      } else {
        res.status(200).json({ message: 'PDF downloaded successfully' });
      }
    });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  }
};

module.exports = createInvoice;
