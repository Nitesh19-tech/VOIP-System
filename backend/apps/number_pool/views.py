from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import (
    NumberPoolSerializer,
    BulkAllocationSerializer,
    BulkUnallocationSerializer,
)

from .services import NumberPoolService
from .import_service import NumberPoolImportService
from .statistics import NumberPoolStatistics


# =========================================================
# NUMBER LIST + CREATE
# =========================================================

class NumberPoolListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        result = NumberPoolService.get_all(
            request.user,
            request.query_params,
        )

        # Service already performs pagination
        numbers = result["results"]

        serializer = NumberPoolSerializer(
            numbers,
            many=True,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,

                "pagination": {
                    "count": result["count"],
                    "page": result["page"],
                    "page_size": result["page_size"],
                    "total_pages": result["total_pages"],
                    "next": result["next"],
                    "previous": result["previous"],
                },
            }
        )

    def post(self, request):

        serializer = NumberPoolSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        number = NumberPoolService.create_number(
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Number created successfully.",
                "data": NumberPoolSerializer(
                    number
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


# =========================================================
# NUMBER DETAIL
# =========================================================

class NumberPoolDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):

        return NumberPoolService.get_by_id(
            pk,
            request.user,
        )

    def get(self, request, pk):

        serializer = NumberPoolSerializer(
            self.get_object(request, pk)
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def put(self, request, pk):

        number = self.get_object(
            request,
            pk,
        )

        serializer = NumberPoolSerializer(
            number,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        number = NumberPoolService.update_number(
            number,
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Number updated successfully.",
                "data": NumberPoolSerializer(
                    number
                ).data,
            }
        )

    def delete(self, request, pk):

        number = self.get_object(
            request,
            pk,
        )

        try:

            NumberPoolService.delete_number(
                number
            )

            return Response(
                {
                    "success": True,
                    "message": "Number deleted successfully.",
                },
                status=status.HTTP_200_OK,
            )

        except ValueError as e:

            return Response(
                {
                    "success": False,
                    "message": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:

            print(
                "Delete Number Error:",
                e,
            )

            return Response(
                {
                    "success": False,
                    "message": "Unable to delete number.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# =========================================================
# IMPORT NUMBERS
# =========================================================

class NumberPoolImportAPIView(APIView):

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
                    "message": (
                        "Please select a CSV or Excel file."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            result = NumberPoolImportService.import_file(
                file=file,
                user=request.user,
            )

            return Response(
                {
                    "success": True,
                    "message": "Import completed successfully.",
                    "data": result,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:

            print(
                "Number Import Error:",
                e,
            )

            return Response(
                {
                    "success": False,
                    "message": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


# =========================================================
# STATISTICS
# =========================================================

class NumberPoolStatisticsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            {
                "success": True,
                "data": NumberPoolStatistics.summary(),
            }
        )


# =========================================================
# BULK ALLOCATION
# =========================================================

class BulkAllocationAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = BulkAllocationSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:

            allocated = NumberPoolService.bulk_allocate(
                serializer.validated_data,
                request.user,
            )

            return Response(
                {
                    "success": True,
                    "allocated_count": allocated,
                    "message": (
                        f"{allocated} numbers "
                        "allocated successfully."
                    ),
                },
                status=status.HTTP_200_OK,
            )

        except ValueError as e:

            return Response(
                {
                    "success": False,
                    "message": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:

            print(
                "Bulk Allocation Error:",
                e,
            )

            return Response(
                {
                    "success": False,
                    "message": "Internal server error.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# =========================================================
# BULK UNALLOCATION
# =========================================================

class BulkUnallocationAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = BulkUnallocationSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:

            unallocated = NumberPoolService.bulk_unallocate(
                serializer.validated_data,
                request.user,
            )

            return Response(
                {
                    "success": True,
                    "unallocated_count": unallocated,
                    "message": (
                        f"{unallocated} numbers "
                        "unallocated successfully."
                    ),
                },
                status=status.HTTP_200_OK,
            )

        except ValueError as e:

            return Response(
                {
                    "success": False,
                    "message": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:

            print(
                "Bulk Unallocation Error:",
                e,
            )

            return Response(
                {
                    "success": False,
                    "message": "Internal server error.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )