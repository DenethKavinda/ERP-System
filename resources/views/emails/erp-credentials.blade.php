<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Nexus ERP</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f97316, #f59e0b); padding: 32px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
                                NEXUS <span style="opacity: 0.9;">ERP</span>
                            </h1>
                            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
                                Enterprise Resource Planning
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #0f172a;">
                                Welcome, {{ $userName }}!
                            </h2>
                            <p style="margin: 0 0 24px; font-size: 14px; color: #64748b; line-height: 1.6;">
                                Your Nexus ERP account has been successfully created. Below are your login credentials to access the ERP system.
                            </p>

                            <!-- Plan Badge -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 12px 16px;">
                                        <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; color: #ea580c;">
                                            Active Plan
                                        </span>
                                        <br>
                                        <span style="font-size: 15px; font-weight: 800; color: #c2410c;">
                                            {{ $planName }}
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Credentials Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-bottom: 14px; border-bottom: 1px solid #e2e8f0;">
                                                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 4px;">
                                                        Login Email
                                                    </span>
                                                    <span style="font-size: 16px; font-weight: 700; color: #0f172a; font-family: 'Courier New', monospace;">
                                                        {{ $loginEmail }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 14px;">
                                                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 4px;">
                                                        Temporary Password
                                                    </span>
                                                    <span style="font-size: 16px; font-weight: 700; color: #0f172a; font-family: 'Courier New', monospace; background-color: #fef3c7; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                                                        {{ $loginPassword }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Buttons -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center" style="padding: 6px;">
                                        <a href="{{ $portalUrl }}/login" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 10px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 4px;">
                                            Sign In to Customer Portal
                                        </a>
                                        <a href="{{ $erpUrl }}" style="display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 10px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 4px;">
                                            Launch ERP System
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 16px;">
                                        <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.5;">
                                            <strong style="font-weight: 800;">Security Notice:</strong> Your initial password was system-generated for high security. For your protection, please change your password after logging in. You can update your password at any time by going to <strong>Settings &rarr; Profile</strong>.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0 0 4px; font-size: 11px; color: #94a3b8; font-weight: 600;">
                                Nexus ERP &mdash; CodeXpress IT Solutions
                            </p>
                            <p style="margin: 0; font-size: 10px; color: #cbd5e1;">
                                This is an automated message. Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
