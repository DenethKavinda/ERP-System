<x-mail::message>
# Welcome to Nexus ERP Solutions, {{ $userName }}! 🎉

Your **Free Trial Access** to our ERP System has been activated successfully!

Below are your system-generated login credentials to access the ERP System:

<x-mail::panel>
**ERP SYSTEM LOGIN CREDENTIALS**

- **User Email / Username:** {{ $userEmail }}
- **System Generated Password:** `{{ $rawPassword }}`
</x-mail::panel>

You can now click the button below to go directly to the **ERP System Login Page**:

<x-mail::button :url="$erpLoginUrl" color="primary">
Access ERP System Login
</x-mail::button>

> **Security Note:** Keep your password safe and do not share it with unauthorized personnel.

If you have any questions or need technical support during your trial, feel free to reach out to our team.

Best Regards,<br>
**Nexus ERP Solutions Team**
</x-mail::message>
