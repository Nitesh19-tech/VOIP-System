from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from .models import LiveCall
from .serializers import LiveCallSerializer


class LiveCallListAPIView(ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = LiveCallSerializer

    queryset = (
        LiveCall.objects
        .all()
        .order_by("-started_at")
    )