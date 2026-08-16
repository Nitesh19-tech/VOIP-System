from django.shortcuts import get_object_or_404

from .models import Route


class RouteService:

    @staticmethod
    def get_all(user, params=None):

        queryset = Route.objects.select_related(
            "routing_plan",
            "termination",
            "termination__carrier",
        )

        if params:

            search = params.get("search")

            if search:
                queryset = queryset.filter(
                    prefix__icontains=search,
                )

            routing_plan = params.get("routing_plan")

            if routing_plan:
                queryset = queryset.filter(
                    routing_plan_id=routing_plan,
                )

            termination = params.get("termination")

            if termination:
                queryset = queryset.filter(
                    termination_id=termination,
                )

        return queryset

    @staticmethod
    def get_by_id(pk):

        return get_object_or_404(
            Route,
            pk=pk,
        )

    @staticmethod
    def create_route(data, user):

        route = Route.objects.create(
            **data,
            created_by=user,
        )

        return route

    @staticmethod
    def update_route(route, data, user):

        for key, value in data.items():

            setattr(
                route,
                key,
                value,
            )

        route.save()

        return route

    @staticmethod
    def delete_route(route):

        route.delete()