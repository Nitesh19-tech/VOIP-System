class AMIParser:

    @staticmethod
    def parse(raw_event):

        event = {}

        for line in raw_event.splitlines():

            if ":" not in line:
                continue

            key, value = line.split(":", 1)

            event[key.strip()] = value.strip()

        return event