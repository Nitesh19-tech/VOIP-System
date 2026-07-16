class AMIActions:

    # =====================================================
    # Login
    # =====================================================

    @staticmethod
    def login(username, secret):

        return (
            "Action: Login\r\n"
            f"Username: {username}\r\n"
            f"Secret: {secret}\r\n"
            "Events: on\r\n"
            "\r\n"
        )

    # =====================================================
    # Logoff
    # =====================================================

    @staticmethod
    def logoff():

        return (
            "Action: Logoff\r\n"
            "\r\n"
        )

    # =====================================================
    # Ping
    # =====================================================

    @staticmethod
    def ping():

        return (
            "Action: Ping\r\n"
            "\r\n"
        )

    # =====================================================
    # Core Status
    # =====================================================

    @staticmethod
    def core_status():

        return (
            "Action: CoreStatus\r\n"
            "\r\n"
        )

    # =====================================================
    # SIP Peers
    # =====================================================

    @staticmethod
    def pjsip_show_endpoints():

        return (
            "Action: Command\r\n"
            "Command: pjsip show endpoints\r\n"
            "\r\n"
        )

    # =====================================================
    # Active Channels
    # =====================================================

    @staticmethod
    def core_show_channels():

        return (
            "Action: Command\r\n"
            "Command: core show channels concise\r\n"
            "\r\n"
        )

    # =====================================================
    # Reload PJSIP
    # =====================================================

    @staticmethod
    def reload_pjsip():

        return (
            "Action: Command\r\n"
            "Command: pjsip reload\r\n"
            "\r\n"
        )

    # =====================================================
    # Reload Dialplan
    # =====================================================

    @staticmethod
    def reload_dialplan():

        return (
            "Action: Command\r\n"
            "Command: dialplan reload\r\n"
            "\r\n"
        )

    # =====================================================
    # Originate
    # =====================================================

    @staticmethod
    def originate(

        channel,

        context,

        extension,

        priority=1,

        callerid=None,

        timeout=30000,

    ):

        action = (
            "Action: Originate\r\n"
            f"Channel: {channel}\r\n"
            f"Context: {context}\r\n"
            f"Exten: {extension}\r\n"
            f"Priority: {priority}\r\n"
            f"Timeout: {timeout}\r\n"
        )

        if callerid:

            action += (
                f"CallerID: {callerid}\r\n"
            )

        action += "\r\n"

        return action

    # =====================================================
    # Hangup
    # =====================================================

    @staticmethod
    def hangup(channel):

        return (
            "Action: Hangup\r\n"
            f"Channel: {channel}\r\n"
            "\r\n"
        )