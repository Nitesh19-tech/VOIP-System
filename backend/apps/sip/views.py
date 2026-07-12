from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import SIPAccountSerializer
from .services import SIPAccountService


class SIPAccountListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        accounts = SIPAccountService.get_all(
            request.user
        )

        serializer = SIPAccountSerializer(
            accounts,
            many=True,
        )

        return Response(
            {
                "success": True,
                "count": len(serializer.data),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = SIPAccountSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        account = SIPAccountService.create_sip(
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "SIP Account created successfully.",
                "data": SIPAccountSerializer(
                    account
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class SIPAccountDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):

        return SIPAccountService.get_by_id(
            pk,
            request.user,
        )

    def get(self, request, pk):

        account = self.get_object(
            request,
            pk,
        )

        serializer = SIPAccountSerializer(
            account,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        account = self.get_object(
            request,
            pk,
        )

        serializer = SIPAccountSerializer(
            account,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        account = SIPAccountService.update_sip(
            account,
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "SIP Account updated successfully.",
                "data": SIPAccountSerializer(
                    account
                ).data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        account = self.get_object(
            request,
            pk,
        )

        SIPAccountService.delete_sip(
            account
        )

        return Response(
            {
                "success": True,
                "message": "SIP Account deleted successfully.",
            },
            status=status.HTTP_204_NO_CONTENT,
        )