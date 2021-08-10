import moment from "moment";

export default {
    methods: {
        getDateString(date) {
            return moment(date).format("DD.MM.YYYY");
        },
        getTimeString(date) {
            return moment(date).format("HH:mm");
        },
    },
};
