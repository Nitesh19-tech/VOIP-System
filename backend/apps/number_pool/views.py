from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import (
    NumberPoolSerializer,
    BulkAllocationSerializer,
    BulkUnallocationSerializer,
    BulkDeleteSerializer,
    AutoAssignSerializer,
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

        try:

            number = NumberPoolService.create_number(
                serializer.validated_data,
                request.user,
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
                "Create Number Error:",
                e,
            )

            return Response(
                {
                    "success": False,
                    "message": "Unable to create number.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if isinstance(number, list):
            response_data = NumberPoolSerializer(
                number,
                many=True,
            ).data
            message = f"{len(number)} numbers created successfully."
        else:
            response_data = NumberPoolSerializer(number).data
            message = "Number created successfully."

        return Response(
            {
                "success": True,
                "message": message,
                "data": response_data,
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

        try:

            number = NumberPoolService.update_number(
                number,
                serializer.validated_data,
                request.user,
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
                "Update Number Error:",
                e,
            )

            return Response(
                {
                    "success": False,
                    "message": "Unable to update number.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
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

            # -------------------------------------------------
            # IMPORT OPTIONS FROM PREVIOUS PANEL
            # -------------------------------------------------

            carrier = request.data.get("carrier")
            termination = request.data.get("termination")
            client = request.data.get("client")

            service_id = (
                request.data.get("number_service")
                or request.data.get("service_id")
                or ""
            )

            service_variables = request.data.get(
                "service_variables"
            )

            max_calls = (
                request.data.get("daily_max_call")
                or request.data.get("maxcall")
                or 0
            )

            max_duration = (
                request.data.get("daily_max_duration")
                or request.data.get("maxduration")
                or 0
            )

            make_test_number = request.data.get(
                "make_test_number"
            )

            if make_test_number is None:
                make_test_number = request.data.get(
                    "setfirsttest"
                )

            # Multipart form values arrive as strings.
            make_test_number = str(
                make_test_number or ""
            ).lower() in {
                "1",
                "true",
                "yes",
                "on",
            }

            result = NumberPoolImportService.import_file(
                file=file,
                user=request.user,
                carrier=carrier,
                termination=termination,
                client=client,
                service_id=service_id,
                service_variables=service_variables,
                max_calls=max_calls,
                max_duration=max_duration,
                make_test_number=make_test_number,
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



# =========================================================
# BULK DELETE
# =========================================================

class BulkDeleteAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = BulkDeleteSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:

            result = NumberPoolService.bulk_delete(
                serializer.validated_data[
                    "number_ids"
                ],
                request.user,
            )

            # -------------------------------------------------
            # Support both:
            #   integer result
            #   {"deleted": count, ...} result
            # -------------------------------------------------

            if isinstance(result, dict):

                deleted_count = result.get(
                    "deleted",
                    result.get(
                        "deleted_count",
                        0,
                    ),
                )

                response_data = result

            else:

                deleted_count = result

                response_data = {
                    "deleted": deleted_count,
                }

            return Response(
                {
                    "success": True,
                    "deleted_count": deleted_count,
                    "message": (
                        f"{deleted_count} numbers "
                        "deleted successfully."
                    ),
                    "data": response_data,
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
                "Bulk Delete Error:",
                e,
            )

            return Response(
                {
                    "success": False,
                    "message": (
                        "Unable to delete "
                        "selected numbers."
                    ),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# =========================================================
# AUTO ASSIGN NUMBERS
# =========================================================

class AutoAssignAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = AutoAssignSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:

            result = NumberPoolService.auto_assign(
                serializer.validated_data,
                request.user,
            )

            return Response(
                {
                    "success": True,
                    "message": (
                        f"{result['allocated']} numbers "
                        "assigned successfully."
                    ),
                    "data": result,
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
                "Auto Assign Error:",
                e,
            )

            return Response(
                {
                    "success": False,
                    "message": "Internal server error.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )