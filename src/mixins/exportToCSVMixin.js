import { Notify, exportFile } from "quasar";
import { writeToString } from "fast-csv";

export default {
    methods: {
        async exportToCSV(rows, headers, fileName = "export.csv") {
            const notification = Notify.create({
                group: false,
                spinner: true,
                message: "E-Mail Konten exportieren",
                caption: "CSV wird generiert...",
            });

            try {
                const data = await writeToString(rows, { headers: headers, delimiter: "," });
                const exportStatus = exportFile(fileName, data, "text/csv");

                if (exportStatus) {
                    notification();
                } else {
                    notification({
                        spinner: false,
                        icon: "error",
                        type: "negative",
                        message: "Fehler beim Exportieren",
                        caption: "Dateidownloads werden nicht unterstützt.",
                    });
                }
            } catch (error) {
                notification({
                    spinner: false,
                    icon: "error",
                    type: "negative",
                    message: "Fehler beim Exportieren",
                    caption: "CSV konnte nicht generiert werden.",
                });
            }
        },
    },
};
