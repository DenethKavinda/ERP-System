"""
Nexus ERP Professional Knowledge Base PDF Manuals Generator
============================================================
Generates 6 publication-grade enterprise PDF documents matching the exact
Knowledge Base resources on portal.codexpressitsolutions.com/knowledge-center.

Includes:
- Two-pass canvas for dynamic "Page X of Y" and running headers
- Executive metadata cards and clean category badges
- Color-coded advisory & warning callout boxes
- Enterprise styled data tables with repeatRows=1 and zebra striping
- Perfect 2-page pagination with zero split tables or orphaned headings
"""

import os
import shutil
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
)
from reportlab.pdfgen import canvas

# -------------------------------------------------------------------------
# CONSTANTS & PALETTE
# -------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "docs")
STORAGE_DIR = os.path.join(PROJECT_ROOT, "storage", "app", "public", "docs")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(STORAGE_DIR, exist_ok=True)

# Brand Color Palette
C_PRIMARY = colors.HexColor("#0f172a")       # Slate 900
C_SECONDARY = colors.HexColor("#ea580c")     # Orange 600
C_TEXT = colors.HexColor("#334155")          # Slate 700
C_TEXT_LIGHT = colors.HexColor("#64748b")    # Slate 500
C_BORDER = colors.HexColor("#cbd5e1")        # Slate 300
C_BG_LIGHT = colors.HexColor("#f8fafc")      # Slate 50

C_BLUE_BG = colors.HexColor("#eff6ff")       # Blue 50
C_BLUE_BORDER = colors.HexColor("#93c5fd")   # Blue 300
C_BLUE_TEXT = colors.HexColor("#1d4ed8")     # Blue 700

C_GREEN_BG = colors.HexColor("#f0fdf4")      # Green 50
C_GREEN_BORDER = colors.HexColor("#86efac")  # Green 300
C_GREEN_TEXT = colors.HexColor("#15803d")    # Green 700

C_ORANGE_BG = colors.HexColor("#fff7ed")     # Orange 50
C_ORANGE_BORDER = colors.HexColor("#fdba74") # Orange 300
C_ORANGE_TEXT = colors.HexColor("#c2410c")   # Orange 700


# -------------------------------------------------------------------------
# NUMBERED CANVAS FOR ENTERPRISE HEADERS & FOOTERS (Page X of Y)
# -------------------------------------------------------------------------
class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas that computes total pages and renders running headers/footers."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()

        # Running Header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 7.5)
            self.setFillColor(C_SECONDARY)
            self.drawString(20 * mm, 283 * mm, "NEXUS ERP")
            self.setFont("Helvetica", 7.5)
            self.setFillColor(C_TEXT_LIGHT)
            self.drawString(38 * mm, 283 * mm, "|   Official Enterprise Documentation Manual")

            self.setFont("Helvetica-Bold", 7)
            self.setFillColor(C_PRIMARY)
            self.drawRightString(190 * mm, 283 * mm, "VERIFIED TECHNICAL REFERENCE")

            self.setStrokeColor(C_BORDER)
            self.setLineWidth(0.5)
            self.line(20 * mm, 280 * mm, 190 * mm, 280 * mm)

        # Running Footer (All pages)
        self.setStrokeColor(C_BORDER)
        self.setLineWidth(0.5)
        self.line(20 * mm, 17 * mm, 190 * mm, 17 * mm)

        self.setFont("Helvetica", 7.5)
        self.setFillColor(C_TEXT_LIGHT)
        self.drawString(
            20 * mm,
            12 * mm,
            "Nexus ERP System  •  CodeXpress IT Solutions  •  support@codexpressitsolutions.com"
        )

        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(C_PRIMARY)
        self.drawRightString(190 * mm, 12 * mm, page_str)

        self.restoreState()


# -------------------------------------------------------------------------
# TYPOGRAPHY & STYLES
# -------------------------------------------------------------------------
def get_styles():
    sample = getSampleStyleSheet()
    styles = {
        "DocCategory": ParagraphStyle(
            "DocCategory",
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=10,
            textColor=C_SECONDARY,
            textTransform="uppercase",
            spaceAfter=4,
        ),
        "DocTitle": ParagraphStyle(
            "DocTitle",
            fontName="Helvetica-Bold",
            fontSize=19,
            leading=23,
            textColor=C_PRIMARY,
            spaceAfter=5,
        ),
        "DocSubtitle": ParagraphStyle(
            "DocSubtitle",
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            textColor=C_TEXT,
            spaceAfter=8,
        ),
        "MetaLabel": ParagraphStyle(
            "MetaLabel",
            fontName="Helvetica-Bold",
            fontSize=7,
            leading=9,
            textColor=C_TEXT_LIGHT,
            textTransform="uppercase",
        ),
        "MetaValue": ParagraphStyle(
            "MetaValue",
            fontName="Helvetica",
            fontSize=8,
            leading=10.5,
            textColor=C_PRIMARY,
        ),
        "Heading1": ParagraphStyle(
            "Heading1",
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=15,
            textColor=C_PRIMARY,
            spaceBefore=8,
            spaceAfter=3,
            keepWithNext=True,
        ),
        "Heading2": ParagraphStyle(
            "Heading2",
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=13,
            textColor=C_SECONDARY,
            spaceBefore=6,
            spaceAfter=2,
            keepWithNext=True,
        ),
        "Body": ParagraphStyle(
            "Body",
            fontName="Helvetica",
            fontSize=8.5,
            leading=12,
            textColor=C_TEXT,
            spaceAfter=4,
        ),
        "BodyBold": ParagraphStyle(
            "BodyBold",
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=12,
            textColor=C_PRIMARY,
            spaceAfter=4,
        ),
        "Bullet": ParagraphStyle(
            "Bullet",
            fontName="Helvetica",
            fontSize=8.5,
            leading=11.5,
            textColor=C_TEXT,
            leftIndent=12,
            firstLineIndent=-8,
            spaceAfter=2,
        ),
        "CalloutText": ParagraphStyle(
            "CalloutText",
            fontName="Helvetica",
            fontSize=8,
            leading=11,
            textColor=C_TEXT,
        ),
        "CalloutTitle": ParagraphStyle(
            "CalloutTitle",
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11,
            textColor=C_PRIMARY,
            spaceAfter=2,
        ),
        "TableHeader": ParagraphStyle(
            "TableHeader",
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=9.5,
            textColor=colors.white,
            alignment=0,
        ),
        "TableCell": ParagraphStyle(
            "TableCell",
            fontName="Helvetica",
            fontSize=7.5,
            leading=10,
            textColor=C_PRIMARY,
            alignment=0,
        ),
        "TableCellCode": ParagraphStyle(
            "TableCellCode",
            fontName="Courier-Bold",
            fontSize=7,
            leading=9.5,
            textColor=C_SECONDARY,
        ),
    }
    return styles


