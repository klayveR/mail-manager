import { Notify } from "quasar";
import { v4 as uuidv4 } from "uuid";

export default {
    data() {
        return {
            task: {
                transactionId: "",
                working: false,
                channel: undefined,
                notification: undefined,
                name: "",
                createReportOnFail: false,
                createReportOnSuccess: false,
                removeListeners: {
                    task: undefined,
                    status: undefined,
                },
            },
        };
    },

    methods: {
        startTask({ data, channel, name, title, createReportOnFail = false, createReportOnSuccess = false }) {
            if (this.task.working) {
                return false;
            }

            this.task.working = true;
            this.task.channel = channel;
            this.task.name = name;
            this.task.transactionId = uuidv4();
            this.task.createReportOnFail = createReportOnFail;
            this.task.createReportOnSuccess = createReportOnSuccess;

            window.ipc.send(channel, {
                transactionId: this.task.transactionId,
                ...data,
            });

            this.task.notification = Notify.create({
                group: false,
                message: title,
                caption: `Wird gestartet...`,
                timeout: 0,
                spinner: true,
            });

            this.task.removeListeners.task = window.ipc.on(channel, this.onTaskIpcResult);
            this.task.removeListeners.status = window.ipc.on(`${channel}_STATUS`, this.onTaskIpcStatus);

            return true;
        },

        async onTaskIpcResult(payload) {
            if (payload.transactionId !== this.task.transactionId) {
                return;
            }

            if (this.task.removeListeners.task) {
                this.task.removeListeners.task();
            }

            if (this.task.removeListeners.status) {
                this.task.removeListeners.status();
            }

            const reportId = await this.addReport(payload);
            this.task.working = false;

            if (this.task.notification == null) {
                return;
            }

            const errorCount = "errors" in payload.data ? payload.data.errors.length : 0;

            this.task.notification({
                caption: `${payload.message}${errorCount > 0 ? ` ${errorCount} Fehler aufgetreten.` : ""}`,
                timeout: 5000,
                spinner: false,
            });

            if (payload.success) {
                this.task.notification({ icon: "done", type: errorCount === 0 ? "positive" : "warning" });
            } else {
                this.task.notification({ icon: "error", type: "negative" });
            }

            if (reportId !== false) {
                this.task.notification({
                    actions: [
                        {
                            label: "Bericht ansehen",
                            color: errorCount > 0 && payload.success ? "dark" : "white",
                            handler: () => {
                                this.$router.push({ name: `report`, params: { id: reportId } });
                            },
                        },
                    ],
                });
            }

            this.task.notification = undefined;
        },

        onTaskIpcStatus(payload) {
            if (payload.transactionId !== this.task.transactionId) {
                return;
            }

            if (this.task.notification != null) {
                this.task.notification({
                    caption: payload.message,
                });
            }
        },

        async addReport(payload) {
            if ((payload.success && !this.task.createReportOnSuccess) || (!payload.success && !this.task.createReportOnFail)) {
                return false;
            }

            const result = await this.$store.dispatch("reports/add", {
                payload: { ...payload },
                channel: this.task.channel,
                name: this.task.name,
            });
            if (!result.success) {
                result.showNotification();
                return false;
            }

            return result.data.id;
        },
    },
};
