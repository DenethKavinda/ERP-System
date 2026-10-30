<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Nexus ERP — Your Login Credentials</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td, h1, h2, p, a, span { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif !important; }
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'SF Pro', -apple-system-font, 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1d1d1f; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f7; padding: 48px 16px;">
        <tr>
            <td align="center" style="vertical-align: top;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.06); border: 1px solid #e5e5ea;">
                    
                    <!-- Top Minimalist Brand Accent Line -->
                    <tr>
                        <td height="4" style="background: linear-gradient(90deg, #ea580c 0%, #f97316 50%, #fb923c 100%); line-height: 4px; font-size: 0;">&nbsp;</td>
                    </tr>

                    <!-- Header: Clean Typography Only (No Graphic Logo) -->
                    <tr>
                        <td style="padding: 36px 40px 24px; border-bottom: 1px solid #f2f2f7;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <!-- Clean Typographic Title (No Logo Icon) -->
                                    <td align="left" style="vertical-align: middle;">
                                        <div style="font-size: 22px; font-weight: 800; color: #1d1d1f; letter-spacing: -0.03em; line-height: 1.1;">
                                            NEXUS <span style="color: #ea580c;">ERP</span>
                                        </div>
                                        <div style="font-size: 11px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px;">
                                            Enterprise Resource Planning
                                        </div>
                                    </td>

                                    <!-- Account Status Indicator -->
                                    <td align="right" style="vertical-align: middle;">
                                        <span style="display: inline-block; background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.04em;">
                                            &#9679; Active
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content Body -->
                    <tr>
                        <td style="padding: 36px 40px 32px;">
                            
                            <!-- Greeting & Intro with Smooth Apple Typography -->
                            <h1 style="margin: 0 0 10px; font-size: 24px; font-weight: 800; color: #1d1d1f; letter-spacing: -0.025em; line-height: 1.25;">
                                Welcome to Nexus ERP, {{ $userName }}
                            </h1>
                            <p style="margin: 0 0 28px; font-size: 14px; color: #6e6e73; line-height: 1.6; letter-spacing: -0.01em;">
                                Your cloud enterprise workspace has been provisioned and is ready. Use the system credentials below to log in to your ERP instance and manage your business operations.
                            </p>

                            <!-- Subscription Plan Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background-color: #fbfbfd; border: 1px solid #e5e5ea; border-radius: 14px;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="left" style="vertical-align: middle;">
                                                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #86868b; display: block; margin-bottom: 4px;">
                                                        Subscription Plan
                                                    </span>
                                                    <span style="font-size: 15px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.015em;">
                                                        {{ $planName }}
                                                    </span>
                                                </td>
                                                <td align="right" style="vertical-align: middle;">
                                                    <span style="display: inline-block; background-color: #fff7ed; border: 1px solid #fed7aa; color: #ea580c; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.04em;">
                                                        {{ str_contains(strtolower($planName), 'free') ? '30-Day Evaluation' : 'Subscription Active' }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Section Label: Login Credentials -->
                            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #86868b; margin-bottom: 12px; padding-left: 2px;">
                                Your Login Credentials
                            </div>

                            <!-- Credentials Box (Apple Card Style with Copy Visuals) -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px; background-color: #ffffff; border: 1px solid #e5e5ea; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);">
                                
                                <!-- Row 1: Login Email -->
                                <tr>
                                    <td style="padding: 16px 20px; border-bottom: 1px solid #f2f2f7;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="left" style="vertical-align: middle;">
                                                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #86868b; display: block; margin-bottom: 4px;">
                                                        Email Address
                                                    </span>
                                                    <span style="font-size: 15px; font-weight: 600; color: #1d1d1f; font-family: ui-monospace, 'SF Mono', 'SFProMono-Regular', Menlo, Monaco, Consolas, monospace; letter-spacing: -0.01em;">
                                                        {{ $loginEmail }}
                                                    </span>
                                                </td>
                                                <td align="right" style="vertical-align: middle; width: 85px;">
                                                    <span style="display: inline-flex; align-items: center; gap: 4px; background-color: #f5f5f7; border: 1px solid #e5e5ea; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; color: #48484a; text-decoration: none;">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block; margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Row 2: Temporary Password -->
                                <tr>
                                    <td style="padding: 16px 20px; background-color: #fafafc;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="left" style="vertical-align: middle;">
                                                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #86868b; display: block; margin-bottom: 4px;">
                                                        Temporary Password
                                                    </span>
                                                    <span style="font-size: 16px; font-weight: 700; color: #ea580c; font-family: ui-monospace, 'SF Mono', 'SFProMono-Regular', Menlo, Monaco, Consolas, monospace; letter-spacing: 0.05em; background-color: #ffffff; border: 1px solid #fed7aa; padding: 3px 8px; border-radius: 6px; display: inline-block;">
                                                        {{ $loginPassword }}
                                                    </span>
                                                </td>
                                                <td align="right" style="vertical-align: middle; width: 85px;">
                                                    <span style="display: inline-flex; align-items: center; gap: 4px; background-color: #ffffff; border: 1px solid #fed7aa; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; color: #ea580c; text-decoration: none;">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block; margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Primary CTA Button (Smooth Apple-style pill button) -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $erpUrl }}" style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-size: 14px; font-weight: 700; letter-spacing: -0.01em; box-shadow: 0 4px 14px rgba(234, 88, 12, 0.28); text-align: center;">
                                            Log In to ERP Workspace &rarr;
                                        </a>
                                        <div style="margin-top: 10px;">
                                            <a href="{{ $erpUrl }}" style="font-size: 12px; color: #86868b; text-decoration: underline; word-break: break-all;">
                                                {{ $erpUrl }}
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Tip Box (Apple Soft Tint) -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fbfbfd; border: 1px solid #e5e5ea; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 14px 18px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td width="20" style="vertical-align: top; padding-right: 10px; font-size: 14px; color: #16a34a; font-weight: 800;">
                                                    &#10003;
                                                </td>
                                                <td style="vertical-align: middle;">
                                                    <p style="margin: 0; font-size: 12px; color: #6e6e73; line-height: 1.5; letter-spacing: -0.01em;">
                                                        <strong style="color: #1d1d1f;">Security Recommendation:</strong> Please log in to your ERP system using the temporary password above. You can easily change your password to a personal one at any time from your profile settings.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Minimalist Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #fbfbfd; border-top: 1px solid #f2f2f7;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="left" style="vertical-align: middle;">
                                        <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.01em;">
                                            Nexus ERP &bull; CodeXpress IT Solutions
                                        </p>
                                        <p style="margin: 0; font-size: 11px; color: #86868b; line-height: 1.4;">
                                            WhatsApp Support: <a href="https://wa.me/94777674308" style="color: #ea580c; text-decoration: none; font-weight: 600;">+94 77 767 4308</a> &bull; Email: <a href="mailto:support@codexpressitsolutions.com" style="color: #ea580c; text-decoration: none; font-weight: 600;">support@codexpressitsolutions.com</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
