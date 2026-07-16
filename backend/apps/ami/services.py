import socket

from django.conf import settings

from .actions import AMIActions


class AMIService:

    def __init__(self):

        self.sock = None

    # =====================================================
    # Context Manager
    # =====================================================

    def __enter__(self):

        self.connect()
        self.login()

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):

        self.logout()

    # =====================================================
    # Connect
    # =====================================================

    def connect(self):

        if self.sock:
            return

        self.sock = socket.create_connection(
            (
                settings.AMI_HOST,
                settings.AMI_PORT,
            ),
            timeout=10,
        )

        # Read Banner
        self.sock.recv(1024)

    # =====================================================
    # Login
    # =====================================================

    def login(self):

        action = AMIActions.login(
            settings.AMI_USERNAME,
            settings.AMI_SECRET,
        )

        return self.execute(action)

    # =====================================================
    # Send
    # =====================================================

    def send(self, action):

        if not self.sock:
            raise ConnectionError(
                "AMI is not connected."
            )

        self.sock.sendall(action.encode())

    # =====================================================
    # Receive
    # =====================================================

    def receive(self):

        if not self.sock:
            raise ConnectionError(
                "AMI is not connected."
            )

        data = b""

        while True:

            chunk = self.sock.recv(4096)

            if not chunk:
                break

            data += chunk

            if b"\r\n\r\n" in data:
                break

        return data.decode()

    # =====================================================
    # Execute
    # =====================================================

    def execute(self, action):

        self.send(action)

        return self.receive()

    # =====================================================
    # Execute CLI Command
    # =====================================================

    def command(self, cli_command):

        action = (
            "Action: Command\r\n"
            f"Command: {cli_command}\r\n"
            "\r\n"
        )

        return self.execute(action)

    # =====================================================
    # Ping
    # =====================================================

    def ping(self):

        return self.execute(
            AMIActions.ping()
        )

    # =====================================================
    # Logoff
    # =====================================================

    def logout(self):

        if not self.sock:
            return

        try:

            self.send(
                AMIActions.logoff()
            )

        except Exception:
            pass

        try:

            self.sock.close()

        finally:

            self.sock = None