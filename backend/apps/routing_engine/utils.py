class NumberUtils:

    @staticmethod
    def normalize(number):

        if not number:
            return ""

        number = str(number)

        return (
            number
            .replace("+", "")
            .replace("-", "")
            .replace(" ", "")
            .replace("(", "")
            .replace(")", "")
        )

    @staticmethod
    def strip_digits(number, digits):

        digits = digits or 0

        if digits <= 0:
            return number

        return number[digits:]

    @staticmethod
    def add_prefix(number, prefix):

        prefix = prefix or ""

        return f"{prefix}{number}"