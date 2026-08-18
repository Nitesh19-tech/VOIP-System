from decouple import config

from .carrier_generator import CarrierGenerator
from .generators import PJSIPGenerator
from .routing_generator import RoutingGenerator
from .number_pool_generator import NumberPoolGenerator
from .ssh import AsteriskSSH


class AsteriskService:

    # =====================================================
    # SSH
    # =====================================================

    @staticmethod
    def ssh():

        return AsteriskSSH(
            host=config("ASTERISK_HOST"),
            username=config("ASTERISK_USERNAME"),
            password=config("ASTERISK_PASSWORD"),
            port=config(
                "ASTERISK_PORT",
                cast=int,
            ),
        )

    # =====================================================
    # EXECUTE COMMAND
    # =====================================================

    @staticmethod
    def execute(command):

        ssh = AsteriskService.ssh()

        try:

            output, error = ssh.execute(
                command
            )

            if error:

                raise Exception(
                    error
                )

            return output

        finally:

            ssh.close()

    # =====================================================
    # UPLOAD PJSIP
    # =====================================================

    @staticmethod
    def upload_pjsip():

        config_data = (
            PJSIPGenerator.generate_all()
        )

        ssh = AsteriskService.ssh()

        try:

            ssh.upload_text(
                "/etc/asterisk/voip_backend.conf",
                config_data,
            )

        finally:

            ssh.close()

    # =====================================================
    # UPLOAD CARRIERS
    # =====================================================

    @staticmethod
    def upload_carriers():

        config_data = (
            CarrierGenerator.generate_all()
        )

        ssh = AsteriskService.ssh()

        try:

            ssh.upload_text(
                "/etc/asterisk/carriers.conf",
                config_data,
            )

        finally:

            ssh.close()

    # =====================================================
    # UPLOAD ROUTING
    # =====================================================

    @staticmethod
    def upload_routing():

        config_data = (
            RoutingGenerator.generate_all()
        )

        ssh = AsteriskService.ssh()

        try:

            ssh.upload_text(
                "/etc/asterisk/routing.conf",
                config_data,
            )

        finally:

            ssh.close()

    # =====================================================
    # UPLOAD INBOUND NUMBER POOL
    # =====================================================

    @staticmethod
    def upload_inbound():

        config_data = (
            NumberPoolGenerator.generate_all_dialplan()
        )

        ssh = AsteriskService.ssh()

        try:

            ssh.upload_text(
                "/etc/asterisk/voip_backend_inbound.conf",
                config_data,
            )

        finally:

            ssh.close()

    # =====================================================
    # RELOAD PJSIP
    # =====================================================

    @staticmethod
    def reload_pjsip():

        return AsteriskService.execute(
            'asterisk -rx "pjsip reload"'
        )

    # =====================================================
    # RELOAD DIALPLAN
    # =====================================================

    @staticmethod
    def reload_dialplan():

        return AsteriskService.execute(
            'asterisk -rx "dialplan reload"'
        )

    # =====================================================
    # CORE RELOAD
    # =====================================================

    @staticmethod
    def core_reload():

        return AsteriskService.execute(
            'asterisk -rx "core reload"'
        )

    # =====================================================
    # FULL SYNC
    # =====================================================

    @staticmethod
    def sync():

        # PJSIP
        AsteriskService.upload_pjsip()

        # Carrier → IP
        AsteriskService.upload_carriers()

        # Outbound routing
        AsteriskService.upload_routing()

        # NumberPool → Incoming DID
        AsteriskService.upload_inbound()

        # Reload PJSIP
        AsteriskService.reload_pjsip()

        # Reload Dialplan
        AsteriskService.reload_dialplan()

    # =====================================================
    # MONITORING
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