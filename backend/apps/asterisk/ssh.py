import os
import tempfile
import time

import paramiko


class AsteriskSSH:

    def __init__(
        self,
        host,
        username,
        password,
        port=22,
    ):
        self.host = host
        self.username = username
        self.password = password
        self.port = port

        self.client = None
        self.sftp = None

    def connect(self):

        if (
            self.client
            and self.client.get_transport()
            and self.client.get_transport().is_active()
        ):
            return

        self.close()

        last_exception = None

        for _ in range(3):

            try:

                self.client = paramiko.SSHClient()

                self.client.set_missing_host_key_policy(
                    paramiko.AutoAddPolicy()
                )

                self.client.connect(
                    hostname=self.host,
                    username=self.username,
                    password=self.password,
                    port=self.port,
                    timeout=15,
                    banner_timeout=30,
                    auth_timeout=15,
                    look_for_keys=False,
                    allow_agent=False,
                )

                transport = self.client.get_transport()

                if transport:
                    transport.set_keepalive(30)

                self.sftp = self.client.open_sftp()

                return

            except Exception as e:

                last_exception = e

                self.close()

                time.sleep(1)

        raise last_exception

    def close(self):

        try:
            if self.sftp:
                self.sftp.close()
        except Exception:
            pass

        try:
            if self.client:
                self.client.close()
        except Exception:
            pass

        self.sftp = None
        self.client = None

    def execute(self, command):

        self.connect()

        try:

            stdin, stdout, stderr = self.client.exec_command(
                command,
                timeout=20,
            )

            output = stdout.read().decode()

            error = stderr.read().decode()

            return output, error

        finally:

            self.close()

    def upload_text(self, remote_path, content):

        self.connect()

        try:

            with self.sftp.file(remote_path, "w") as f:
                f.write(content)

        finally:

            self.close()

    def upload_file(self, local_file, remote_file):

        self.connect()

        try:

            self.sftp.put(
                local_file,
                remote_file,
            )

        finally:

            self.close()

    def download_file(self, remote_file, local_file):

        self.connect()

        try:

            self.sftp.get(
                remote_file,
                local_file,
            )

        finally:

            self.close()

    def upload_content(self, remote_file, content):

        fd, temp_file = tempfile.mkstemp()

        try:

            with os.fdopen(fd, "w") as f:
                f.write(content)

            self.upload_file(
                temp_file,
                remote_file,
            )

        finally:

            if os.path.exists(temp_file):
                os.remove(temp_file)

    def backup_file(self, remote_file):

        return self.execute(
            f"cp {remote_file} {remote_file}.bak"
        )

    def reload_pjsip(self):

        return self.execute(
            "asterisk -rx 'pjsip reload'"
        )

    def reload_dialplan(self):

        return self.execute(
            "asterisk -rx 'dialplan reload'"
        )

    def core_reload(self):

        return self.execute(
            "asterisk -rx 'core reload'"
        )

    def show_endpoints(self):

        return self.execute(
            "asterisk -rx 'pjsip show endpoints'"
        )

    def show_contacts(self):

        return self.execute(
            "asterisk -rx 'pjsip show contacts'"
        )

    def show_channels(self):

        return self.execute(
            "asterisk -rx 'core show channels'"
        )

    def show_channels_concise(self):

        return self.execute(
            "asterisk -rx 'core show channels concise'"
        )

    def __del__(self):

        self.close()