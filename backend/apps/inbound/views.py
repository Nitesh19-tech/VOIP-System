from rest_framework.viewsets import ModelViewSet

from .models import InboundRoute
from .serializers import InboundRouteSerializer


class InboundRouteViewSet(ModelViewSet):

    queryset = InboundRoute.objects.all()

    serializer_class = InboundRouteSerializer