import { Resend } from 'resend';
import { config } from '../config/env.js';
import type { LeadData, ContactFormData } from './googleSheets.js';

const resend = new Resend(config.resendApiKey);

/**
 * Format currency in Indian format
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Send email notification to admin for new calculator lead
 */
export async function sendLeadNotification(lead: LeadData): Promise<boolean> {
  if (!config.resendApiKey) {
    console.log('Resend API key not configured, skipping email');
    return false;
  }

  try {
    const customerTypeLabel = lead.customerType === 'residential' ? '🏠 Residential' : '🏢 Commercial';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff9010 0%, #ff6b00 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🌞 New Calculator Lead!</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #ff9010; padding-bottom: 10px;">
            Customer Details
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right;">
                <a href="tel:+91${lead.phone}" style="color: #ff9010; text-decoration: none;">+91 ${lead.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Customer Type</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right;">${customerTypeLabel}</td>
            </tr>
          </table>

          <h2 style="color: #333; margin-top: 30px; border-bottom: 2px solid #ff9010; padding-bottom: 10px;">
            Calculator Results
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Monthly Bill</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right;">${formatCurrency(lead.monthlyBill)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">System Size</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right;">${lead.systemSize} kW</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Effective Cost</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right; color: #ff9010;">${formatCurrency(lead.effectiveCost)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666;">Annual Savings</td>
              <td style="padding: 12px 0; font-weight: bold; text-align: right; color: #22c55e;">${formatCurrency(lead.annualSavings)}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; padding: 15px; background: #fff5e6; border-radius: 8px; border-left: 4px solid #ff9010;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              💡 <strong>Tip:</strong> Quick follow-up increases conversion rates. Contact this lead within 24 hours!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>This is an automated notification from Green India Solar Calculator</p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'Green India Solar <onboarding@resend.dev>',
      to: config.adminEmail,
      subject: `🌞 Calculator Lead: ${lead.name} - ${customerTypeLabel}`,
      html: htmlContent,
    });

    // Log the full response for debugging
    console.log('Resend API Response:', JSON.stringify(result, null, 2));

    if (result.error) {
      console.error('Resend error:', result.error);
      return false;
    }

    console.log('Email notification sent successfully, ID:', result.data?.id);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}

/**
 * Send email notification to admin for new contact form lead
 */
export async function sendContactFormNotification(contact: ContactFormData): Promise<boolean> {
  if (!config.resendApiKey) {
    console.log('Resend API key not configured, skipping email');
    return false;
  }

  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #64d240 0%, #447e31 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📋 New Contact Form Submission!</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #64d240; padding-bottom: 10px;">
            Contact Details
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right;">${contact.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right;">
                <a href="mailto:${contact.email}" style="color: #64d240; text-decoration: none;">${contact.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right;">
                <a href="tel:+91${contact.phone}" style="color: #64d240; text-decoration: none;">+91 ${contact.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666;">Address</td>
              <td style="padding: 12px 0; font-weight: bold; text-align: right;">${contact.address}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #64d240;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              📞 <strong>Action Required:</strong> This customer requested a FREE site visit. Schedule a visit within 72 hours!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>This is an automated notification from Green India Solar Contact Form</p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'Green India Solar <onboarding@resend.dev>',
      to: config.adminEmail,
      subject: `📋 New Contact: ${contact.name} - Site Visit Request`,
      html: htmlContent,
    });

    // Log the full response for debugging
    console.log('Resend API Response (Contact):', JSON.stringify(result, null, 2));

    if (result.error) {
      console.error('Resend error:', result.error);
      return false;
    }

    console.log('Contact form email notification sent successfully, ID:', result.data?.id);
    return true;
  } catch (error) {
    console.error('Error sending contact form email notification:', error);
    return false;
  }
}
