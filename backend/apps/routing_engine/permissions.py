from django.core.exceptions import PermissionDenied


class CallPermission:

    @staticmethod
    def validate(client, routing_result):

        # -------------------------------------
        # Client Active
        # -------------------------------------

        if not client.is_active:

            raise PermissionDenied(
                "Client is inactive."
            )

        # -------------------------------------
        # Carrier Active
        # -------------------------------------

        if not routing_result.carrier.is_active:

            raise PermissionDenied(
                "Carrier is inactive."
            )

        # -------------------------------------
        # Termination Active
        # -------------------------------------

        if not routing_result.termination.is_active:

            raise PermissionDenied(
                "Termination is inactive."
            )

        return True