from .models import RoutingPlan


def get_routing_plans():

    return RoutingPlan.objects.all()