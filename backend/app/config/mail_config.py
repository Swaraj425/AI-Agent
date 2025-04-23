from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="lufy7786@gmail.com",
    MAIL_PASSWORD="vfmq aygb oasu vngu",
    MAIL_FROM="lufy7786@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,         # ✅ Required
    MAIL_SSL_TLS=False,         # ✅ Required
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)
