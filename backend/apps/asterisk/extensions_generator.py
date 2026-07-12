from apps.sip.models import SIPAccount


class ExtensionsGenerator:

    @staticmethod
    def generate(account):

        return f"""
exten => {account.number.extension},1,NoOp(Call from {account.username})
 same => n,Dial(PJSIP/{account.username},30)
 same => n,Hangup()

"""

    @staticmethod
    def generate_all():

        dialplan = """
[from-internal]

"""

        accounts = SIPAccount.objects.filter(
            status="ACTIVE"
        ).select_related(
            "number",
        )

        for account in accounts:
            dialplan += ExtensionsGenerator.generate(account)

        return dialplan