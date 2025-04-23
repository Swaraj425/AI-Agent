from fastapi_mail import FastMail, MessageSchema
from fastapi_mail.email_utils import DefaultChecker
from pydantic import EmailStr
from ..config.mail_config import conf

async def send_reset_password_email(email: EmailStr, reset_link: str):
    message = MessageSchema(
    subject="Reset Your Password for MyApp",
    recipients=[email],
    body=f"""
    <html>
      <body>
        <p>Hi there,</p>
        <p>We received a request to reset your password. Click the link below:</p>
        <p><a href="{reset_link}">Reset Your Password</a></p>
        <p>This link will expire in 1 hour. If you didn’t request this, just ignore this email.</p>
        <br>
        <p>Thanks,<br>The MyApp Team</p>
      </body>
    </html>
    """,
    subtype="html"
)   
    fm = FastMail(conf)
    await fm.send_message(message)
    
    try:
        print(f"Sending email to {email}...")
        await fm.send_message(message)
        print("Email sent successfully.")
    except Exception as e:
        print("Error sending email:", e)
