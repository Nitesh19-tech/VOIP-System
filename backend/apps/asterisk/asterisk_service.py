from decouple import config

from .carrier_generator import CarrierGenerator
from .generators import PJSIPGenerator
from .routing_generator import RoutingGenerator
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

    # =====================================================
    # Upload PJSIP
    # =====================================================

    @staticmethod
    def upload_pjsip():

        config_data = PJSIPGenerator.generate_all()

        ssh = AsteriskService.ssh()

        try:

            ssh.upload_text(
                "/etc/asterisk/voip_backend.conf",
                config_data,
            )

        finally:

            ssh.close()

    # =====================================================
    # Upload Carriers
    # =====================================================

    @staticmethod
    def upload_carriers():

        config_data = CarrierGenerator.generate_all()

        ssh = AsteriskService.ssh()

        try:

            ssh.upload_text(
                "/etc/asterisk/carriers.conf",
                config_data,
            )

        finally:

            ssh.close()

    # =====================================================
    # Upload Routing
    # =====================================================

    @staticmethod
    def upload_routing():

        config_data = RoutingGenerator.generate_all()

        ssh = AsteriskService.ssh()

        try:

            ssh.upload_text(
                "/etc/asterisk/routing.conf",
                config_data,
            )

        finally:

            ssh.close()

    # =====================================================
    # Reload
    # =====================================================

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

    # =====================================================
    # Legacy / Full Sync
    # =====================================================

    @staticmethod
    def sync():

        AsteriskService.upload_pjsip()

        AsteriskService.upload_carriers()

        AsteriskService.upload_routing()

        AsteriskService.reload_pjsip()

        AsteriskService.reload_dialplan()

    # =====================================================
    # Monitoring
    # =====================================================

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