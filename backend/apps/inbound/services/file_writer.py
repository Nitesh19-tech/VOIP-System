import os
from pathlib import Path

from django.conf import settings

from .dialplan_generator import InboundDialplanGenerator


class InboundFileWriter:

    FILE = Path(
        getattr(
            settings,
            "INBOUND_DIALPLAN_FILE",
            os.path.join(settings.BASE_DIR, "generated", "inbound_routes.conf"),
        )
    )

    def write(self):

        content = InboundDialplanGenerator().generate()

        self.FILE.parent.mkdir(parents=True, exist_ok=True)

        self.FILE.write_text(content, encoding="utf-8")

        return self.FILE