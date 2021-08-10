import { Notify } from "quasar";

export default class ActionResult {
    constructor(success, notifyConfig, data = {}) {
        this.success = success;
        this.data = data;

        if (notifyConfig == null) {
            notifyConfig = { message: this.success.toString() };
        }

        this.notifyConfig = notifyConfig;
        this.notifyConfig.color = this.notifyConfig.type;

        switch (this.notifyConfig.type) {
            case "positive":
                this.notifyConfig.icon = "done";
                break;
            case "negative":
                this.notifyConfig.icon = "error";
                break;
            case "warning":
                this.notifyConfig.icon = "warning";
                this.notifyConfig.textColor = "grey-10";
                break;
            default:
                this.notifyConfig.icon = "info";
                break;
        }
    }

    showNotification() {
        Notify.create(this.notifyConfig);
    }

    static error(message, notifyConfig = {}, data = {}) {
        return new ActionResult(false, { ...notifyConfig, message, type: "negative" }, data);
    }

    static success(message, notifyConfig = {}, data = {}) {
        return new ActionResult(true, { ...notifyConfig, message, type: "positive" }, data);
    }

    static warning(message, notifyConfig = {}, data = {}) {
        return new ActionResult(false, { ...notifyConfig, message, type: "warning" }, data);
    }
}
