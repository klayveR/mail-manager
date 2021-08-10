import { Notify, exportFile } from "quasar";
import { writeToString } from "fast-csv";

export default {
    methods: {
        async exportToCSV(rows, headers, fileName = "export.csv") {
            try {
                const data = await writeToString(rows, { headers: headers, delimiter: "," });
                const exportStatus = exportFile(fileName, data, "text/csv");

                if (!exportStatus) {
                    Notify.create({
                        icon: "error",
                        type: "negative",
                        message: "Fehler beim Exportieren",
                        caption: "Dateidownloads werden nicht unterstützt.",
                    });
                }
            } catch (error) {
                Notify.create({
                    icon: "error",
                    type: "negative",
                    message: "Fehler beim Exportieren",
                    caption: "CSV konnte nicht generiert werden.",
                });
            }
        },
    },
};
