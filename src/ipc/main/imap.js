import { ipcMain } from "electron";
import { ImapFlow } from "imapflow";
import moment from "moment";

// Fix pino
const pino = require("pino")();
pino.level = "silent";

const createImapFlowOptions = (account, host) => {
    return {
        host: host.server,
        port: host.port,
        secure: host.secure,
        auth: {
            user: account.user,
            pass: account.password,
        },
        logger: pino,
        emitLogs: true,
    };
};

ipcMain.on("TEST_CONNECTION", async (event, { transactionId, account, host }) => {
    const result = {
        transactionId,
        success: false,
        message: "",
        data: {
            account,
            host,
            errors: [],
        },
    };

    const client = new ImapFlow(createImapFlowOptions(account, host));

    try {
        event.reply("TEST_CONNECTION_STATUS", { transactionId, message: "Verbindung wird hergestellt..." });
        await client.connect();

        result.success = true;
        result.message = "Verbindung konnte erfolgreich hergestellt werden.";
    } catch (error) {
        result.data.errors.push({ ...error, message: error.message });
        result.message = "Verbindung konnte nicht hergestellt werden.";
    } finally {
        event.reply("TEST_CONNECTION_STATUS", { transactionId, message: "Verbindung wird getrennt..." });
        await client.logout();
    }

    event.reply("TEST_CONNECTION", result);
});

ipcMain.on("DELETE_EMAILS", async (event, { transactionId, account, host, before }) => {
    const result = {
        transactionId,
        success: true,
        message: "E-Mails wurden gelöscht.",
        data: {
            account,
            host,
            mailboxes: [],
            errors: [],
        },
    };

    if (before == null || !moment(before).isValid()) {
        result.message = "Ungültiges Datum.";
        event.reply("DELETE_EMAILS", result);
        return;
    }

    before = moment(before).toDate();

    const client = new ImapFlow(createImapFlowOptions(account, host));

    // Connect to IMAP, return immediately if this fails
    try {
        event.reply("DELETE_EMAILS_STATUS", { transactionId, message: "Verbindung wird hergestellt..." });
        await client.connect();
    } catch (error) {
        await client.logout();

        result.data.errors.push({ ...error, message: error.message });
        result.success = false;
        result.message = "Verbindung konnte nicht hergestellt werden.";

        event.reply("DELETE_EMAILS", result);
        return;
    }

    // Delete E-Mails, log errors occuring when locking mailbox
    const mailboxes = await client.list();
    for (const mailbox of mailboxes) {
        const mb = {
            name: mailbox.name,
            path: mailbox.path,
            messages: 0,
            deleted: 0,
        };

        let lock;
        try {
            // Lock mailbox
            lock = await client.getMailboxLock(mailbox.path);

            // Get count of all messages in mailbox
            mb.messages = (await client.search({})).length;

            // Get count of messages that should be deleted, try to delete
            // and set count of deleted messages on mailbox if successful
            const deleteCount = (await client.search({ before: before })).length;
            if (deleteCount > 0) {
                event.reply("DELETE_EMAILS_STATUS", {
                    transactionId,
                    message: `E-Mails aus Postfach ${mb.name} werden gelöscht...`,
                });

                if (await client.messageDelete({ before: before })) {
                    mb.deleted = deleteCount;
                }
            }

            result.data.mailboxes.push(mb);
        } catch (error) {
            result.data.errors.push({ ...error, message: error.message });
        } finally {
            if (lock != null) {
                lock.release();
            }
        }
    }

    // Logout from IMAP
    try {
        event.reply("DELETE_EMAILS_STATUS", { transactionId, message: "Verbindung wird getrennt..." });
        await client.logout();
    } catch (error) {
        result.data.errors.push({ ...error, message: error.message });
    }

    event.reply("DELETE_EMAILS", result);
});

ipcMain.on("GET_INFORMATION", async (event, { transactionId, account, host }) => {
    const result = {
        transactionId,
        success: true,
        message: "Informationen wurden abgerufen.",
        data: {
            account,
            host,
            quota: false,
            mailboxes: [],
            errors: [],
        },
    };

    const client = new ImapFlow(createImapFlowOptions(account, host));

    // Connect to IMAP, return immediately if this fails
    try {
        event.reply("GET_INFORMATION_STATUS", { transactionId, message: "Verbindung wird hergestellt..." });
        await client.connect();
    } catch (error) {
        await client.logout();

        result.data.errors.push({ ...error, message: error.message });
        result.success = false;
        result.message = "Verbindung konnte nicht hergestellt werden.";

        event.reply("GET_INFORMATION", result);
        return;
    }

    // Read quota, store error
    try {
        event.reply("GET_INFORMATION_STATUS", { transactionId, message: "Quota wird abgerufen..." });
        result.data.quota = await client.getQuota();
    } catch (error) {
        result.data.errors.push({ ...error, message: error.message });
    }

    // Read status of each mailbox, store errors
    const mailboxes = await client.list();
    for (const mailbox of mailboxes) {
        event.reply("GET_INFORMATION_STATUS", { transactionId, message: `Postfach ${mailbox.name} wird abgerufen...` });
        const mb = {
            name: mailbox.name,
            path: mailbox.path,
            messages: 0,
            unseen: 0,
            recent: 0,
        };

        try {
            const status = await client.status(mailbox.path, { messages: true, unseen: true, recent: true });
            mb.messages = status.messages;
            mb.unseen = status.unseen;
            mb.recent = status.recent;

            result.data.mailboxes.push(mb);
        } catch (error) {
            result.data.errors.push({ ...error, message: error.message });
        }
    }

    // Logout from IMAP
    try {
        event.reply("GET_INFORMATION_STATUS", { transactionId, message: "Verbindung wird getrennt..." });
        await client.logout();
    } catch (error) {
        result.data.errors.push({ ...error, message: error.message });
    }

    event.reply("GET_INFORMATION", result);
});
