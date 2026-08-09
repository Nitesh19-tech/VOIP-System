from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsSuperAdminOrCompanyAdmin

from .serializers import (
    ActiveCallSerializer,
    DashboardOverviewSerializer,
    DeviceSerializer,
    ExtensionStatusSerializer,
)

from .services import DashboardService


class DashboardOverviewAPIView(APIView):

    permission_classes = [IsSuperAdminOrCompanyAdmin]

    def get(self, request):

        data = DashboardService.overview(
            request.user
        )

        serializer = DashboardOverviewSerializer(
            instance=data
        )

        return Response(serializer.data)


class ExtensionStatusAPIView(APIView):

    permission_classes = [IsSuperAdminOrCompanyAdmin]

    def get(self, request):

        data = DashboardService.extensions(
            request.user
        )

        serializer = ExtensionStatusSerializer(
            instance=data,
            many=True,
        )

        return Response(serializer.data)


class DeviceAPIView(APIView):

    permission_classes = [IsSuperAdminOrCompanyAdmin]

    def get(self, request):

        data = DashboardService.devices(
            request.user
        )

        serializer = DeviceSerializer(
            instance=data,
            many=True,
        )

        return Response(serializer.data)


class ActiveCallAPIView(APIView):

    permission_classes = [IsSuperAdminOrCompanyAdmin]

    def get(self, request):

        data = DashboardService.active_calls(
            request.user
        )

        serializer = ActiveCallSerializer(
            instance=data,
            many=True,
        )

        return Response(serializer.data)