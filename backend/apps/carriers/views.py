from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import (
    CarrierSerializer,
    CarrierIPSerializer,
    TerminationSerializer,
)

from .services import (
    CarrierService,
    CarrierIPService,
    TerminationService,
)


# =====================================================
# CARRIER
# =====================================================

class CarrierListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        carriers = CarrierService.get_all(
            request.user,
            request.query_params,
        )

        serializer = CarrierSerializer(
            carriers,
            many=True,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def post(self, request):

        serializer = CarrierSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        carrier = CarrierService.create_carrier(
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Carrier created successfully.",
                "data": CarrierSerializer(
                    carrier,
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CarrierDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):

        return CarrierService.get_by_id(pk)

    def get(self, request, pk):

        serializer = CarrierSerializer(
            self.get_object(pk),
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def put(self, request, pk):

        carrier = self.get_object(pk)

        serializer = CarrierSerializer(
            carrier,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        carrier = CarrierService.update_carrier(
            carrier,
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Carrier updated successfully.",
                "data": CarrierSerializer(
                    carrier,
                ).data,
            }
        )

    def delete(self, request, pk):

        carrier = self.get_object(pk)

        CarrierService.delete_carrier(
            carrier,
        )

        return Response(
            {
                "success": True,
                "message": "Carrier deleted successfully.",
            },
            status=status.HTTP_204_NO_CONTENT,
        )


# =====================================================
# CARRIER IP
# =====================================================

class CarrierIPListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        ips = CarrierIPService.get_all(
            request.user,
            request.query_params,
        )

        serializer = CarrierIPSerializer(
            ips,
            many=True,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def post(self, request):

        serializer = CarrierIPSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        ip = CarrierIPService.create_ip(
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Carrier IP added successfully.",
                "data": CarrierIPSerializer(
                    ip,
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CarrierIPDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):

        return CarrierIPService.get_by_id(pk)

    def get(self, request, pk):

        serializer = CarrierIPSerializer(
            self.get_object(pk)
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def put(self, request, pk):

        ip = self.get_object(pk)

        serializer = CarrierIPSerializer(
            ip,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        ip = CarrierIPService.update_ip(
            ip,
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Carrier IP updated successfully.",
                "data": CarrierIPSerializer(
                    ip,
                ).data,
            }
        )

    def delete(self, request, pk):

        ip = self.get_object(pk)

        CarrierIPService.delete_ip(
            ip
        )

        return Response(
            {
                "success": True,
                "message": "Carrier IP deleted successfully.",
            },
            status=status.HTTP_204_NO_CONTENT,
        )


# =====================================================
# TERMINATION
# =====================================================

class TerminationListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        terminations = TerminationService.get_all(
            request.user,
            request.query_params,
        )

        serializer = TerminationSerializer(
            terminations,
            many=True,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def post(self, request):

        serializer = TerminationSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        termination = TerminationService.create_termination(
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Termination created successfully.",
                "data": TerminationSerializer(
                    termination,
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


# =====================================================
# TERMINATION CSV IMPORT
# =====================================================

class TerminationImportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def post(self, request):

        # ---------------------------------------------
        # GET CSV FILE
        # ---------------------------------------------

        csv_file = request.FILES.get(
            "file"
        )

        if not csv_file:

            return Response(
                {
                    "success": False,
                    "message": "CSV file is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------
        # FILE EXTENSION CHECK
        # ---------------------------------------------

        if not csv_file.name.lower().endswith(
            ".csv"
        ):

            return Response(
                {
                    "success": False,
                    "message": "Only CSV files are allowed.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------
        # IMPORT
        # ---------------------------------------------

        try:

            result = TerminationService.import_csv(
                file_obj=csv_file,
                user=request.user,
                carrier_name="saurabh1",
            )

        except ValueError as exc:

            return Response(
                {
                    "success": False,
                    "message": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as exc:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Termination CSV import failed."
                    ),
                    "error": str(exc),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # ---------------------------------------------
        # SUCCESS
        # ---------------------------------------------

        return Response(
            {
                "success": True,
                "message": (
                    "Termination CSV import "
                    "completed successfully."
                ),
                "data": result,
            },
            status=status.HTTP_200_OK,
        )


# =====================================================
# TERMINATION DETAIL
# =====================================================

class TerminationDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):

        return TerminationService.get_by_id(
            pk
        )

    def get(self, request, pk):

        serializer = TerminationSerializer(
            self.get_object(pk),
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def put(self, request, pk):

        termination = self.get_object(
            pk
        )

        serializer = TerminationSerializer(
            termination,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        termination = (
            TerminationService.update_termination(
                termination,
                serializer.validated_data,
                request.user,
            )
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Termination updated successfully."
                ),
                "data": TerminationSerializer(
                    termination,
                ).data,
            }
        )

    def delete(self, request, pk):

        termination = self.get_object(
            pk
        )

        TerminationService.delete_termination(
            termination
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Termination deleted successfully."
                ),
            },
            status=status.HTTP_204_NO_CONTENT,
        )