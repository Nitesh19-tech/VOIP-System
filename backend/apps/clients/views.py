from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import ClientSerializer
from .services import ClientService


class ClientListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        clients = ClientService.get_all(request.user)

        serializer = ClientSerializer(
            clients,
            many=True,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def post(self, request):

        serializer = ClientSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        try:
            result = ClientService.create_client(
                serializer.validated_data,
                request.user,
            )

            return Response(
                {
                    "success": True,
                    "message": "Client created successfully.",
                    "temporary_password": result["password"],
                    "data": ClientSerializer(
                        result["client"]
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        except ValueError as e:

            return Response(
                {
                    "success": False,
                    "message": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class ClientDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        return ClientService.get_by_id(
            pk,
            request.user,
        )

    def get(self, request, pk):

        serializer = ClientSerializer(
            self.get_object(request, pk)
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def put(self, request, pk):

        client = self.get_object(request, pk)

        serializer = ClientSerializer(
            client,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        client = ClientService.update_client(
            client,
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Client updated successfully.",
                "data": ClientSerializer(client).data,
            }
        )

    def delete(self, request, pk):

        client = self.get_object(request, pk)

        ClientService.delete_client(client)

        return Response(
            {
                "success": True,
                "message": "Client deleted successfully.",
            },
            status=status.HTTP_204_NO_CONTENT,
        )