from dataclasses import dataclass
from decimal import Decimal

from apps.routes.models import Route
from apps.routing_plans.models import RoutingPlan
from apps.carriers.models import Carrier, Termination


@dataclass(slots=True)
class RoutingResult:

    route: Route

    routing_plan: RoutingPlan

    termination: Termination

    carrier: Carrier

    priority: int

    cost: Decimal

    original_number: str

    dial_number: str