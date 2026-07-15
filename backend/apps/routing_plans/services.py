from django.shortcuts import get_object_or_404

from .models import RoutingPlan


class RoutingPlanService:

    @staticmethod
    def get_all(user, params=None):

        queryset = RoutingPlan.objects.all()

        search = params.get("search")

        if search:

            queryset = queryset.filter(
                name__icontains=search,
            )

        return queryset

    @staticmethod
    def get_by_id(pk):

        return get_object_or_404(
            RoutingPlan,
            pk=pk,
        )

    @staticmethod
    def create_plan(data, user):

        return RoutingPlan.objects.create(
            **data,
            created_by=user,
        )

    @staticmethod
    def update_plan(plan, data, user):

        for key, value in data.items():

            setattr(
                plan,
                key,
                value,
            )

        plan.save()

        return plan

    @staticmethod
    def delete_plan(plan):

        plan.delete()