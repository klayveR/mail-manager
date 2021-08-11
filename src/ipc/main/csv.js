import { ipcMain } from "electron";
import * as fs from "fs";
import { parseFile } from "fast-csv";

ipcMain.on("PARSE_CSV", (event, { transactionId, filePath, delimiter = "," }) => {
    const result = {
        transactionId,
        success: false,
        message: "",
        data: {
            headers: [],
            rows: [],
        },
    };

    if (!fs.existsSync(filePath)) {
        result.message = "Ausgewählte Datei existiert nicht";
        event.reply("PARSE_CSV", result);
        return;
    }

    parseFile(filePath, { headers: true, objectMode: true, delimiter })
        .on("data", (row) => {
            result.data.rows.push(row);
        })
        .on("end", (rowCount) => {
            if (rowCount > 0) {
                result.data.headers = Object.keys(result.data.rows[0]);
                result.success = true;
            } else {
                result.message = "Keine Zeilen in CSV";
            }

            event.reply("PARSE_CSV", result);
        })
        .on("error", (error) => {
            result.message = error.message;
            event.reply("PARSE_CSV", result);
        });
});
