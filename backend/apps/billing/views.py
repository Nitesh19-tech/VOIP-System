from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import RateSerializer
from .services import RateService


class RateListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        keyword = request.GET.get(
            "search",
            "",
        )

        rates = RateService.search(
            request.user,
            keyword,
        )

        serializer = RateSerializer(
            rates,
            many=True,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def post(self, request):

        serializer = RateSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        rate = RateService.create_rate(
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Rate created successfully.",
                "data": RateSerializer(
                    rate
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class RateDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(
        self,
        request,
        pk,
    ):

        return RateService.get_by_id(
            pk,
            request.user,
        )

    def get(
        self,
        request,
        pk,
    ):

        serializer = RateSerializer(
            self.get_object(
                request,
                pk,
            )
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def put(
        self,
        request,
        pk,
    ):

        rate = self.get_object(
            request,
            pk,
        )

        serializer = RateSerializer(
            rate,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        rate = RateService.update_rate(
            rate,
            serializer.validated_data,
        )

        return Response(
            {
                "success": True,
                "message": "Rate updated successfully.",
                "data": RateSerializer(
                    rate
                ).data,
            }
        )

    def delete(
        self,
        request,
        pk,
    ):

        rate = self.get_object(
            request,
            pk,
        )

        RateService.delete_rate(
            rate,
        )

        return Response(
            {
                "success": True,
                "message": "Rate deleted successfully.",
            },
            status=status.HTTP_204_NO_CONTENT,
        )