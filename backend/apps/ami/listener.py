from apps.ami.services import AMIService
from apps.ami.parser import AMIParser
from apps.ami.handlers import AMIHandler


class AMIListener:

    @staticmethod
    def start():

        sock, response = AMIService.login()

        print(response)

        buffer = ""

        while True:

            data = sock.recv(4096)

            if not data:
                break

            buffer += data.decode()

            while "\r\n\r\n" in buffer:

                raw_event, buffer = buffer.split(
                    "\r\n\r\n",
                    1,
                )

                event = AMIParser.parse(raw_event)

                if event:

                    AMIHandler.handle(event)