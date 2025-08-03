const nodemailer = require('nodemailer');

exports.handleContactSubmission = async (req, res) => {
  const { name, email, phone, inquiry } = req.body;

  if (!name || !email || !phone || !inquiry) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Little Flowers Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact Number:</strong> ${phone}</p>
        <p><strong>Inquiry:</strong><br>${inquiry.replace(/\n/g, '<br>')}</p>
      `
    });

    res.json({ success: true, message: "Your message has been sent!" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
};
