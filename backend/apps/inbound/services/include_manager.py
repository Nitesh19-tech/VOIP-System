from django.conf import settings

from apps.asterisk.ssh import AsteriskSSH


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

        try:

            output, error = ssh.execute(
                f"cat {self.MAIN_FILE}"
            )

            if error:
                return False, error

            # =============================================
            # Already Included
            # =============================================

            if self.INCLUDE_LINE in output:

                return True, "Already included"

            # =============================================
            # Add Include
            # =============================================

            content = (
                output.rstrip()
                + "\n\n"
                + self.INCLUDE_LINE
                + "\n"
            )

            ssh.upload_text(
                self.MAIN_FILE,
                content,
            )

            # =============================================
            # Reload Dialplan
            # =============================================

            reload_output, reload_error = (
                ssh.reload_dialplan()
            )

            if reload_error:

                return False, reload_error

            return True, (
                "Include added successfully. "
                f"{reload_output}"
            )

        except Exception as e:

            return False, str(e)

        finally:

            try:
                ssh.close()
            except Exception:
                pass