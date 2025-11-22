from operations.models import Receipt, Delivery, InternalTransfer
from warehouse.models import Warehouse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
from io import BytesIO
from django.utils import timezone

def generate_reference(warehouse: Warehouse, operation_type: str) -> str:
    """
    Generate a unique reference for an operation.
    Format: {WarehouseCode}/{Operation}/{CID}
    Operation: IN (Receipt), OUT (Delivery), INT (Internal Transfer)
    """
    if operation_type == 'IN':
        model = Receipt
        filter_kwargs = {'warehouse': warehouse}
    elif operation_type == 'OUT':
        model = Delivery
        filter_kwargs = {'warehouse': warehouse}
    elif operation_type == 'INT':
        model = InternalTransfer
        filter_kwargs = {'from_warehouse': warehouse}
    else:
        raise ValueError('Invalid operation type')

    # Count existing operations for this warehouse and type
    count = model.objects.filter(**filter_kwargs).count() + 1
    cid = str(count).zfill(4)
    ref = f"{warehouse.code}/{operation_type}/{cid}"
    return ref

def generate_receipt_pdf(receipt):
    """
    Generate PDF for a receipt operation
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
    )
    story.append(Paragraph("RECEIPT DOCUMENT", title_style))
    story.append(Spacer(1, 12))

    # Header information
    header_data = [
        ['Reference:', receipt.reference],
        ['Warehouse:', receipt.warehouse.name],
        ['Supplier:', receipt.supplier or 'N/A'],
        ['Responsible:', receipt.responsible.username if receipt.responsible else 'N/A'],
        ['Schedule Date:', receipt.schedule_date.strftime('%Y-%m-%d') if receipt.schedule_date else 'N/A'],
        ['Status:', receipt.get_status_display()],
        ['Created:', receipt.created_at.strftime('%Y-%m-%d %H:%M')],
    ]

    header_table = Table(header_data, colWidths=[2*inch, 4*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(header_table)
    story.append(Spacer(1, 20))

    # Items table
    if receipt.receipt_items.exists():
        story.append(Paragraph("Items:", styles['Heading2']))
        story.append(Spacer(1, 12))

        items_data = [['Product', 'Quantity', 'Unit Price', 'Total']]
        for item in receipt.receipt_items.all():
            total = item.quantity * item.unit_price if item.unit_price else 0
            items_data.append([
                item.product.name,
                str(item.quantity),
                f"{item.unit_price:.2f}" if item.unit_price else 'N/A',
                f"{total:.2f}" if item.unit_price else 'N/A'
            ])

        items_table = Table(items_data, colWidths=[3*inch, 1.5*inch, 1.5*inch, 1.5*inch])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(items_table)

    doc.build(story)
    buffer.seek(0)
    return buffer

def generate_delivery_pdf(delivery):
    """
    Generate PDF for a delivery operation
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
    )
    story.append(Paragraph("DELIVERY DOCUMENT", title_style))
    story.append(Spacer(1, 12))

    # Header information
    header_data = [
        ['Reference:', delivery.reference],
        ['Warehouse:', delivery.warehouse.name],
        ['Customer:', delivery.customer or 'N/A'],
        ['Delivery Address:', delivery.delivery_address or 'N/A'],
        ['Responsible:', delivery.responsible.username if delivery.responsible else 'N/A'],
        ['Schedule Date:', delivery.schedule_date.strftime('%Y-%m-%d') if delivery.schedule_date else 'N/A'],
        ['Status:', delivery.get_status_display()],
        ['Created:', delivery.created_at.strftime('%Y-%m-%d %H:%M')],
    ]

    header_table = Table(header_data, colWidths=[2*inch, 4*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(header_table)
    story.append(Spacer(1, 20))

    # Items table
    if delivery.delivery_items.exists():
        story.append(Paragraph("Items:", styles['Heading2']))
        story.append(Spacer(1, 12))

        items_data = [['Product', 'Quantity', 'Unit Price', 'Total']]
        for item in delivery.delivery_items.all():
            total = item.quantity * item.unit_price if item.unit_price else 0
            items_data.append([
                item.product.name,
                str(item.quantity),
                f"{item.unit_price:.2f}" if item.unit_price else 'N/A',
                f"{total:.2f}" if item.unit_price else 'N/A'
            ])

        items_table = Table(items_data, colWidths=[3*inch, 1.5*inch, 1.5*inch, 1.5*inch])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(items_table)

    doc.build(story)
    buffer.seek(0)
    return buffer
