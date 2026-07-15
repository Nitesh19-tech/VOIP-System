from .models import Route


def get_routes():

    return Route.objects.select_related(
        "routing_plan",
        "carrier",
    )