from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RouteSerializer
from .services import RouteService


class RouteListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        routes = RouteService.get_all(
            request.user,
            request.query_params,
        )

        serializer = RouteSerializer(
            routes,
            many=True,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def post(self, request):

        serializer = RouteSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        route = RouteService.create_route(
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Route created successfully.",
                "data": RouteSerializer(route).data,
            },
            status=status.HTTP_201_CREATED,
        )


class RouteDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):

        return RouteService.get_by_id(pk)

    def get(self, request, pk):

        serializer = RouteSerializer(
            self.get_object(pk),
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def put(self, request, pk):

        route = self.get_object(pk)

        serializer = RouteSerializer(
            route,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        route = RouteService.update_route(
            route,
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Route updated successfully.",
                "data": RouteSerializer(route).data,
            }
        )

    def delete(self, request, pk):

        route = self.get_object(pk)

        RouteService.delete_route(route)

        return Response(
            {
                "success": True,
                "message": "Route deleted successfully.",
            },
            status=status.HTTP_204_NO_CONTENT,
        )