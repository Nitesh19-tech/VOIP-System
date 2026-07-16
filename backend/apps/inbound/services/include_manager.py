from django.conf import settings

from apps.asterisk.services.ssh import AsteriskSSH


class InboundIncludeManager:

    MAIN_FILE = "/etc/asterisk/extensions.conf"

    INCLUDE_LINE = "#include extensions_voip_backend.conf"

    def apply(self):

        ssh = AsteriskSSH(
            host=settings.ASTERISK_HOST,
            username=settings.ASTERISK_USERNAME,
            password=settings.ASTERISK_PASSWORD,
            port=settings.ASTERISK_PORT,
        )

        output, error = ssh.execute(
            f"cat {self.MAIN_FILE}"
        )

        if error:
            return False, error

        if self.INCLUDE_LINE in output:
            return True, "Already included"

        content = output.rstrip() + "\n\n" + self.INCLUDE_LINE + "\n"

        ssh.upload_text(
            self.MAIN_FILE,
            content,
        )

        ssh.reload_dialplan()

        return True, "Include added"