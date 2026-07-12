from django.utils import timezone
from decouple import config

from .ssh import AsteriskSSH
from .generators import PJSIPGenerator


class ProvisioningService:

    @staticmethod
    def run(job):

        ssh = AsteriskSSH(
            host=config("ASTERISK_HOST"),
            username=config("ASTERISK_USERNAME"),
            password=config("ASTERISK_PASSWORD"),
            port=config("ASTERISK_PORT", cast=int),
        )

        username = job.sip_account.username
        password = job.sip_account.password

        try:

            # ----------------------------
            # Start Job
            # ----------------------------
            job.status = "PENDING"
            job.started_at = timezone.now()
            job.message = ""
            job.save()

            # ----------------------------
            # Generate SIP Configuration
            # ----------------------------
            config_text = PJSIPGenerator.generate(
                username,
                password
            )

            # ----------------------------
            # Read Existing pjsip.conf
            # ----------------------------
            output, error = ssh.execute(
                "cat /etc/asterisk/pjsip.conf"
            )

            if error.strip():
                raise Exception(error)

            # ----------------------------
            # Duplicate Check
            # ----------------------------
            if f"[{username}]" in output:
                raise Exception(
                    f"SIP {username} already exists."
                )

            # ----------------------------
            # Create Updated Configuration
            # ----------------------------
            new_config = output.rstrip() + "\n\n" + config_text

            # ----------------------------
            # Upload Temporary File
            # ----------------------------
            ssh.upload_text(
                "/tmp/pjsip_new.conf",
                new_config
            )

            # ----------------------------
            # Verify Upload
            # ----------------------------
            verify_output, verify_error = ssh.execute(
                "test -f /tmp/pjsip_new.conf && echo OK || echo FAILED"
            )

            if "OK" not in verify_output:
                raise Exception(
                    "Temporary upload failed."
                )

            # ----------------------------
            # Backup Original File
            # ----------------------------
            backup_output, backup_error = ssh.execute(
                "cp /etc/asterisk/pjsip.conf /etc/asterisk/pjsip.conf.bak"
            )

            if backup_error.strip():
                raise Exception(
                    f"Backup failed: {backup_error}"
                )

            # ----------------------------
            # Replace Original File
            # ----------------------------
            replace_output, replace_error = ssh.execute(
                "cp /tmp/pjsip_new.conf /etc/asterisk/pjsip.conf"
            )

            if replace_error.strip():
                raise Exception(
                    f"Replace failed: {replace_error}"
                )

            # ----------------------------
            # Reload PJSIP
            # ----------------------------
            reload_output, reload_error = ssh.execute(
                'asterisk -rx "pjsip reload"'
            )

            if reload_error.strip():
                raise Exception(
                    f"Reload failed: {reload_error}"
                )

            # ----------------------------
            # Verify Endpoint
            # ----------------------------
            endpoint_output, endpoint_error = ssh.execute(
                f'asterisk -rx "pjsip show endpoint {username}"'
            )

            if username not in endpoint_output:
                raise Exception(
                    "Endpoint verification failed."
                )

            # ----------------------------
            # Success
            # ----------------------------
            job.status = "SUCCESS"
            job.completed_at = timezone.now()
            job.message = "Provisioning completed successfully."
            job.save()

            return {
                "success": True,
                "message": "Provisioning completed successfully.",
                "endpoint": endpoint_output,
            }

        except Exception as e:

            job.status = "FAILED"
            job.completed_at = timezone.now()
            job.message = str(e)
            job.save()

            return {
                "success": False,
                "error": str(e),
            }