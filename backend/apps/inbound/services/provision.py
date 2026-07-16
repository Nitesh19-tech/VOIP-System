from django.conf import settings

from apps.asterisk.ssh import AsteriskSSH

from .dialplan_generator import InboundDialplanGenerator


class InboundProvisionService:

    REMOTE_FILE = "/etc/asterisk/extensions_voip_backend.conf"

    def provision(self):

        try:
            # Generate dialplan
            content = InboundDialplanGenerator().generate()

            if not content.strip():
                return {
                    "success": False,
                    "output": "",
                    "error": "Generated dialplan is empty.",
                }

            ssh = AsteriskSSH(
                host=settings.ASTERISK_HOST,
                username=settings.ASTERISK_USERNAME,
                password=settings.ASTERISK_PASSWORD,
                port=settings.ASTERISK_PORT,
            )

            # Backup existing configuration (non-fatal)
            backup_error = None
            try:
                _, backup_error = ssh.backup_file(self.REMOTE_FILE)
            except Exception as e:
                backup_error = str(e)

            # Upload generated configuration
            ssh.upload_text(
                remote_path=self.REMOTE_FILE,
                content=content,
            )

            # Reload dialplan
            output, error = ssh.reload_dialplan()

            if error.strip():
                return {
                    "success": False,
                    "output": output,
                    "error": error,
                }

            response = {
                "success": True,
                "output": output,
                "error": "",
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