from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.accounts.permissions import (
    IsSuperAdmin,
)

from .serializers import TrunkSerializer
from .services import TrunkService


class TrunkListCreateAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):

        trunks = TrunkService.get_all(
            request.user,
        )

        serializer = TrunkSerializer(
            trunks,
            many=True,
        )

        return Response(
            serializer.data,
        )

    def post(self, request):

        serializer = TrunkSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        trunk = TrunkService.create_trunk(
            serializer.validated_data,
            request.user,
        )

        return Response(
            TrunkSerializer(trunk).data,
            status=status.HTTP_201_CREATED,
        )
class TrunkDetailAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, pk):

        trunk = TrunkService.get_by_id(
            pk,
            request.user,
        )

        serializer = TrunkSerializer(
            trunk,
        )

        return Response(
            serializer.data,
        )

    def put(self, request, pk):

        trunk = TrunkService.get_by_id(
            pk,
            request.user,
        )

        serializer = TrunkSerializer(
            trunk,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        trunk = TrunkService.update_trunk(
            trunk,
            serializer.validated_data,
            request.user,
        )

        return Response(
            TrunkSerializer(trunk).data,
        )

    def delete(self, request, pk):

        trunk = TrunkService.get_by_id(
            pk,
            request.user,
        )

        TrunkService.delete_trunk(
            trunk,
        )

        return Response(
            {
                "message": "Trunk deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT,
        )