from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    CarrierSerializer,
    CarrierIPSerializer,
)
from .services import CarrierIPService, CarrierService


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

        return Response({

            "success": True,

            "data": serializer.data,

        })

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

        return Response({

            "success": True,

            "message": "Carrier IP added successfully.",

            "data": CarrierIPSerializer(ip).data,

        }, status=status.HTTP_201_CREATED)
class CarrierIPDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):

        return CarrierIPService.get_by_id(pk)

    def get(self, request, pk):

        serializer = CarrierIPSerializer(
            self.get_object(pk)
        )

        return Response({

            "success": True,

            "data": serializer.data,

        })

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

        return Response({

            "success": True,

            "message": "Carrier IP updated successfully.",

            "data": CarrierIPSerializer(ip).data,

        })

    def delete(self, request, pk):

        ip = self.get_object(pk)

        CarrierIPService.delete_ip(ip)

        return Response({

            "success": True,

            "message": "Carrier IP deleted successfully.",

        }, status=status.HTTP_204_NO_CONTENT)