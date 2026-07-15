from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import RoutingPlanSerializer
from .services import RoutingPlanService


class RoutingPlanListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        plans = RoutingPlanService.get_all(
            request.user,
            request.query_params,
        )

        serializer = RoutingPlanSerializer(
            plans,
            many=True,
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def post(self, request):

        serializer = RoutingPlanSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        plan = RoutingPlanService.create_plan(
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Routing Plan created successfully.",
                "data": RoutingPlanSerializer(
                    plan,
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class RoutingPlanDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):

        return RoutingPlanService.get_by_id(pk)

    def get(self, request, pk):

        serializer = RoutingPlanSerializer(
            self.get_object(pk),
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def put(self, request, pk):

        plan = self.get_object(pk)

        serializer = RoutingPlanSerializer(
            plan,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        plan = RoutingPlanService.update_plan(
            plan,
            serializer.validated_data,
            request.user,
        )

        return Response(
            {
                "success": True,
                "message": "Routing Plan updated successfully.",
                "data": RoutingPlanSerializer(
                    plan,
                ).data,
            }
        )

    def delete(self, request, pk):

        plan = self.get_object(pk)

        RoutingPlanService.delete_plan(plan)

        return Response(
            {
                "success": True,
                "message": "Routing Plan deleted successfully.",
            },
            status=status.HTTP_204_NO_CONTENT,
        )