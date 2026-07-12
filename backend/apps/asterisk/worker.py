from django.conf import settings

from .services import ProvisionJobService
from .generators import PJSIPGenerator
from .extensions_generator import ExtensionsGenerator
from .ssh import AsteriskSSH


class ProvisionWorker:

    @staticmethod
    def run(job):

        ProvisionJobService.start_job(job)

        ssh = None

        try:

            # Generate Full Config
            pjsip = PJSIPGenerator.generate_all()
            dialplan = ExtensionsGenerator.generate_all()

            ssh = AsteriskSSH(
                host=settings.ASTERISK_HOST,
                username=settings.ASTERISK_USERNAME,
                password=settings.ASTERISK_PASSWORD,
                port=settings.ASTERISK_PORT,
            )

            # Backup Existing Files
            ssh.backup_file(settings.PJSIP_CONF)
            ssh.backup_file(settings.EXTENSIONS_CONF)

            # Upload Generated Files
            ssh.upload_text(
                settings.PJSIP_CONF,
                pjsip,
            )

            ssh.upload_text(
                settings.EXTENSIONS_CONF,
                dialplan,
            )

            # Reload
            reload_out, reload_err = ssh.reload_pjsip()

            dialplan_out, dialplan_err = ssh.reload_dialplan()

            message = (
                reload_out
                + "\n"
                + dialplan_out
            )

            ProvisionJobService.complete_job(
                job,
                message=message,
            )

        except Exception as e:

            ProvisionJobService.fail_job(
                job,
                str(e),
            )

        finally:

            if ssh:
                ssh.close()