import API from "./api";


const numberPoolService = {

    // =====================================================
    // GET NUMBERS
    // =====================================================

    getNumbers(params = {}) {

        const pageSize =
            params?.page_size;

        const isAll =
            String(pageSize).toLowerCase() === "all";

        const isLarge =
            pageSize === 500 ||
            pageSize === "500";

        return API.get(
            "numbers/",
            {
                params,

                timeout:
                    isAll
                        ? 120000
                        : isLarge
                            ? 60000
                            : undefined,
            }
        );
    },


    // =====================================================
    // GET SINGLE NUMBER
    // =====================================================

    getNumber(id) {

        return API.get(
            `numbers/${id}/`
        );
    },


    // =====================================================
    // CREATE NUMBER
    // =====================================================

    createNumber(data) {

        return API.post(
            "numbers/",
            data
        );
    },


    // =====================================================
    // UPDATE NUMBER
    // =====================================================

    updateNumber(id, data) {

        return API.put(
            `numbers/${id}/`,
            data
        );
    },


    // =====================================================
    // DELETE SINGLE NUMBER
    // =====================================================

    deleteNumber(id) {

        return API.delete(
            `numbers/${id}/`
        );
    },


    // =====================================================
    // BULK DELETE NUMBERS
    // =====================================================

    bulkDelete(numberIds) {

        return API.post(
            "numbers/bulk-delete/",
            {
                number_ids:
                    numberIds,
            },
            {
                timeout: 120000,
            }
        );
    },


    // =====================================================
    // IMPORT NUMBERS
    // =====================================================

    importNumbers(data) {

        const formData =
            new FormData();


        // FILE
        if (data?.file) {

            formData.append(
                "file",
                data.file
            );

        }


        // CARRIER
        if (
            data?.carrier !== undefined &&
            data?.carrier !== null &&
            data?.carrier !== ""
        ) {

            formData.append(
                "carrier",
                data.carrier
            );

        }


        // TERMINATION
        if (
            data?.termination !== undefined &&
            data?.termination !== null &&
            data?.termination !== ""
        ) {

            formData.append(
                "termination",
                data.termination
            );

        }


        // CLIENT
        if (
            data?.client !== undefined &&
            data?.client !== null &&
            data?.client !== ""
        ) {

            formData.append(
                "client",
                data.client
            );

        }


        // NUMBER SERVICE
        if (
            data?.number_service !== undefined &&
            data?.number_service !== null &&
            data?.number_service !== ""
        ) {

            formData.append(
                "number_service",
                data.number_service
            );

        }


        // SERVICE VARIABLES
        if (
            data?.service_variables !== undefined &&
            data?.service_variables !== null &&
            data?.service_variables !== ""
        ) {

            formData.append(
                "service_variables",
                data.service_variables
            );

        }


        // TEST NUMBER
        formData.append(
            "set_test_number",
            data?.set_test_number
                ? "true"
                : "false"
        );


        // DAILY MAX CALL
        formData.append(
            "daily_max_call",
            String(
                data?.daily_max_call ?? 0
            )
        );


        // DAILY MAX DURATION
        formData.append(
            "daily_max_duration",
            String(
                data?.daily_max_duration ?? 0
            )
        );


        // DEBUG
        console.log(
            "Number Import FormData:"
        );


        for (
            const [key, value]
            of formData.entries()
        ) {

            console.log(
                key,
                value
            );

        }


        // API REQUEST
        return API.post(
            "numbers/import/",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

    },


    // =====================================================
    // STATISTICS
    // =====================================================

    getStatistics() {

        return API.get(
            "numbers/statistics/"
        );
    },


    // =====================================================
    // BULK ALLOCATION
    // =====================================================

    bulkAllocate(data) {

        return API.post(
            "numbers/bulk-allocation/",
            data
        );
    },


    // =====================================================
    // BULK UNALLOCATION
    // =====================================================

    bulkUnallocate(numberIds) {

        return API.post(
            "numbers/bulk-unallocation/",
            {
                number_ids:
                    numberIds,
            }
        );
    },


    // =====================================================
    // AUTO ASSIGN NUMBERS
    // =====================================================

    autoAssign(data) {

        return API.post(
            "numbers/auto-assign/",
            data
        );
    },

};


export default numberPoolService;