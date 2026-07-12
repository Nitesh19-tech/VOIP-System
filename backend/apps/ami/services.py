import socket

from django.conf import settings


class AMIService:

    @staticmethod
    def connect():

        sock = socket.socket(
            socket.AF_INET,
            socket.SOCK_STREAM,
        )

        sock.connect(
            (
                settings.AMI_HOST,
                settings.AMI_PORT,
            )
        )

        banner = sock.recv(1024).decode()

        return sock, banner

    @staticmethod
    def login():

        sock = socket.socket(
            socket.AF_INET,
            socket.SOCK_STREAM,
        )

        sock.connect(
            (
                settings.AMI_HOST,
                settings.AMI_PORT,
            )
        )

        # Read AMI banner
        sock.recv(1024)

        login_action = (
            f"Action: Login\r\n"
            f"Username: {settings.AMI_USERNAME}\r\n"
            f"Secret: {settings.AMI_SECRET}\r\n"
            f"Events: on\r\n"
            f"\r\n"
        )

        sock.send(login_action.encode())

        response = sock.recv(4096).decode()

        return sock, response