def build_meta_box(category, version, author, date, target):
    """Generates an executive metadata card header."""
    styles = get_styles()

    meta_data = [
        [
            Paragraph("CLASSIFICATION", styles["MetaLabel"]),
            Paragraph(category, styles["MetaValue"]),
            Paragraph("RELEASE VERSION", styles["MetaLabel"]),
            Paragraph(version, styles["MetaValue"]),
        ],
        [
            Paragraph("AUTHOR / TEAM", styles["MetaLabel"]),
            Paragraph(author, styles["MetaValue"]),
            Paragraph("EFFECTIVE DATE", styles["MetaLabel"]),
            Paragraph(date, styles["MetaValue"]),
        ],
        [
            Paragraph("TARGET AUDIENCE", styles["MetaLabel"]),
            Paragraph(target, styles["MetaValue"]),
            Paragraph("STATUS", styles["MetaLabel"]),
            Paragraph("Official Production Ready", styles["MetaValue"]),
        ],
    ]

    table = Table(meta_data, colWidths=[36 * mm, 48 * mm, 38 * mm, 48 * mm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ('BOX', (0, 0), (-1, -1), 0.75, C_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ]))
    return table


def build_callout(title, text, tone="info"):
    """Creates a beautifully styled advice or warning callout box."""
    styles = get_styles()
    bg = C_BLUE_BG
    border = C_BLUE_BORDER
    title_color = C_BLUE_TEXT

    if tone in ("tip", "success"):
        bg = C_GREEN_BG
        border = C_GREEN_BORDER
        title_color = C_GREEN_TEXT
    elif tone == "warning":
        bg = C_ORANGE_BG
        border = C_ORANGE_BORDER
        title_color = C_ORANGE_TEXT

    title_p = Paragraph(f"<b>{title}</b>", ParagraphStyle(
        "CalloutTitleDynamic",
        parent=styles["CalloutTitle"],
        textColor=title_color
    ))
    text_p = Paragraph(text, styles["CalloutText"])

    table = Table([[title_p], [text_p]], colWidths=[170 * mm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg),
        ('BOX', (0, 0), (-1, -1), 0.75, border),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 5),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 5),
    ]))
    return table


def build_styled_table(header_row, data_rows, col_widths):
    """Constructs an enterprise-grade striped data table with repeatRows=1."""
    styles = get_styles()
    table_data = []

    # Headers
    h_cells = [Paragraph(f"<b>{h}</b>", styles["TableHeader"]) for h in header_row]
    table_data.append(h_cells)

    # Rows
    for row in data_rows:
        r_cells = []
        for cell in row:
            if cell.startswith("`") and cell.endswith("`"):
                r_cells.append(Paragraph(cell.strip("`"), styles["TableCellCode"]))
            else:
                r_cells.append(Paragraph(cell, styles["TableCell"]))
        table_data.append(r_cells)

    table = Table(table_data, colWidths=col_widths, repeatRows=1)
    t_style = [
        ('BACKGROUND', (0, 0), (-1, 0), C_PRIMARY),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 4),
        ('TOPPADDING', (0, 0), (-1, 0), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 1), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 3.5),
        ('GRID', (0, 0), (-1, -1), 0.5, C_BORDER),
    ]

    for i in range(1, len(table_data)):
        if i % 2 == 0:
            t_style.append(('BACKGROUND', (0, i), (-1, i), colors.HexColor("#f8fafc")))
        else:
            t_style.append(('BACKGROUND', (0, i), (-1, i), colors.white))

    table.setStyle(TableStyle(t_style))
    return table


