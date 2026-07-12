from django.http import JsonResponse


def home(request):
    return JsonResponse(
        {
            "status": "running",
            "application": "VoIP Management System",
            "version": "1.0.0",
            "message": "VoIP Backend API is running successfully.",
        }
    )