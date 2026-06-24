<!-- resources/views/receipt.blade.php -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Payment Receipt - {{ $order_id }}</title>
    <style>
        body {
            font-family: sans-serif;
            color: #1e293b;
            margin: 30px;
            font-size: 13px;
            line-height: 1.5;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #f97316;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .header h2 {
            margin: 0 0 5px 0;
            color: #0f172a;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.5px;
        }

        /* 🛠️ Modern Two-Column Layout Grid for Meta Details */
        .meta-container-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 35px;
        }

        .meta-container-table td {
            vertical-align: top;
            padding: 0;
            border: none;
        }

        .meta-block {
            line-height: 1.7;
        }

        .meta-block strong {
            color: #0f172a;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .meta-value {
            color: #475569;
        }

        /* 📊 Styled Data Table Layout */
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .table th {
            background: #f8fafc;
            text-align: left;
            padding: 12px 14px;
            border-bottom: 2px solid #cbd5e1;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
        }

        .table td {
            padding: 14px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
        }

        .item-desc {
            font-weight: 600;
            color: #0f172a;
        }

        .item-type {
            font-size: 11px;
            color: #64748b;
            font-weight: normal;
        }

        /* 💰 Final Summary Highlights */
        .total-box {
            text-align: right;
            margin-top: 30px;
            padding: 15px 20px;
            background: #fff7ed;
            border-radius: 8px;
            border: 1px solid #ffedd5;
        }

        .total-label {
            font-size: 12px;
            text-transform: uppercase;
            color: #7c2d12;
            font-weight: bold;
            letter-spacing: 0.5px;
            display: inline-block;
            margin-right: 10px;
        }

        .total-amount {
            font-size: 20px;
            font-weight: 800;
            color: #ea580c;
        }

        .footer {
            margin-top: 70px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px dashed #e2e8f0;
            padding-top: 20px;
        }
    </style>
</head>

<body>

    <div class="header">
        <h2>PAYMENT RECEIPT</h2>
        <p style="font-size: 13px; color: #64748b; margin: 0;">Thank you for your business setup purchase!</p>
    </div>

    <!-- 🛠️ TWO-COLUMN METADATA GRID CONTAINER -->
    <table class="meta-container-table">
        <tr>
            <!-- Left Side Column: Bill To / Customer Profiles -->
            <td width="55%">
                <div class="meta-block">
                    <strong>Billed To:</strong><br>
                    <span class="meta-value" style="font-size: 15px; font-weight: 700; color: #0f172a;">{{ $customer_name }}</span><br>
                    <span class="meta-value">{{ $customer_email }}</span>
                </div>
            </td>
            <!-- Right Side Column: Structural Payment Transaction Parameters -->
            <td width="45%" style="text-align: right;">
                <div class="meta-block">
                    <strong>Receipt Reference:</strong><br>
                    <span class="meta-value" style="font-family: monospace; font-size: 14px; font-weight: bold; color: #0f172a;">{{ $order_id }}</span><br>
                    <strong>Date Issued:</strong> <span class="meta-value">{{ $date }}</span>
                </div>
            </td>
        </tr>
    </table>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align: right; width: 30%;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <!-- Core Package Row Base Layout Line -->
            <tr>
                <td>
                    <span class="item-desc">Core Package: {{ $package_name }}</span><br>
                    <span class="item-type">Base Configuration Framework Node</span>
                </td>
                <td style="text-align: right; font-weight: 600;">LKR {{ number_format($base_price, 2) }}</td>
            </tr>

            <!-- Individual Chosen Premium Service Addons Loop -->
            @if(!empty($addons))
            @foreach($addons as $addon)
            <tr>
                <td>
                    <span class="item-desc">Extra Service: {{ $addon['name'] }}</span><br>
                    <span class="item-type">Premium Modular Micro-Service Extension Add-on</span>
                </td>
                <td style="text-align: right; font-weight: 600;">LKR {{ number_format($addon['price'], 2) }}</td>
            </tr>
            @endforeach
            @endif
        </tbody>
    </table>

    <!-- TOTAL PAID BOX ASSET SHEET -->
    <div class="total-box">
        <span class="total-label">Total Paid (LKR):</span>
        <span class="total-amount">{{ number_format($total_amount, 2) }}</span>
    </div>

    <div class="footer">
        This is an electronically generated secure payment receipt configuration layout document.
    </div>

</body>

</html>