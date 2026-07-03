<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Financial Summary</title>
    <style>
        body {
            font-family: sans-serif;
            color: #1e293b;
            margin: 20px;
        }

        .header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
            margin-bottom: 25px;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
        }

        .date {
            font-size: 11px;
            color: #64748b;
            margin-top: 4px;
        }

        .grid {
            width: 100%;
            margin-bottom: 25px;
            border-collapse: collapse;
        }

        .grid th,
        .grid td {
            border: 1px solid #e2e8f0;
            padding: 10px;
            text-align: left;
            font-size: 12px;
        }

        .grid th {
            background-color: #f8fafc;
            font-weight: bold;
            color: #475569;
        }

        .metric-title {
            font-weight: bold;
            color: #0f172a;
        }

        .amount {
            font-weight: bold;
            text-align: right;
        }

        .center-box {
            text-align: center;
            margin: 30px 0;
        }

        .badge-completed {
            color: #10b981;
            font-weight: bold;
        }

        .badge-pending {
            color: #f59e0b;
            font-weight: bold;
        }

        .badge-failed {
            color: #ef4444;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="title">Financial Operations Summary Report</div>
        <div class="date">Generated on: {{ now()->setTimezone('Asia/Colombo')->format('Y-m-d h:i A') }} {!! !empty($search) ? "(Filtered by: '$search')" : "(Global Logs)" !!}</div>
    </div>

    <h3>1. Metrics & Status Distribution Ledger</h3>
    <table class="grid">
        <thead>
            <tr>
                <th>Transaction Status Tiers</th>
                <th>Volume Count</th>
                <th>Volume Percentage</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><span class="badge-completed">■</span> Completed Invoices</td>
                <td>{{ $completedCount }}</td>
                <td>{{ $completedPercentage }}%</td>
            </tr>
            <tr>
                <td><span class="badge-pending">■</span> Pending Authorizations</td>
                <td>{{ $pendingCount }}</td>
                <td>{{ $pendingPercentage }}%</td>
            </tr>
            <tr>
                <td><span class="badge-failed">■</span> Failed Transitions</td>
                <td>{{ $failedCount }}</td>
                <td>{{ $failedPercentage }}%</td>
            </tr>
            <tr style="background-color: #f8fafc; font-weight: bold;">
                <td>Total Managed Volume</td>
                <td>{{ $totalCount }}</td>
                <td>100%</td>
            </tr>
        </tbody>
    </table>

    <h3>2. Settlement Balances Evaluation</h3>
    <table class="grid">
        <thead>
            <tr>
                <th>Financial Metric Target</th>
                <th style="text-align: right;">Aggregated Value (LKR)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="metric-title">Completed Revenue Settled</td>
                <td class="amount" style="color: #10b981;">LKR {{ number_format($completedSum, 2) }}</td>
            </tr>
            <tr>
                <td class="metric-title">Pending Pipeline Escrow</td>
                <td class="amount" style="color: #f59e0b;">LKR {{ number_format($pendingSum, 2) }}</td>
            </tr>
            <tr style="background-color: #f8fafc; font-weight: bold;">
                <td class="metric-title">Gross Combined Pipeline Fluidity</td>
                <td class="amount">LKR {{ number_format($totalRevenueSum, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div style="page-break-inside: avoid;">
        <h3 style="margin-bottom: 10px;">3. Graphical Analytics Visualization</h3>
        <div class="center-box">
            <img src="{{ $chartUrl }}" width="400" height="250" alt="Status Distribution Chart" />
        </div>
    </div>
</body>

</html>