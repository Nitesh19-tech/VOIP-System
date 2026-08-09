import API from "./api";

const numberPoolService = {

    // =====================================================
    // GET NUMBERS
    // =====================================================

    getNumbers(params = {}) {

        return API.get(
            "numbers/",
            {
                params,
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
    // DELETE NUMBER
    // =====================================================

    deleteNumber(id) {

        return API.delete(
            `numbers/${id}/`
        );
    },

    // =====================================================
    // IMPORT NUMBERS
    // =====================================================

    importNumbers(file) {

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

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
                number_ids: numberIds,
            }
        );
    },

};

export default numberPoolService;