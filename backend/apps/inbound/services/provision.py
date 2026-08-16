from django.conf import settings

from apps.asterisk.ssh import AsteriskSSH

from .dialplan_generator import InboundDialplanGenerator
from .include_manager import InboundIncludeManager


class InboundProvisionService:

    REMOTE_FILE = "/etc/asterisk/extensions_voip_backend.conf"

    def provision(self):

        try:

            # =====================================================
            # Generate inbound dialplan
            # =====================================================

            content = InboundDialplanGenerator().generate()

            if not content.strip():

                return {
                    "success": False,
                    "output": "",
                    "error": "Generated inbound dialplan is empty.",
                }

            # =====================================================
            # Asterisk SSH
            # =====================================================

            ssh = AsteriskSSH(
                host=settings.ASTERISK_HOST,
                username=settings.ASTERISK_USERNAME,
                password=settings.ASTERISK_PASSWORD,
                port=settings.ASTERISK_PORT,
            )

            # =====================================================
            # Backup existing inbound configuration
            # =====================================================

            backup_error = None

            try:

                _, backup_error = ssh.backup_file(
                    self.REMOTE_FILE
                )

            except Exception as e:

                backup_error = str(e)

            # =====================================================
            # Upload inbound dialplan
            # =====================================================

            ssh.upload_text(
                remote_path=self.REMOTE_FILE,
                content=content,
            )

            # =====================================================
            # Ensure extensions.conf includes our file
            # =====================================================

            include_manager = InboundIncludeManager()

            include_success, include_message = (
                include_manager.apply()
            )

            if not include_success:

                return {
                    "success": False,
                    "output": "",
                    "error": (
                        "Inbound dialplan uploaded, "
                        "but include configuration failed: "
                        f"{include_message}"
                    ),
                }

            # =====================================================
            # Reload dialplan
            # =====================================================

            output, error = ssh.reload_dialplan()

            if error.strip():

                return {
                    "success": False,
                    "output": output,
                    "error": error,
                }

            # =====================================================
            # Success response
            # =====================================================

            response = {
                "success": True,
                "output": output,
                "error": "",
                "include": include_message,
            }

            if backup_error:

                response["warning"] = (
                    f"Backup failed: {backup_error}"
                )

            return response

        except Exception as e:

            return {
                "success": False,
                "output": "",
                "error": str(e),
            }