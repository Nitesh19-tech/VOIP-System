from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import InboundRoute
from .serializers import InboundRouteSerializer


class InboundRouteViewSet(ModelViewSet):

    serializer_class = InboundRouteSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    queryset = (
        InboundRoute.objects
        .select_related(
            "termination",
            "termination__carrier",
        )
        .order_by(
            "priority",
            "-created_at",
        )
    )

    def get_queryset(self):

        queryset = (
            InboundRoute.objects
            .select_related(
                "termination",
                "termination__carrier",
            )
            .order_by(
                "priority",
                "-created_at",
            )
        )

        # =================================================
        # SEARCH
        # =================================================

        search = self.request.query_params.get(
            "search"
        )

        if search:
            queryset = queryset.filter(
                did__icontains=search
            )

        # =================================================
        # TERMINATION FILTER
        # =================================================

        termination = self.request.query_params.get(
            "termination"
        )

        if termination:
            queryset = queryset.filter(
                termination_id=termination
            )

        # =================================================
        # ENABLED FILTER
        # =================================================

        enabled = self.request.query_params.get(
            "enabled"
        )

        if enabled is not None:

            if enabled.lower() == "true":

                queryset = queryset.filter(
                    enabled=True
                )

            elif enabled.lower() == "false":

                queryset = queryset.filter(
                    enabled=False
                )

        return queryset