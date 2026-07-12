from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from .serializers import CountrySerializer
from .services import CountryService
from .country_import_service import CountryImportService


class CountryListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        countries = CountryService.get_all(request.user)

        serializer = CountrySerializer(
            countries,
            many=True,
        )

        return Response({
            "success": True,
            "data": serializer.data,
        })

    def post(self, request):

        serializer = CountrySerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        country = CountryService.create(
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Country created successfully.",
                "data": CountrySerializer(country).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CountryDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return CountryService.get_by_id(pk)

    def get(self, request, pk):

        serializer = CountrySerializer(
            self.get_object(pk)
        )

        return Response({
            "success": True,
            "data": serializer.data,
        })

    def put(self, request, pk):

        country = self.get_object(pk)

        serializer = CountrySerializer(
            country,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        country = CountryService.update(
            country,
            serializer.validated_data,
        )

        return Response({
            "success": True,
            "message": "Country updated successfully.",
            "data": CountrySerializer(country).data,
        })

    def delete(self, request, pk):

        country = self.get_object(pk)

        CountryService.delete(country)

        return Response(
            {
                "success": True,
                "message": "Country deleted successfully.",
            },
            status=status.HTTP_204_NO_CONTENT,
        )


class CountryImportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = (
        MultiPartParser,
        FormParser,
    )

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {
                    "success": False,
                    "message": "File is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = CountryImportService.import_file(
            file,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Countries imported successfully.",
                "data": result,
            }
        )