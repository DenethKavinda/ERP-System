<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <script type="text/javascript" src="https://www.payhere.lk/lib/payhere.js"></script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Nexus ERP') }}</title>

    <!-- SEO & Open Graph Metadata (F-85 Resolution) -->
    <meta name="description" content="Nexus ERP by CodeXpress IT Solutions — High-speed POS billing, multi-branch inventory, and cloud enterprise resource planning in Sri Lanka.">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Nexus ERP Portal">
    <meta property="og:title" content="Nexus ERP — Enterprise Cloud Resource Planning & POS">
    <meta property="og:description" content="High-speed POS billing, dual-location stock management, purchases, supplier GRN, and multi-branch accounting.">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Nexus ERP — Enterprise Cloud Resource Planning & POS">
    <meta name="twitter:description" content="High-speed POS billing, dual-location stock management, purchases, supplier GRN, and multi-branch accounting.">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    <script>
        (function() {
            try {
                if (!localStorage.getItem('user_theme_chosen')) {
                    localStorage.setItem('theme', 'light');
                    document.documentElement.classList.remove('dark');
                } else if (localStorage.getItem('theme') === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {}
        })();
    </script>
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>