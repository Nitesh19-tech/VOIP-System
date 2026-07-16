from django.db.models.signals import post_delete
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import InboundRoute
from .services.provision import InboundProvisionService


@receiver(post_save, sender=InboundRoute)
def inbound_saved(sender, instance, **kwargs):

    InboundProvisionService().provision()


@receiver(post_delete, sender=InboundRoute)
def inbound_deleted(sender, instance, **kwargs):

    InboundProvisionService().provision()