const { IncomingWebhook } = require("@slack/webhook");
const { padID } = require("./util");
const functions = require("firebase-functions");

const baseUrl = functions.config().server.baseurl;
const dispatcherWebhookUrl = functions.config().slack.webhook.dispatcher;

const webhook = new IncomingWebhook(dispatcherWebhookUrl);  // TODO: separate webhook for Intake Manager in production

async function notifyDispatchers(intake) {
    const message = {
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "A New Intake Submitted",
                    emoji: true
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Intake ID:*\n${padID(intake.id)}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Sales Rep:*\n${intake.sales_rep}`
                    }
                ]
            },
            {
                type: "divider"
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Client Name:*\n${intake.client_name}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Origin DBA:*\n${intake.origin_dba}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Origin License Name:*\n${intake.origin_license_name}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Origin License #:*\n${intake.origin_license_num}`
                    }
                ]
            },
            {
                type: "divider"
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Notes:*\n${intake.dispatcher_notes || "N/A"}`
                    }
                ]
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "To Dispatcher UI",
                            emoji: true
                        },
                        url: `${baseUrl}/dispatch`,
                        style: "primary"
                    }
                ]
            }
        ]
    }

    return webhook.send(message);
}

async function notifyIntakeManagers(numOfIntakes, deliveryType) {
    const message = {
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "Incoming Intake(s)",
                    emoji: true
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Delivery Type:* ${deliveryType}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*No. of Intakes:* ${numOfIntakes}`
                    }
                ]
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "To Intake Manager UI",
                            emoji: true
                        },
                        url: `${baseUrl}/intake-manager`,
                        style: "primary"
                    }
                ]
            }
        ]
    }

    return webhook.send(message);
}

module.exports = {
    notifyDispatchers,
    notifyIntakeManagers
};
