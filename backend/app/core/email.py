import logging
import smtplib
from email.mime.text import MIMEText

from app.core.config import settings

logger = logging.getLogger("dreamtogether.email")


def send_email(to: str, subject: str, body: str) -> None:
    """
    Sends an email via SMTP if configured; otherwise prints it to the console.
    This means the app works out of the box in local dev with zero setup —
    just watch the backend terminal for the verification link.
    """
    if not settings.SMTP_HOST:
        logger.info(
            "\n"
            "──────────── EMAIL (console fallback — no SMTP configured) ────────────\n"
            f"To: {to}\nSubject: {subject}\n\n{body}\n"
            "──────────────────────────────────────────────────────────────────────"
        )
        return

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = to

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        if settings.SMTP_USER:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_FROM, [to], msg.as_string())
