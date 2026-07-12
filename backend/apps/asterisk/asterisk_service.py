from decouple import config

from .ssh import AsteriskSSH


class AsteriskService:

    @staticmethod
    def ssh():

        return AsteriskSSH(
            host=config("ASTERISK_HOST"),
            username=config("ASTERISK_USERNAME"),
            password=config("ASTERISK_PASSWORD"),
            port=config("ASTERISK_PORT", cast=int),
        )

    @staticmethod
    def execute(command):

        ssh = AsteriskService.ssh()

        try:

            output, error = ssh.execute(command)

            if error:
                raise Exception(error)

            return output

        finally:

            ssh.close()

    @staticmethod
    def get_endpoints():

        return AsteriskService.execute(
            'asterisk -rx "pjsip show endpoints"'
        )

    @staticmethod
    def get_contacts():

        return AsteriskService.execute(
            'asterisk -rx "pjsip show contacts"'
        )

    @staticmethod
    def get_channels():

        return AsteriskService.execute(
            'asterisk -rx "core show channels"'
        )

    @staticmethod
    def get_channels_concise():

        return AsteriskService.execute(
            'asterisk -rx "core show channels concise"'
        )

    @staticmethod
    def reload_pjsip():

        return AsteriskService.execute(
            'asterisk -rx "pjsip reload"'
        )

    @staticmethod
    def reload_dialplan():

        return AsteriskService.execute(
            'asterisk -rx "dialplan reload"'
        )

    @staticmethod
    def core_reload():

        return AsteriskService.execute(
            'asterisk -rx "core reload"'
        )