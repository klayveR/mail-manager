<template>
    <q-btn
        dense
        round
        flat
        icon="unsubscribe"
        color="primary"
        @click="showDialog"
        :loading="task.working"
        :disabled="task.working"
    >
        <q-tooltip ref="tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]"> E-Mails löschen </q-tooltip>
    </q-btn>

    <q-dialog v-model="dialogVisible" persistent transition-show="jump-down" transition-hide="jump-down">
        <q-card>
            <q-card-section class="row items-center q-pb-none">
                <div>
                    <span class="text-h6">E-Mails löschen</span>
                    <span class="text-subtitle3"><br />{{ account.user }}</span>
                </div>
                <q-space />
                <q-btn icon="close" flat round dense @click="closeDialog()" />
            </q-card-section>

            <q-form ref="form" @submit="submit">
                <q-card-section class="q-gutter-sm">
                    <q-option-group :options="deleteOptions" type="radio" v-model="form.mode" />

                    <q-input
                        label="Datum"
                        class="q-ml-lg q-mr-lg"
                        v-if="form.mode === 'date'"
                        v-model="form.date"
                        :rules="[(val) => isDateValid(val) || 'Bitte gültiges Datum eingeben.']"
                        :hint="`Alle E-Mails, die älter als ${dateDiff} Tage sind, werden gelöscht.`"
                        :readonly="true"
                    >
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                    <q-date
                                        flat
                                        :locale="dateLocale"
                                        v-model="form.date"
                                        :options="dateOptions"
                                        mask="DD.MM.YYYY"
                                    >
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Schließen" color="primary" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Löschen" type="submit" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { Dialog } from "quasar";
import moment from "moment";

import taskMixin from "@/mixins/taskMixin";

const deleteOptions = [
    { label: "Alle E-Mails löschen", value: "all" },
    { label: "E-Mails vor Datum löschen", value: "date" },
];

const dateLocale = {
    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    daysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    months: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
    ],
    monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
};

export default defineComponent({
    name: "Get Information Button",

    mixins: [taskMixin],

    props: {
        account: Object,
        host: Object,
    },

    computed: {
        date() {
            return moment(this.form.date, "DD.MM.YYYY", true);
        },

        dateDiff() {
            return moment().diff(this.date, "days");
        },
    },

    methods: {
        showDialog() {
            this.dialogVisible = true;
        },

        closeDialog() {
            this.dialogVisible = false;

            this.form = {
                date: moment().subtract(14, "days").format("DD.MM.YYYY"),
                mode: "date",
            };
        },

        dateOptions(date) {
            return date <= moment().format("YYYY/MM/DD");
        },

        isDateValid(date) {
            return moment(date, "DD.MM.YYYY", true).isValid();
        },

        submit() {
            if (!this.date.isValid()) {
                return;
            }

            let confirmMessage = "Wenn Sie fortfahren, werden alle E-Mails gelöscht.";
            if (this.form.mode === "date") {
                confirmMessage = `Wenn Sie fortfahren, werden alle E-Mails gelöscht, die älter als ${this.dateDiff} Tage sind.`;
            }

            Dialog.create({
                title: "Achtung",
                message: `${confirmMessage} 
                        Diese Aktion kann nicht angehalten oder rückgängig gemacht werden. 
                        Bitte stellen Sie sicher, dass eine Sicherung existiert.`,
                ok: {
                    label: "Endgültig löschen",
                    color: "negative",
                    flat: true,
                    icon: "warning",
                },
                cancel: "Abbrechen",
                persistent: true,
            }).onOk(() => {
                this.start();
            });
        },

        start() {
            let before = moment().toISOString();
            if (this.form.mode === "date") {
                before = this.date.toISOString();
            }

            this.startTask({
                data: {
                    account: { ...this.account },
                    host: { ...this.host },
                    before: before,
                },
                channel: "DELETE_EMAILS",
                title: `E-Mails aus ${this.account.user} löschen`,
                name: `E-Mails löschen`,
                createReportOnSuccess: true,
                createReportOnFail: true,
            });

            this.closeDialog();
        },
    },

    data() {
        return {
            dialogVisible: false,
            form: {
                date: moment().subtract(14, "days").format("DD.MM.YYYY"),
                mode: "date",
            },
            deleteOptions: deleteOptions,
            dateLocale: dateLocale,
        };
    },
});
</script>

<style scoped>
form {
    min-width: 500px;
}
</style>
