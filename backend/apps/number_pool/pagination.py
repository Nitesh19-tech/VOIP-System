from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class NumberPoolPagination(PageNumberPagination):

    # =====================================================
    # DEFAULT PAGE SIZE
    # =====================================================

    page_size = 25

    # Frontend se:
    #
    # ?page_size=25
    # ?page_size=50
    # ?page_size=100
    # ?page_size=500
    # ?page_size=all
    #
    page_size_query_param = "page_size"

    # Maximum normal page size
    max_page_size = 500

    # =====================================================
    # PAGINATE QUERYSET
    # =====================================================

    def paginate_queryset(self, queryset, request, view=None):

        self.request = request

        page_size = request.query_params.get(
            self.page_size_query_param
        )

        # =================================================
        # ALL RECORDS
        # =================================================

        if page_size and page_size.lower() == "all":

            # Pagination completely bypass
            #
            # Is case mein queryset ke saare records
            # ek hi response mein jayenge.
            #
            self.page = None

            return list(queryset)

        # =================================================
        # NORMAL PAGINATION
        # =================================================

        return super().paginate_queryset(
            queryset,
            request,
            view
        )

    # =====================================================
    # PAGINATED RESPONSE
    # =====================================================

    def get_paginated_response(self, data):

        # =================================================
        # ALL
        # =================================================

        if self.page is None:

            total_count = len(data)

            return Response({

                "success": True,

                "data": data,

                "pagination": {

                    "count": total_count,

                    "page": 1,

                    "page_size": "all",

                    "total_pages": 1,

                    "next": None,

                    "previous": None,

                },

            })

        # =================================================
        # NORMAL PAGINATION
        # =================================================

        return Response({

            "success": True,

            "data": data,

            "pagination": {

                "count":
                    self.page.paginator.count,

                "page":
                    self.page.number,

                "page_size":
                    self.get_page_size(
                        self.request
                    ),

                "total_pages":
                    self.page.paginator.num_pages,

                "next":
                    self.get_next_link(),

                "previous":
                    self.get_previous_link(),

            },

        })