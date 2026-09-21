import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "CodeAtlas — Hackathon Project Synopsis")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, footer_text)
        self.drawString(54, 36, "CodeAtlas: GitHub Activity Intelligence Platform")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def create_synopsis_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()
    
    # Custom color palette
    c_primary = colors.HexColor("#0F172A")    # Dark slate
    c_accent = colors.HexColor("#4F46E5")     # Indigo
    c_sub = colors.HexColor("#475569")        # Slate text
    c_card_bg = colors.HexColor("#F8FAFC")    # Light gray background
    c_border = colors.HexColor("#E2E8F0")     # Light border
    c_tag_bg = colors.HexColor("#EEF2FF")     # Soft indigo tint
    c_tag_text = colors.HexColor("#3730A3")   # Indigo dark

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_primary,
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_accent,
    )

    tagline_style = ParagraphStyle(
        'DocTagline',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=c_sub,
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=4,
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_accent,
        spaceBefore=6,
        spaceAfter=2,
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.5,
        textColor=colors.HexColor("#1E293B"),
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3,
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11,
        textColor=colors.HexColor("#1E293B"),
    )

    table_bold_style = ParagraphStyle(
        'TableBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11,
        textColor=c_primary,
    )

    story = []

    # Title & Header Block
    story.append(Paragraph("CodeAtlas", title_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("GitHub Activity Intelligence & Engineering Cartography Platform", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Transforming raw Git commit histories into real-time interactive collaboration networks, knowledge ownership trees, and refactoring hotspot matrices.", tagline_style))
    story.append(Spacer(1, 8))

    # Meta Badges Table (Track, Tech Stack, Status)
    badge_data = [[
        Paragraph("<b>Category:</b> Developer Tools / AI & Code Intelligence", table_body_style),
        Paragraph("<b>Tech:</b> Next.js 16 • React 19 • TypeScript • SVG Data-Viz", table_body_style),
        Paragraph("<b>Target Audience:</b> Engineering Teams, Tech Leads, OSS", table_body_style)
    ]]
    badge_table = Table(badge_data, colWidths=[175, 175, 154])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_tag_bg),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#C7D2FE")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#C7D2FE")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 10))

    # Executive Summary / Problem Statement
    story.append(Paragraph("1. Problem Statement & The Challenge", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))
    
    problem_text = (
        "Modern software engineering organizations face significant invisible risks as repositories scale. "
        "Critical architectural knowledge becomes concentrated in isolated individuals (<b>The 'Bus Factor'</b>), "
        "high-churn complex files turn into chronic defect hotspots, and team collaboration barriers go unnoticed until "
        "delivery velocity plummets. Traditional Git dashboards only provide superficial commit counters or PR lists, "
        "failing to bridge the gap between <b>human developer dynamics</b> and <b>underlying codebase architecture</b>."
    )
    story.append(Paragraph(problem_text, body_style))
    story.append(Spacer(1, 8))

    # The Solution
    story.append(Paragraph("2. The Solution: CodeAtlas", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))
    
    solution_text = (
        "<b>CodeAtlas</b> is a visual telemetry platform that ingests raw Git commit graphs, pull requests, "
        "and file trees to generate living architectural maps. It allows teams to audit single-developer dependencies, "
        "pinpoint high-risk refactoring targets, and explore co-authorship networks with zero onboarding overhead."
    )
    story.append(Paragraph(solution_text, body_style))
    story.append(Spacer(1, 8))

    # Core Features
    story.append(Paragraph("3. Key Pillars & Innovative Features", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))

    features = [
        ("Developer Activity & Collaboration Networks",
         "Interactive custom SVG network topologies plotting co-authorship relationships, commit timelines, and cross-functional pairing strength. Includes deep-dive contributor sliding drawers with per-author metrics."),
        ("Recursive Knowledge Ownership & Bus Factor Audit",
         "A tree-structured folder analyzer computing primary vs. secondary author contribution percentages down to individual files, flagging critical single-developer dependencies before key personnel transitions occur."),
        ("2D Complexity vs. Churn Hotspot Matrix",
         "A 4-quadrant scatter visualizer plotting change frequency against code complexity. Isolates files in the high-churn/high-complexity zone as top-priority candidates for refactoring sprints."),
        ("Automated AI & Heuristic Engineering Insights",
         "A proactive advisory stream delivering real-time warnings on knowledge silos, anomalous churn spikes, and bottlenecked review workflows."),
        ("Universal Connectivity & Instant Demo Engine",
         "Seamlessly connects to any public/private GitHub repo via OAuth/PAT with 5,000 req/hr capacity, plus pre-indexed datasets (React, Next.js) for zero-latency instant evaluation.")
    ]

    for title, desc in features:
        story.append(Paragraph(f"• <b>{title}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 8))

    # Feature Comparison / Breakdown Table
    story.append(Paragraph("4. System Architecture & Feature Matrix", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))

    table_data = [
        [
            Paragraph("Module", table_header_style),
            Paragraph("Input Signals", table_header_style),
            Paragraph("Analytics / Visual Engine", table_header_style),
            Paragraph("Outcome & Business Impact", table_header_style),
        ],
        [
            Paragraph("<b>Activity Network</b>", table_bold_style),
            Paragraph("Commit authors, shared file edits, timestamps", table_body_style),
            Paragraph("Custom force-directed SVG graph + activity timeline", table_body_style),
            Paragraph("Uncovers team silos and enables cross-team pairing", table_body_style),
        ],
        [
            Paragraph("<b>Ownership Map</b>", table_bold_style),
            Paragraph("Git line attributions, directory hierarchies", table_body_style),
            Paragraph("Recursive tree computation + Bus Factor gauge", table_body_style),
            Paragraph("Mitigates institutional knowledge loss risk", table_body_style),
        ],
        [
            Paragraph("<b>Hotspot Matrix</b>", table_bold_style),
            Paragraph("Commit churn rate vs. cyclomatic file depth", table_body_style),
            Paragraph("2D 4-Quadrant Cartesian scatter plot", table_body_style),
            Paragraph("Drastically cuts defect rate by targeting debt", table_body_style),
        ],
        [
            Paragraph("<b>Insights Feed</b>", table_bold_style),
            Paragraph("Aggregated repo telemetry & threshold flags", table_body_style),
            Paragraph("Rule-based heuristic advisory stream", table_body_style),
            Paragraph("Saves hours of manual tech-debt audits", table_body_style),
        ],
    ]

    matrix_table = Table(table_data, colWidths=[85, 130, 140, 149])
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_card_bg]),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
    ]))
    story.append(matrix_table)
    story.append(Spacer(1, 10))

    # Tech Stack & Implementation Details
    story.append(Paragraph("5. Technical Implementation & Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))

    tech_points = [
        ("Frontend & Framework", "Next.js 16 (App Router), React 19, TypeScript with client-side reactive state."),
        ("Custom Data-Viz Engine", "Pure SVG math and HTML5 canvas animations engineered from scratch — avoiding heavy external charting bundles for maximum performance and 60 FPS fluidity."),
        ("Styling & Design System", "Pure Vanilla CSS & CSS Modules with dynamic light/dark modes, glassmorphism UI tokens, and accessible contrast ratios."),
        ("API & Integration Layer", "Octokit REST client with in-memory caching, rate-limit auto-throttling, and client-side PAT key management.")
    ]

    for label, desc in tech_points:
        story.append(Paragraph(f"• <b>{label}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 8))

    # Roadmap & Future Scope
    story.append(Paragraph("6. Future Scope & Roadmap", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=2, spaceAfter=6))

    roadmap_points = [
        ("GitHub Action / PR Bot", "Automated risk-scoring and Bus-Factor impact alerts directly on Pull Request reviews."),
        ("Multi-Repo & Org Rollups", "Cross-repository org-wide developer knowledge matrices and team mobility analytics."),
        ("LLM Semantic Clustering", "Embedding-based semantic code matching to recommend ideal peer reviewers and refactoring strategies.")
    ]

    for label, desc in roadmap_points:
        story.append(Paragraph(f"• <b>{label}:</b> {desc}", bullet_style))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else "CodeAtlas_Hackathon_Synopsis.pdf")
    create_synopsis_pdf(out)
