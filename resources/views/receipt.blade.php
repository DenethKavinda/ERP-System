<!-- resources/views/receipt.blade.php -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Payment Receipt - {{ $order_id }}</title>
    <style>
        body {
            font-family: sans-serif;
            color: #333;
            margin: 20px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #f97316;
            padding-bottom: 15px;
        }

        .invoice-details {
            margin: 20px 0;
            font-size: 14px;
            line-height: 1.6;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .table th {
            background: #f8fafc;
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }

        .table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
        }

        .total {
            text-align: right;
            font-size: 16px;
            font-weight: bold;
            margin-top: 25px;
            color: #f97316;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
        }
    </style>
</head>

<body>

    <div class="header">
        <h2>PAYMENT RECEIPT</h2>
        <p style="font-size: 12px; color: #64748b;">Thank you for your business setup purchase!</p>
    </div>

    <div class="invoice-details">
        <strong>Order ID:</strong> {{ $order_id }}<br>
        <strong>Date:</strong> {{ $date }}<br> <!-- Render Sri Lankan Time Metrics cleanly -->
        <strong>Customer Name:</strong> {{ $customer_name }}<br>
        <strong>Email:</strong> {{ $customer_email }}
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <!-- 📦 Package Base Price Row Line -->
            <tr>
                <td>Core Package: {{ $package_name }}</td>
                <td style="text-align: right;">LKR {{ number_format($base_price, 2) }}</td>
            </tr>

            <!-- ➕ Individual Chosen Service Addons Loop Render Rows -->
            @if(!empty($addons))
            @foreach($addons as $addon)
            <tr>
                <td>Extra Service: {{ $addon['name'] }}</td>
                <td style="text-align: right;">LKR {{ number_format($addon['price'], 2) }}</td>
            </tr>
            @endforeach
            @endif
        </tbody>
    </table>

    <div class="total">
        Total Paid: LKR {{ number_format($total_amount, 2) }}
    </div>

    <div class="footer">
        This is an electronically generated payment receipt sheet configuration layout.
    </div>

</body>

</html>