# =========================================================================
# DOCUMENT 1: Nexus ERP Quickstart & Branch Setup Guide
# =========================================================================
def generate_doc1():
    filename = "nexus-erp-quickstart.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )
    styles = get_styles()
    story = []

    # PAGE 1
    story.append(Paragraph("DEPLOYMENT & ONBOARDING GUIDE", styles["DocCategory"]))
    story.append(Paragraph("Nexus ERP Quickstart & Branch Setup Guide", styles["DocTitle"]))
    story.append(Paragraph(
        "A complete technical deployment walkthrough covering initial tenant provisioning, multi-branch scoping, dual-location inventory bins, and role-based security governance.",
        styles["DocSubtitle"]
    ))

    story.append(build_meta_box(
        category="Deployment Architecture",
        version="v2.4.0 (Enterprise)",
        author="Nexus Systems Engineering",
        date="October 2026",
        target="IT Administrators, Operations Directors, Store Managers"
    ))
    story.append(Spacer(1, 8))

    # Section 1
    story.append(Paragraph("1. System Architecture Overview", styles["Heading1"]))
    story.append(Paragraph(
        "Nexus ERP operates on a high-availability cloud architecture designed specifically for multi-branch retail, wholesale distribution, and manufacturing enterprises. All system nodes maintain synchronized stock positions while permitting granular data isolation per operational branch.",
        styles["Body"]
    ))
    story.append(Paragraph(
        "When your company workspace is provisioned via the Nexus Customer Portal, your root administrator account is granted global authority across all commercial entities, warehouse facilities, and cashier registers.",
        styles["Body"]
    ))
    story.append(build_callout(
        "Root Tenant Isolation Notice",
        "Each provisioned company operates within an isolated tenant partition with dedicated encryption keys. Ensure all initial store setups are completed under the primary administrator profile before delegating credentials to branch supervisors.",
        "info"
    ))
    story.append(Spacer(1, 6))

    # Section 2
    story.append(Paragraph("2. Initial Company Profile & Branding Configuration", styles["Heading1"]))
    story.append(Paragraph(
        "Before launching retail POS terminals or importing supplier goods, configure your legal entity branding to ensure tax invoices, thermal customer receipts, and financial ledgers carry valid commercial credentials:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>Step 1:</b> Navigate to <b>Settings &rarr; Company Profile</b> in the Nexus ERP main sidebar.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 2:</b> Enter your registered legal business name, National Identity Card (NIC) or Business Registration (BR) number, and registered operational address.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 3:</b> Configure default currency settings to <b>LKR (Sri Lankan Rupee)</b>, set standard decimal precision (2 decimal places), and configure tax numbers (VAT/SVAT if registered).", styles["Bullet"]))
    story.append(Paragraph("<b>Step 4:</b> Upload high-resolution monochrome receipt logos and specify customer footer disclaimers (e.g., return policies, warranty clauses).", styles["Bullet"]))
    story.append(Spacer(1, 6))

    # Section 3
    story.append(Paragraph("3. Multi-Branch & Store Hierarchy Setup", styles["Heading1"]))
    story.append(Paragraph(
        "Nexus ERP structures your organization into hierarchical entities: <b>Company &rarr; Branches &rarr; Locations (Warehouses / Showrooms) &rarr; POS Registers</b>. This structure guarantees that cashiers cannot access or alter data belonging to other branches.",
        styles["Body"]
    ))

    branch_headers = ["Branch Code", "Branch Name", "Location Type", "Default Scope", "Cashier Registers"]
    branch_rows = [
        ["`HO-01`", "Colombo Head Office & Showroom", "Showroom + Main Store", "Primary Central Hub", "3 Terminals"],
        ["`BR-02`", "Kandy Retail Showroom", "Retail Showroom Only", "Restricted Branch", "2 Terminals"],
        ["`WH-01`", "Peliyagoda Central Logistics", "Bulk Central Warehouse", "Logistics & GRN Only", "0 (Admin only)"],
        ["`BR-03`", "Galle Highway Outlet", "Retail Showroom Only", "Restricted Branch", "1 Terminal"],
    ]
    story.append(build_styled_table(branch_headers, branch_rows, [25 * mm, 45 * mm, 40 * mm, 35 * mm, 25 * mm]))

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # PAGE 2
    story.append(Paragraph("4. Dual-Location Inventory Architecture (Showroom vs. Storeroom)", styles["Heading1"]))
    story.append(Paragraph(
        "A hallmark capability of Nexus ERP is native dual-location stock segregation within each physical branch. Every retail store is automatically equipped with two distinct inventory buckets:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>Front-of-House Showroom:</b> The active retail sales floor inventory available for immediate POS cashier billing.", styles["Bullet"]))
    story.append(Paragraph("<b>Back-of-House Storeroom:</b> Secure bulk stock held off the retail floor to safeguard against retail shrinkage and unauthorized removal.", styles["Bullet"]))
    story.append(Paragraph("<b>Internal Inter-Bin Transfers:</b> Moving inventory from the storeroom to the retail floor requires an internal transfer voucher (`ITV`), maintaining an unalterable audit ledger of who authorized and received the stock.", styles["Bullet"]))
    story.append(Spacer(1, 4))

    story.append(build_callout(
        "Preventing Stock Theft with Dual Locations",
        "By enforcing dual-location stock controls, end-of-day shelf physical stocktakes can be reconciled within minutes without having to recount bulk backroom cartons.",
        "tip"
    ))
    story.append(Spacer(1, 6))

    # Section 5
    story.append(Paragraph("5. Role-Based Access Control (RBAC) & Governance", styles["Heading1"]))
    story.append(Paragraph(
        "User permissions must adhere strictly to the principle of least privilege. Nexus ERP enforces predefined operational roles:",
        styles["Body"]
    ))

    rbac_headers = ["User Role", "Accessible Interfaces", "POS Billing", "Price Overrides", "Financial Reports"]
    rbac_rows = [
        ["`Super Admin`", "All Branches, Settings, Ledgers", "Full Access", "Full Authority", "Unrestricted"],
        ["`Store Manager`", "Assigned Branch & Stock Bins", "Full Access", "PIN Approval Required", "Branch P&L Only"],
        ["`POS Cashier`", "Assigned Register Terminal Only", "Billing Only", "Blocked (Manager PIN)", "Shift Summary Only"],
        ["`Inventory Officer`", "Goods Receiving & Stock Counts", "No Billing", "No Pricing Access", "Stock Ledger Only"],
        ["`Auditor`", "Read-Only Across All Modules", "No Billing", "View Only", "Complete Ledger Audit"],
    ]
    story.append(build_styled_table(rbac_headers, rbac_rows, [28 * mm, 44 * mm, 28 * mm, 36 * mm, 34 * mm]))
    story.append(Spacer(1, 6))

    # Section 6
    story.append(Paragraph("6. Pre-Flight Go-Live Checklist", styles["Heading1"]))
    story.append(Paragraph(
        "Prior to initiating commercial trading on your Nexus ERP workspace, verify that all items in the deployment checklist below have been validated:",
        styles["Body"]
    ))
    story.append(Paragraph("[ &check; ] Company legal credentials, BR number, and contact numbers configured in Settings.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Operational branches and dual-location stock bins assigned to relevant teams.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Cashier staff user accounts created with unique login credentials.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Thermal receipt printer and barcode scanner paired and verified with test bills.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Opening stock imported via CSV migration or confirmed with physical inventory count.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Initial cash drawer float recorded during cashier shift start.", styles["Bullet"]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {filename}")


# =========================================================================
# DOCUMENT 2: POS Cashier Shift Control & Daily Reconciliation
# =========================================================================
def generate_doc2():
    filename = "pos-shift-balancing.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )
    styles = get_styles()
    story = []

    # PAGE 1
    story.append(Paragraph("OPERATIONS & RECONCILIATION MANUAL", styles["DocCategory"]))
    story.append(Paragraph("POS Cashier Shift Control & Daily Reconciliation", styles["DocTitle"]))
    story.append(Paragraph(
        "A rigorous operational protocol covering cashier opening floats, split tenders, blind end-of-day reconciliation, variance audits, and cash drawer security.",
        styles["DocSubtitle"]
    ))

    story.append(build_meta_box(
        category="Store Operations",
        version="v2.4.0 (Enterprise)",
        author="Nexus Retail Operations Group",
        date="October 2026",
        target="Cashiers, Shift Supervisors, Store Accountants"
    ))
    story.append(Spacer(1, 8))

    # Section 1
    story.append(Paragraph("1. Core Principles of Shift Integrity", styles["Heading1"]))
    story.append(Paragraph(
        "In modern retail and wholesale environments, the point-of-sale register represents the primary interface for revenue capture. The Nexus POS Shift Management subsystem enforces strict accountability, ensuring that every rupee received is reconciled against physical cash, credit card terminals, and bank transfers.",
        styles["Body"]
    ))

    # Section 2
    story.append(Paragraph("2. Shift Opening Protocol: The Floating Drawer", styles["Heading1"]))
    story.append(Paragraph(
        "A cashier may never begin ringing sales on an uninitialized shift. The opening procedure ensures a verified opening balance:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>Step 1:</b> The cashier signs into the assigned terminal using their personal user credentials.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 2:</b> The system prompts: <b>'Initialize New Sales Shift'</b>. Enter the exact physical cash float provided by the manager (e.g., LKR 10,000 in petty change notes and coins).", styles["Bullet"]))
    story.append(Paragraph("<b>Step 3:</b> The terminal prints an <b>Opening Float Slip</b>. Both the cashier and the authorizing supervisor sign the physical slip and deposit it into the cash drawer under the till tray.", styles["Bullet"]))
    story.append(Spacer(1, 4))

    story.append(build_callout(
        "Mandatory Denomination Counting",
        "Always record opening floats by individual denominations (e.g., 5x LKR 1,000, 8x LKR 500, 10x LKR 100). This eliminates disputes during mid-shift handovers.",
        "warning"
    ))
    story.append(Spacer(1, 6))

    # Section 3
    story.append(Paragraph("3. Transaction Processing & Split Payments", styles["Heading1"]))
    story.append(Paragraph(
        "Nexus POS supports multi-tender split settlement across single invoices. Cashiers must ensure payments are recorded under their precise monetary channel:",
        styles["Body"]
    ))

    tender_headers = ["Payment Method", "Verification Requirement", "Receipt Output", "Reconciliation Channel"]
    tender_rows = [
        ["`Cash (LKR)`", "Note inspection & UV fraud check", "Change calculation displayed", "Physical cash drawer count"],
        ["`Credit / Debit Card`", "Bank POS terminal approval slip", "Card type & last 4 digits on bill", "Bank settlement batch total"],
        ["`LankaQR / Transfer`", "Reference number & SMS alert match", "Transaction reference on bill", "Direct bank account ledger"],
        ["`Customer Credit`", "Customer profile limit & authorization", "Credit ledger invoice signed", "Customer Accounts Receivable"],
        ["`Return Note / Credit Slip`", "Original invoice verification", "Negative adjustment voucher", "Return bill audit ledger"],
    ]
    story.append(build_styled_table(tender_headers, tender_rows, [34 * mm, 46 * mm, 45 * mm, 45 * mm]))

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # PAGE 2
    story.append(Paragraph("4. Mid-Shift Safe Drops (Cash Skims)", styles["Heading1"]))
    story.append(Paragraph(
        "To mitigate burglary and armed hold-up risks, cash drawers should never hold excess cash. When cash totals exceed <b>LKR 50,000</b> (or your store policy threshold), execute a <b>Cash Skim (Safe Drop)</b>:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>Action:</b> In the POS menu, select <b>'Cash Drop / Safe Transfer'</b>.", styles["Bullet"]))
    story.append(Paragraph("<b>Process:</b> Enter the skim amount (e.g., LKR 40,000), print the dual-voucher slip, place cash into the drop envelope, and deposit into the store drop safe with supervisor counter-signature.", styles["Bullet"]))
    story.append(Spacer(1, 6))

    # Section 5
    story.append(Paragraph("5. End-of-Day Blind Balancing Procedure", styles["Heading1"]))
    story.append(Paragraph(
        "Nexus ERP strictly enforces <b>Blind End-of-Day Balancing</b>. The system <i>never</i> displays the expected cash amount to the cashier before they enter their physical count. This prevents dishonest adjustments.",
        styles["Body"]
    ))
    story.append(Paragraph("<b>Step 1:</b> At the end of the shift, the cashier locks the terminal and selects <b>'Close Shift & Balance'</b>.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 2:</b> The cashier physically counts every note and coin in the till and inputs the exact denomination quantities into the blind count form.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 3:</b> The cashier enters the total card settlement terminal batch slips and LankaQR totals.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 4:</b> Once submitted, the system computes the variance: `Variance = Physical Count - (Opening Float + Cash Sales - Cash Drops - Paid Outs)`.", styles["Bullet"]))
    story.append(Spacer(1, 6))

    # Section 6
    story.append(Paragraph("6. Cash Discrepancy Governance & Escalation Matrix", styles["Heading1"]))
    story.append(Paragraph(
        "Cash variances must be managed based on statutory store policy thresholds to ensure ledger auditability:",
        styles["Body"]
    ))

    var_headers = ["Variance Range (LKR)", "Classification", "Action Required", "Posting Ledger"]
    var_rows = [
        ["Under LKR 100", "Normal Rounding Variance", "Supervisor auto-signoff allowed", "Cash Discrepancy Expense"],
        ["LKR 100 - LKR 1,000", "Moderate Discrepancy", "Till recount + written reason log", "Store Variance Clearing Account"],
        ["Over LKR 1,000", "Severe Non-Compliance", "Manager PIN override + Incident Report", "Cashier Shortage Advance / Investigation"],
    ]
    story.append(build_styled_table(var_headers, var_rows, [36 * mm, 42 * mm, 48 * mm, 44 * mm]))
    story.append(Spacer(1, 6))

    story.append(build_callout(
        "Immutable Audit Logging",
        "All shift closures, supervisor overrides, and safe drop vouchers are recorded with microsecond timestamps and terminal IP addresses in the Nexus Platform Audit Ledger.",
        "tip"
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {filename}")


# =========================================================================
# DOCUMENT 3: Thermal POS Printer (80mm) & Windows Setup Manual
# =========================================================================
def generate_doc3():
    filename = "thermal-printer-guide.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )
    styles = get_styles()
    story = []

    # PAGE 1
    story.append(Paragraph("HARDWARE INTEGRATION & CONFIGURATION", styles["DocCategory"]))
    story.append(Paragraph("Thermal POS Printer (80mm) & Windows Setup Manual", styles["DocTitle"]))
    story.append(Paragraph(
        "Step-by-step engineering manual for installing 80mm and 58mm thermal receipt printers, ESC/POS hardware command sequencing, cash drawer kickout, and silent browser printing.",
        styles["DocSubtitle"]
    ))

    story.append(build_meta_box(
        category="Hardware Deployment",
        version="v2.4.0 (Enterprise)",
        author="Nexus Hardware Integration Lab",
        date="October 2026",
        target="IT Support Technicians, System Integrators, POS Cashiers"
    ))
    story.append(Spacer(1, 8))

    # Section 1
    story.append(Paragraph("1. Hardware Specifications & Interfaces", styles["Heading1"]))
    story.append(Paragraph(
        "Nexus ERP Web POS utilizes high-performance browser-direct printing compatible with all standard 80mm and 58mm ESC/POS thermal printers (including Xprinter, Rongta, Epson TM-T82, Posiflex, Bixolon, and generic OEM USB receipt printers).",
        styles["Body"]
    ))

    printer_headers = ["Parameter", "80mm Standard Specification", "58mm Compact Specification"]
    printer_rows = [
        ["`Print Method`", "Direct Thermal Line Printing", "Direct Thermal Line Printing"],
        ["`Paper Width`", "79.5mm ± 0.5mm", "57.5mm ± 0.5mm"],
        ["`Printable Width`", "72mm (576 dots/line)", "48mm (384 dots/line)"],
        ["`Resolution`", "203 DPI (8 dots/mm)", "203 DPI (8 dots/mm)"],
        ["`Interface Types`", "USB 2.0, Ethernet (LAN), Bluetooth", "USB 2.0, Bluetooth"],
        ["`Cash Drawer Port`", "RJ11/RJ12 24VDC 1A", "RJ11 12VDC"],
    ]
    story.append(build_styled_table(printer_headers, printer_rows, [40 * mm, 65 * mm, 65 * mm]))
    story.append(Spacer(1, 8))

    # Section 2
    story.append(Paragraph("2. Windows Driver Installation & Port Binding", styles["Heading1"]))
    story.append(Paragraph(
        "Follow these steps to establish clean Windows driver binding prior to configuring browser printing:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>Step 1:</b> Connect the thermal printer to a USB port and power on the device. Insert the 80mm thermal paper roll with the coated thermal side facing upward.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 2:</b> Install the manufacturer's Windows driver (e.g., <i>POS-80 Driver Setup</i> or <i>Epson Advanced Printer Driver</i>).", styles["Bullet"]))
    story.append(Paragraph("<b>Step 3:</b> Open <b>Windows Control Panel &rarr; Devices and Printers</b>. Right-click the installed printer and select <b>Printer Properties</b>.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 4:</b> Navigate to the <b>Ports</b> tab. Verify that the printer is bound to the active `USB001` or `USB002` virtual printer port.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 5:</b> In the <b>General</b> tab, click <b>Print Test Page</b>. Verify that the printer outputs the Windows test banner cleanly.", styles["Bullet"]))

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # PAGE 2
    story.append(Paragraph("3. Configuring Page Margins & Paper Sizes", styles["Heading1"]))
    story.append(Paragraph(
        "By default, Windows drivers often assume Letter or A4 dimensions. You must configure the paper size to continuous thermal roll dimensions:",
        styles["Body"]
    ))
    story.append(Paragraph("• In Printer Properties, open <b>Preferences &rarr; Advanced</b>.", styles["Bullet"]))
    story.append(Paragraph("• Under Paper Size, select <b>80mm x 297mm</b> or <b>80mm x Continuous</b>.", styles["Bullet"]))
    story.append(Paragraph("• Under Layout Margins, set <b>Left: 0mm, Right: 0mm, Top: 0mm, Bottom: 0mm</b>.", styles["Bullet"]))
    story.append(Spacer(1, 4))

    story.append(build_callout(
        "Cash Drawer Automatic Kickout Configuration",
        "To make the cash drawer pop open automatically upon bill completion, navigate to: Printer Properties &rarr; Device Settings &rarr; Cash Drawer. Select 'Open Before Printing' or 'Open After Printing' for Drawer #1. This sends the standard ESC/POS pulse (ESC p 0 25 250) down the RJ11 cable.",
        "tip"
    ))
    story.append(Spacer(1, 6))

    # Section 4
    story.append(Paragraph("4. High-Speed Kiosk Silent Printing Setup", styles["Heading1"]))
    story.append(Paragraph(
        "To allow instant 1-second invoice printing without displaying the Windows print confirmation popup, configure your browser in <b>Kiosk Mode</b>:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>1.</b> Right-click your Chrome/Edge desktop shortcut and select <b>Properties</b>.", styles["Bullet"]))
    story.append(Paragraph("<b>2.</b> In the <b>Target</b> input field, append the flag: `--kiosk-printing` to the end of the line.", styles["Bullet"]))
    story.append(Paragraph("<b>Example:</b> `\"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" --kiosk-printing`", styles["Bullet"]))
    story.append(Paragraph("<b>3.</b> Set your 80mm POS printer as the <b>Default Windows Printer</b>.", styles["Bullet"]))
    story.append(Paragraph("<b>4.</b> In Nexus POS, pressing <b>F12 / Print</b> will now fire the invoice to the paper roll instantly with zero dialog delay.", styles["Bullet"]))
    story.append(Spacer(1, 6))

    # Section 5
    story.append(Paragraph("5. Troubleshooting Common Hardware Faults", styles["Heading1"]))

    fault_headers = ["Symptom", "Root Cause", "Resolution Action"]
    fault_rows = [
        ["`Blank paper feeds without text`", "Roll inserted upside down", "Reverse roll so thermal coated side faces printhead."],
        ["`Cutter fails to sever paper`", "Paper jam or worn blade", "Open cutter cover, turn manual dial to release blade."],
        ["`Cash drawer does not kick`", "RJ11 cable loose or wrong voltage", "Check RJ11 cable; ensure 24V solenoid compatibility."],
        ["`Faint / blurry barcode printing`", "Low heat density or dirty head", "Clean head with isopropyl alcohol; increase darkness in driver."],
    ]
    story.append(build_styled_table(fault_headers, fault_rows, [45 * mm, 50 * mm, 75 * mm]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {filename}")


# =========================================================================
# DOCUMENT 4: Barcode & QR Scanner Pairing with Nexus Inventory
# =========================================================================
def generate_doc4():
    filename = "scanner-guide.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )
    styles = get_styles()
    story = []

    # PAGE 1
    story.append(Paragraph("PERIPHERAL HARDWARE INTEGRATION", styles["DocCategory"]))
    story.append(Paragraph("Barcode & QR Scanner Pairing with Nexus Inventory", styles["DocTitle"]))
    story.append(Paragraph(
        "Technical guide for configuring 1D laser and 2D QR image scanners, programming carriage return suffixes, and optimizing high-volume retail POS checkout.",
        styles["DocSubtitle"]
    ))

    story.append(build_meta_box(
        category="Hardware Integration",
        version="v2.4.0 (Enterprise)",
        author="Nexus Hardware Engineering",
        date="October 2026",
        target="POS Cashiers, IT Technicians, Warehouse Stock Clerks"
    ))
    story.append(Spacer(1, 8))

    # Section 1
    story.append(Paragraph("1. Supported Scanner Types & Technologies", styles["Heading1"]))
    story.append(Paragraph(
        "Nexus ERP connects seamlessly with all standard USB HID (Human Interface Device) keyboard-wedge barcode readers. Because the scanner acts as an ultra-fast keyboard emulator, no proprietary software drivers are required.",
        styles["Body"]
    ))

    scanner_headers = ["Scanner Category", "Optimal Use Case", "Supported Symbologies", "Connection Type"]
    scanner_rows = [
        ["`1D Handheld Laser`", "Supermarket checkout, apparel retail", "EAN-13, UPC-A, Code 128, Code 39", "USB Cable / 2.4GHz Wireless"],
        ["`2D Image Imager`", "Mobile screen reading, pharmacy QR", "All 1D + QR Code, DataMatrix, PDF417", "USB / Bluetooth / 2.4GHz"],
        ["`Omnidirectional Desktop`", "High-throughput grocery counters", "Fast multi-angle 1D/2D scanning", "USB / RS232"],
        ["`Wireless Handheld Gun`", "Warehouse stocktaking & bin audits", "Long range 1D/2D barcodes (up to 50m)", "Bluetooth / Base Cradle"],
    ]
    story.append(build_styled_table(scanner_headers, scanner_rows, [38 * mm, 45 * mm, 52 * mm, 35 * mm]))
    story.append(Spacer(1, 8))

    # Section 2
    story.append(Paragraph("2. Mandatory Hardware Programming: Auto-Enter Suffix", styles["Heading1"]))
    story.append(Paragraph(
        "For Nexus POS to instantly add an item to the shopping cart upon scanning without requiring the cashier to press 'Enter' on the physical keyboard, the barcode scanner must be programmed to transmit a <b>Carriage Return (CR + LF)</b> suffix:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>Step 1:</b> Locate the quick-programming manual provided in your barcode scanner's physical packaging.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 2:</b> Scan the configuration barcode labeled <b>'Enter Setup / Enter Configuration Mode'</b>.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 3:</b> Scan the barcode labeled <b>'Add CR / LF Suffix'</b> or <b>'Enable Enter Key Suffix'</b>.", styles["Bullet"]))
    story.append(Paragraph("<b>Step 4:</b> Scan the barcode labeled <b>'Exit & Save Configuration'</b>.", styles["Bullet"]))
    story.append(Spacer(1, 4))

    story.append(build_callout(
        "Testing Auto-Enter in Notepad",
        "To verify that the scanner is correctly programmed: Open Windows Notepad. Scan any standard barcode. If the cursor immediately jumps down to the next line automatically, your scanner is configured correctly for high-speed Nexus POS billing.",
        "tip"
    ))

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # PAGE 2
    story.append(Paragraph("3. Nexus POS High-Speed Checkout Workflow", styles["Heading1"]))
    story.append(Paragraph(
        "Once configured, cashier workflow operates with maximum throughput:",
        styles["Body"]
    ))
    story.append(Paragraph("• <b>Single Item Scan:</b> Cashier scans item &rarr; product name, unit price, and stock position appear instantly; quantity increments to `1`.", styles["Bullet"]))
    story.append(Paragraph("• <b>Repeated Scan:</b> Scanning the same item again automatically increments quantity to `2`, `3`, etc., without modal popups.", styles["Bullet"]))
    story.append(Paragraph("• <b>Multi-Price Batch Detection:</b> If an item has multiple active cost/selling batches, Nexus POS displays a quick-selection modal for the cashier to choose the appropriate batch.", styles["Bullet"]))
    story.append(Paragraph("• <b>Weighing Scale Barcodes:</b> Nexus ERP supports embedded-price barcodes (e.g., `20XXXXX` prefixes generated by deli and butchery weighing scales), automatically parsing weight and total price.", styles["Bullet"]))
    story.append(Spacer(1, 6))

    # Section 4
    story.append(Paragraph("4. Warehouse Stock Audits & Bin Relocation Scanning", styles["Heading1"]))
    story.append(Paragraph(
        "In warehouse and backroom inventory operations, barcode scanners streamline stock movement:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>1. Goods Receiving (GRN):</b> Scan supplier outer barcodes to instantly verify against authorized Purchase Orders.", styles["Bullet"]))
    story.append(Paragraph("<b>2. Bin Relocation (ITV):</b> Scan the origin bin barcode, scan the product barcode, and scan the destination bin barcode for atomic relocation.", styles["Bullet"]))
    story.append(Paragraph("<b>3. Periodic Shelf Counts:</b> Cashiers scan shelf items sequentially; variances are calculated automatically in the Stock Bin Card.", styles["Bullet"]))
    story.append(Spacer(1, 6))

    # Section 5
    story.append(Paragraph("5. Troubleshooting Scanner Recognition Issues", styles["Heading1"]))

    scan_fault_headers = ["Issue Observed", "Likely Cause", "Corrective Action"]
    scan_fault_rows = [
        ["`Scanner beeps but nothing types`", "USB port power sleep or bad cord", "Switch to rear motherboard port; disable USB power suspend."],
        ["`Characters scrambled or accented`", "Windows keyboard layout mismatch", "Set Windows keyboard language to English (US)."],
        ["`Barcodes scan without Enter jump`", "Missing CR/LF suffix programming", "Scan 'Add Enter Suffix' barcode from scanner manual."],
        ["`Cannot read phone screen barcodes`", "Laser scanner used instead of 2D", "Upgrade cashier terminal to 2D CMOS Image Imager."],
    ]
    story.append(build_styled_table(scan_fault_headers, scan_fault_rows, [44 * mm, 46 * mm, 80 * mm]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {filename}")


# =========================================================================
# DOCUMENT 5: Bulk Products & Customer Credit CSV Migration Guide
# =========================================================================
def generate_doc5():
    filename = "csv-migration.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )
    styles = get_styles()
    story = []

    # PAGE 1
    story.append(Paragraph("DATA MIGRATION & SYSTEM TRANSITION", styles["DocCategory"]))
    story.append(Paragraph("Bulk Products & Customer Credit CSV Migration Guide", styles["DocTitle"]))
    story.append(Paragraph(
        "Complete technical specification for importing existing inventory catalogs, pricing tiers, dual-location stock positions, and customer credit ledger balances into Nexus ERP.",
        styles["DocSubtitle"]
    ))

    story.append(build_meta_box(
        category="Data Migration",
        version="v2.4.0 (Enterprise)",
        author="Nexus Database Services",
        date="October 2026",
        target="Accountants, Database Administrators, Migration Consultants"
    ))
    story.append(Spacer(1, 8))

    # Section 1
    story.append(Paragraph("1. Migration Overview & Data Cleansing", styles["Heading1"]))
    story.append(Paragraph(
        "Migrating historical data from legacy software (QuickBooks, Tally, Excel, or custom POS databases) into Nexus ERP requires strict adhering to column naming conventions and data types. This guide provides the exact schemas required for seamless CSV ingestion.",
        styles["Body"]
    ))

    # Section 2
    story.append(Paragraph("2. Products Master Catalog CSV Schema", styles["Heading1"]))
    story.append(Paragraph(
        "The inventory catalog template accepts both single-store products and multi-branch allocations. Save file as `UTF-8 CSV (Comma Delimited)`:",
        styles["Body"]
    ))

    schema_headers = ["Column Header", "Type", "Required?", "Validation Rules", "Example Value"]
    schema_rows = [
        ["`item_code`", "String", "YES (Unique)", "Alphanumeric, no spaces", "`SKU-10024`"],
        ["`barcode`", "String", "Optional", "EAN-13, UPC, Code 128", "`4792001002451`"],
        ["`product_name`", "String", "YES", "Full description (max 255 chars)", "`Sunlight Soap 100g Pack`"],
        ["`category`", "String", "YES", "Existing or new category name", "`Personal Care`"],
        ["`cost_price`", "Decimal", "YES", "Standard unit cost (positive)", "`85.00`"],
        ["`selling_price`", "Decimal", "YES", "Standard retail price", "`110.00`"],
        ["`wholesale_price`", "Decimal", "Optional", "Discounted bulk tier", "`98.00`"],
        ["`opening_stock`", "Integer", "YES", "Initial count (0 if out of stock)", "`150`"],
        ["`reorder_level`", "Integer", "YES", "Threshold for low-stock alerts", "`25`"],
    ]
    story.append(build_styled_table(schema_headers, schema_rows, [28 * mm, 18 * mm, 24 * mm, 60 * mm, 40 * mm]))
    story.append(Spacer(1, 6))

    story.append(build_callout(
        "Critical Encoding Directive: UTF-8 Without BOM",
        "Always ensure your CSV file is exported from Excel using 'CSV UTF-8 (Comma delimited) (*.csv)'. Standard ANSI export will corrupt non-English characters (such as Sinhala or Tamil product descriptions) and introduce header byte order marks (BOM) that cause header parse failures.",
        "warning"
    ))

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # PAGE 2
    story.append(Paragraph("3. Customer Credit & Opening Balance Schema", styles["Heading1"]))
    story.append(Paragraph(
        "To preserve trade customer accounts receivable and credit history, import existing clients using the Customer Credit Master format:",
        styles["Body"]
    ))

    cust_headers = ["Field Name", "Type", "Required?", "Purpose & Business Logic", "Example"]
    cust_rows = [
        ["`customer_name`", "String", "YES", "Full registered customer / trade name", "`Lanka Traders Ltd`"],
        ["`phone_number`", "String", "YES", "Unique contact number (10 digits)", "`0771234567`"],
        ["`nic_or_br`", "String", "Optional", "NIC or Business Registration number", "`PV123456`"],
        ["`credit_limit`", "Decimal", "YES", "Max credit allowance (LKR)", "`250000.00`"],
        ["`credit_period_days`", "Integer", "YES", "Payment terms (e.g. 30 days)", "`30`"],
        ["`opening_balance`", "Decimal", "YES", "Existing outstanding debt owed", "`45200.00`"],
    ]
    story.append(build_styled_table(cust_headers, cust_rows, [34 * mm, 18 * mm, 22 * mm, 60 * mm, 36 * mm]))
    story.append(Spacer(1, 6))

    # Section 4
    story.append(Paragraph("4. Ingestion Execution & Error Quarantine", styles["Heading1"]))
    story.append(Paragraph(
        "Nexus ERP includes automated schema validation before any records touch the production database:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>1. Pre-validation:</b> The system scans all rows for duplicate barcodes or missing mandatory values.", styles["Bullet"]))
    story.append(Paragraph("<b>2. Error Quarantine Table:</b> Invalid rows are isolated into an error download file specifying the exact row number and failure cause (e.g., `Row 42: Duplicate Barcode 4791002`).", styles["Bullet"]))
    story.append(Paragraph("<b>3. Atomic Commit:</b> Valid products are committed to the inventory database in bulk batches of 500 records.", styles["Bullet"]))
    story.append(Spacer(1, 6))

    # Section 5
    story.append(Paragraph("5. Post-Migration Verification & Rollback Safeguards", styles["Heading1"]))
    story.append(Paragraph(
        "Immediately upon completing bulk migration, perform the following verification routines:",
        styles["Body"]
    ))
    story.append(Paragraph("[ &check; ] Confirm total inventory asset value in <b>Reports &rarr; Stock Valuation</b> matches your opening balance sheet.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Verify that total accounts receivable in <b>Customer Ledger Summary</b> matches previous software.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Execute a test barcode scan on 5 random products at POS checkout to verify pricing accuracy.", styles["Bullet"]))
    story.append(Spacer(1, 4))

    story.append(build_callout(
        "One-Click Import Rollback Window",
        "Nexus ERP provides a 2-hour rollback window after every CSV import batch. If erroneous prices or quantities were uploaded, navigate to Settings &rarr; Import History and click 'Rollback Batch' to reverse all changes cleanly.",
        "tip"
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {filename}")


# =========================================================================
# DOCUMENT 6: Sri Lanka Statutory Payroll Compliance Checklist
# =========================================================================
def generate_doc6():
    filename = "statutory-payroll.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )
    styles = get_styles()
    story = []

    # PAGE 1
    story.append(Paragraph("STATUTORY COMPLIANCE & LEGAL GOVERNANCE", styles["DocCategory"]))
    story.append(Paragraph("Sri Lanka Statutory Payroll Compliance Checklist", styles["DocTitle"]))
    story.append(Paragraph(
        "A practical reference manual detailing Employee Provident Fund (EPF), Employee Trust Fund (ETF), and Advance Personal Income Tax (APIT) withholding computations under Sri Lankan labor laws.",
        styles["DocSubtitle"]
    ))

    story.append(build_meta_box(
        category="Statutory Compliance",
        version="v2.4.0 (Enterprise)",
        author="Nexus Legal & Financial Audit Group",
        date="October 2026",
        target="HR Managers, Payroll Officers, Finance Directors, Auditors"
    ))
    story.append(Spacer(1, 8))

    # Section 1
    story.append(Paragraph("1. Sri Lanka Labor Legal Framework Overview", styles["Heading1"]))
    story.append(Paragraph(
        "All commercial employers in Sri Lanka are legally bound by the <b>Shop and Office Employees Act No. 19 of 1954</b> and the <b>Employees' Provident Fund Act No. 15 of 1958</b>. Nexus ERP's integrated payroll engine automates all statutory calculations, ensuring zero non-compliance penalties.",
        styles["Body"]
    ))

    # Section 2
    story.append(Paragraph("2. Statutory Contribution Matrices: EPF & ETF", styles["Heading1"]))
    story.append(Paragraph(
        "Statutory retirement fund contributions are calculated strictly on <b>Total Qualifying Earnings</b> (Basic Salary + Cost of Living Allowances + Budgetary Relief Allowances). Overtime and discretionary performance bonuses are excluded from EPF/ETF calculations.",
        styles["Body"]
    ))

    stat_headers = ["Fund Name", "Statutory Authority", "Employee Deduction", "Employer Contribution", "Total Monthly Remittance"]
    stat_rows = [
        ["`EPF (Provident Fund)`", "Central Bank of Sri Lanka (CBSL)", "8.0% of Total Earnings", "12.0% of Total Earnings", "20.0% of Total Earnings"],
        ["`ETF (Trust Fund)`", "Employees' Trust Fund Board", "0.0% (No deduction)", "3.0% of Total Earnings", "3.0% of Total Earnings"],
        ["`Total Statutory Fund`", "Combined Monthly Obligation", "8.0% Deducted from Pay", "15.0% Borne by Company", "23.0% Remitted Total"],
    ]
    story.append(build_styled_table(stat_headers, stat_rows, [34 * mm, 38 * mm, 32 * mm, 32 * mm, 34 * mm]))
    story.append(Spacer(1, 6))

    story.append(build_callout(
        "Strict Remittance Deadlines",
        "Monthly EPF contributions must be remitted to the Central Bank of Sri Lanka on or before the last working day of the subsequent month (accompanied by monthly EPF Form C returns). Late remittances incur automatic surcharge penalties ranging from 5% to 50% depending on delay duration.",
        "warning"
    ))

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # PAGE 2
    # Section 3
    story.append(Paragraph("3. Advance Personal Income Tax (APIT) Deductions", styles["Heading1"]))
    story.append(Paragraph(
        "Under Inland Revenue Department (IRD) regulations, employers are mandated to withhold APIT from monthly employment earnings exceeding statutory relief thresholds:",
        styles["Body"]
    ))

    apit_headers = ["Monthly Earnings Tier (LKR)", "Tax Rate (%)", "Tax on Tier (LKR)", "Cumulative Tax (LKR)"]
    apit_rows = [
        ["First LKR 100,000 (Tax Free Allowance)", "0% Exempt", "LKR 0.00", "LKR 0.00"],
        ["Next LKR 41,667 (100,001 - 141,667)", "6%", "LKR 2,500.00", "LKR 2,500.00"],
        ["Next LKR 41,667 (141,668 - 183,333)", "12%", "LKR 5,000.00", "LKR 7,500.00"],
        ["Next LKR 41,667 (183,334 - 225,000)", "18%", "LKR 7,500.00", "LKR 15,000.00"],
        ["Next LKR 41,667 (225,001 - 266,667)", "24%", "LKR 10,000.00", "LKR 25,000.00"],
        ["Next LKR 41,667 (266,668 - 308,333)", "30%", "LKR 12,500.00", "LKR 37,500.00"],
        ["Balance Exceeding LKR 308,333", "36% Maximum", "36% on excess", "Cumulative"],
    ]
    story.append(build_styled_table(apit_headers, apit_rows, [60 * mm, 30 * mm, 40 * mm, 40 * mm]))
    story.append(Spacer(1, 6))

    # Section 4
    story.append(Paragraph("4. Overtime (OT) & Working Hour Calculations", styles["Heading1"]))
    story.append(Paragraph(
        "Standard working hours under the Shop & Office Act are <b>8 hours per day / 45 hours per week</b>. Work performed beyond standard hours must be remunerated at minimum statutory overtime rates:",
        styles["Body"]
    ))
    story.append(Paragraph("<b>Hourly Rate Formula:</b> `Hourly Rate = (Basic Monthly Salary / 240)`", styles["Bullet"]))
    story.append(Paragraph("<b>Normal Overtime (1.5x):</b> `Overtime Hourly Rate = Hourly Rate x 1.5`", styles["Bullet"]))
    story.append(Paragraph("<b>Poya Day & Mercantile Holiday:</b> Must be paid at full basic salary plus an additional full day's wage (or substituted with an alternative paid holiday within the calendar year).", styles["Bullet"]))
    story.append(Spacer(1, 6))

    # Section 5
    story.append(Paragraph("5. Monthly Statutory Compliance Checklist", styles["Heading1"]))
    story.append(Paragraph("[ &check; ] Verify that total qualifying earnings include basic salary plus all fixed monthly allowances.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Deduct 8% employee EPF contribution from net salary payslip.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Accrue 12% employer EPF contribution and 3% employer ETF contribution.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Compute APIT withholding using the progressive tax tier schedule for earnings > LKR 100,000.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Export and submit the CBSL electronic EPF Form C file on or before month end.", styles["Bullet"]))
    story.append(Paragraph("[ &check; ] Issue itemized digital payslips with clear breakdown of gross pay, deductions, and net pay.", styles["Bullet"]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated: {filename}")


def sync_to_storage():
    """Copies all generated PDFs from public/docs to storage/app/public/docs as backup."""
    for f in os.listdir(OUTPUT_DIR):
        if f.endswith(".pdf"):
            src = os.path.join(OUTPUT_DIR, f)
            dst = os.path.join(STORAGE_DIR, f)
            shutil.copy2(src, dst)
            print(f"Mirrored to storage: {f}")


if __name__ == "__main__":
    print("Beginning generation of Nexus ERP professional knowledge documentation...")
    generate_doc1()
    generate_doc2()
    generate_doc3()
    generate_doc4()
    generate_doc5()
    generate_doc6()
    sync_to_storage()
    print("ALL 6 KNOWLEDGE BASE PDFS SUCCESSFULLY CREATED!")
