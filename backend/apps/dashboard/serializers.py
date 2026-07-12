from rest_framework import serializers


class DashboardOverviewSerializer(serializers.Serializer):

    total_companies = serializers.IntegerField()

    total_clients = serializers.IntegerField()

    total_admins = serializers.IntegerField()

    total_extensions = serializers.IntegerField()

    registered_devices = serializers.IntegerField()

    online_extensions = serializers.IntegerField()

    offline_extensions = serializers.IntegerField()

    active_calls = serializers.IntegerField()

    today_calls = serializers.IntegerField()

    answered_calls = serializers.IntegerField()

    busy_calls = serializers.IntegerField()

    failed_calls = serializers.IntegerField()

    no_answer_calls = serializers.IntegerField()

    total_duration = serializers.IntegerField()

    average_duration = serializers.FloatField()


class ExtensionStatusSerializer(serializers.Serializer):

    extension = serializers.CharField()

    caller_id = serializers.CharField()

    client = serializers.CharField()

    status = serializers.CharField()


class DeviceSerializer(serializers.Serializer):

    extension = serializers.CharField()

    caller_id = serializers.CharField()

    client = serializers.CharField()

    ip_address = serializers.CharField()

    port = serializers.CharField()

    status = serializers.CharField()


class ActiveCallSerializer(serializers.Serializer):

    channel = serializers.CharField()

    extension = serializers.CharField()

    caller_id = serializers.CharField()

    client = serializers.CharField()

    connected_to = serializers.CharField()

    state = serializers.CharField()

    application = serializers.CharField()

    linkedid = serializers.CharField()