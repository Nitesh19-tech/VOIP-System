from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .services.provision import InboundProvisionService


class ApplyInboundChangesView(APIView):

    def post(self, request):

        result = InboundProvisionService().provision()

        if result["success"]:

            return Response(
                result,
                status=status.HTTP_200_OK,
            )

        return Response(
            result,
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )