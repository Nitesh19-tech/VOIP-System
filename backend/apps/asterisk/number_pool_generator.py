from apps.number_pool.models import NumberPool


class NumberPoolGenerator:
    CONTEXT = "from-carrier"

    # Number Service IDs / Names
    SERVICE_MAP = {
        "1": "Playback",
        "2": "PlaybackLoop",
        "3": "ConferenceCut",
        "4": "Reject",
        "playback": "Playback",
        "playbackloop": "PlaybackLoop",
        "conferencecut": "ConferenceCut",
        "reject": "Reject",
    }

    @classmethod
    def normalize_service(cls, service):
        if service is None:
            return ""

        value = str(service).strip()

        if not value:
            return ""

        return cls.SERVICE_MAP.get(
            value.lower(),
            value,
        )

    @staticmethod
    def _get_service_variables(number):
        variables = number.service_variables

        if not isinstance(variables, dict):
            return {}

        return variables

    @classmethod
    def _get_audio_file(cls, number):
        variables = cls._get_service_variables(number)

        audio_file = (
            variables.get("audio_file")
            or variables.get("audio")
            or variables.get("file")
            or ""
        )

        return str(audio_file).strip()

    @classmethod
    def generate(cls, number):
        """
        Generates the Number Pool mapping information.
        """

        lines = []

        lines.append(
            f"; =================================================="
        )
        lines.append(
            f"; DID: {number.number}"
        )
        lines.append(
            f"; =================================================="
        )

        if not getattr(number, "is_active", True):
            lines.append("; Number inactive")
            return "\n".join(lines)

        carrier = getattr(number, "carrier", None)

        if not carrier:
            lines.append("; No carrier assigned")
            return "\n".join(lines)

        if not getattr(carrier, "is_active", True):
            lines.append("; Carrier inactive")
            return "\n".join(lines)

        termination = getattr(number, "termination", None)

        if not termination:
            lines.append("; No termination assigned")
            return "\n".join(lines)

        if not getattr(termination, "is_active", True):
            lines.append("; Termination inactive")
            return "\n".join(lines)

        service = cls.normalize_service(
            getattr(number, "number_service", "")
        )

        lines.append(
            f"; Carrier: {carrier.name}"
        )

        lines.append(
            f"; Termination: {termination.name}"
        )

        lines.append(
            f"; Number Service: {service or 'None'}"
        )

        return "\n".join(lines)

    @classmethod
    def generate_dialplan(cls, number):
        """
        Generates inbound Asterisk dialplan for one DID.
        """

        did = str(number.number).strip()

        lines = []

        lines.append(
            f"; =================================================="
        )
        lines.append(
            f"; INBOUND DID: {did}"
        )
        lines.append(
            f"; =================================================="
        )

        # --------------------------------------------------
        # Basic validation
        # --------------------------------------------------

        if not getattr(number, "is_active", True):
            lines.append(
                f"exten => {did},1,NoOp(Number inactive)"
            )
            lines.append(
                f" same => n,Hangup(1)"
            )
            return "\n".join(lines)

        carrier = getattr(number, "carrier", None)

        if not carrier:
            lines.append(
                f"exten => {did},1,NoOp(No carrier assigned)"
            )
            lines.append(
                f" same => n,Hangup(1)"
            )
            return "\n".join(lines)

        if not getattr(carrier, "is_active", True):
            lines.append(
                f"exten => {did},1,NoOp(Carrier inactive)"
            )
            lines.append(
                f" same => n,Hangup(1)"
            )
            return "\n".join(lines)

        termination = getattr(number, "termination", None)

        if not termination:
            lines.append(
                f"exten => {did},1,NoOp(No termination assigned)"
            )
            lines.append(
                f" same => n,Hangup(1)"
            )
            return "\n".join(lines)

        if not getattr(termination, "is_active", True):
            lines.append(
                f"exten => {did},1,NoOp(Termination inactive)"
            )
            lines.append(
                f" same => n,Hangup(1)"
            )
            return "\n".join(lines)

        # --------------------------------------------------
        # Number Service
        # --------------------------------------------------

        service = cls.normalize_service(
            getattr(number, "number_service", "")
        )

        variables = cls._get_service_variables(number)

        audio_file = cls._get_audio_file(number)

        lines.append(
            f"exten => {did},1,NoOp(Inbound DID {did})"
        )

        lines.append(
            f" same => n,NoOp(Number Service: {service or 'None'})"
        )

        # --------------------------------------------------
        # No service
        #
        # Existing behaviour:
        # Answer -> wait -> Hangup
        #
        # This keeps the current IVR/inbound flow intact.
        # --------------------------------------------------

        if not service:
            lines.append(
                " same => n,Answer()"
            )
            lines.append(
                " same => n,Wait(60)"
            )
            lines.append(
                " same => n,Hangup()"
            )

            return "\n".join(lines)

        # --------------------------------------------------
        # PLAYBACK
        #
        # Play an audio file once and terminate the call.
        # --------------------------------------------------

        if service == "Playback":

            lines.append(
                " same => n,Answer()"
            )

            if audio_file:
                lines.append(
                    f" same => n,Playback({audio_file})"
                )
            else:
                lines.append(
                    " same => n,NoOp(Playback service: no audio_file configured)"
                )

            lines.append(
                " same => n,Hangup()"
            )

            return "\n".join(lines)

        # --------------------------------------------------
        # PLAYBACK LOOP
        #
        # Continuously play the configured audio file.
        #
        # Caller can terminate the call by hanging up.
        # --------------------------------------------------

        if service == "PlaybackLoop":

            lines.append(
                " same => n,Answer()"
            )

            if audio_file:

                lines.append(
                    " same => n(loop),Playback("
                    f"{audio_file}"
                    ")"
                )

                lines.append(
                    f" same => n,Goto({did},loop)"
                )

            else:
                lines.append(
                    " same => n,NoOp(PlaybackLoop service: no audio_file configured)"
                )

                lines.append(
                    " same => n,Wait(60)"
                )

            lines.append(
                " same => n,Hangup()"
            )

            return "\n".join(lines)

        # --------------------------------------------------
        # REJECT
        #
        # Immediately reject the incoming call.
        # Cause 21 = Call Rejected
        # --------------------------------------------------

        if service == "Reject":

            lines.append(
                " same => n,NoOp(Rejecting inbound call)"
            )

            lines.append(
                " same => n,Hangup(21)"
            )

            return "\n".join(lines)

        # --------------------------------------------------
        # CONFERENCE CUT
        #
        # The project currently has no existing conference
        # implementation. Therefore we treat this service as
        # a controlled call termination instead of pretending
        # that a conference participant exists.
        #
        # This gives ConferenceCut a safe deterministic
        # behaviour now and keeps it ready for a future
        # ConfBridge implementation.
        # --------------------------------------------------

        if service == "ConferenceCut":

            room = (
                variables.get("room")
                or variables.get("conference")
                or variables.get("conference_room")
                or "default"
            )

            lines.append(
                f" same => n,NoOp(ConferenceCut - Room: {room})"
            )

            lines.append(
                " same => n,Answer()"
            )

            lines.append(
                " same => n,NoOp(Cutting current conference call)"
            )

            lines.append(
                " same => n,Hangup()"
            )

            return "\n".join(lines)

        # --------------------------------------------------
        # UNKNOWN SERVICE
        # --------------------------------------------------

        lines.append(
            f" same => n,NoOp(Unknown Number Service: {service})"
        )

        lines.append(
            " same => n,Answer()"
        )

        lines.append(
            " same => n,Wait(5)"
        )

        lines.append(
            " same => n,Hangup()"
        )

        return "\n".join(lines)

    @classmethod
    def generate_all(cls):
        """
        Generates Number Pool mapping configuration.
        """

        numbers = (
            NumberPool.objects
            .select_related(
                "carrier",
                "termination",
            )
            .filter(is_active=True)
            .order_by("number")
        )

        lines = []

        lines.append(
            "; =================================================="
        )
        lines.append(
            "; VOIP BACKEND NUMBER POOL"
        )
        lines.append(
            "; =================================================="
        )
        lines.append("")

        for number in numbers:
            lines.append(
                cls.generate(number)
            )
            lines.append("")

        return "\n".join(lines)

    @classmethod
    def generate_all_dialplan(cls):
        """
        Generates complete inbound dialplan.
        """

        numbers = (
            NumberPool.objects
            .select_related(
                "carrier",
                "termination",
            )
            .filter(is_active=True)
            .order_by("number")
        )

        lines = []

        lines.append(
            f"[{cls.CONTEXT}]"
        )

        lines.append(
            "; =================================================="
        )
        lines.append(
            "; VOIP BACKEND INBOUND DIALPLAN"
        )
        lines.append(
            "; =================================================="
        )

        for number in numbers:

            lines.append("")

            dialplan = cls.generate_dialplan(
                number
            )

            lines.append(
                dialplan
            )

        lines.append("")

        return "\n".join(lines)