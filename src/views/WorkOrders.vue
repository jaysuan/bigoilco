<template>
    <v-container class="workOrders">
        <v-card>
            <v-card-title class="card-header">Work Orders</v-card-title>
            <v-data-table
                v-model="selectedWorkOrders"
                :items="displayedWorkOrders"
                :headers="tableHeaders"
                :loading="loadingWorkOrders"
                :custom-filter="filterByItemId"
                :search="search"
                show-select
                loading-text="Loading Work Orders"
                sort-by="date_created"
                sort-desc
                calculate-widths>
                <template v-slot:top>
                    <v-container fluid class="pa-2">
                        <v-row align="center" no-gutters>
                            <v-col cols="auto" class="mr-4">
                                <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Enter Item ID"
                                    clearable
                                    class="item-input" />
                            </v-col>
                            <v-col cols="auto">
                                <v-btn
                                    v-if="selectedWorkOrders.length > 0 && selectedWorkOrders.length < 4"
                                    @click.stop="bulkGenerateWorkOrders"
                                    :disabled="isGenerating"
                                    color="green"
                                    small
                                    class="white--text">
                                    Generate
                                </v-btn>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto" class="text-right">
                                <v-select
                                    v-model="selectedStatus"
                                    :items="statuses"
                                    append-icon="mdi-filter-variant"
                                    chips
                                    multiple
                                    clearable>
                                </v-select>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                    </v-container>
                </template>

                <template v-slot:item.id="{ item }">
                    <span>{{ padID(item.id) }}</span>
                </template>
                <template v-slot:item.item_id="{ item }">
                    <span>{{ padID(item.item_id) }}</span>
                </template>
                <template v-slot:item.item_type="{ item }">
                    <span :class="item.item_type === 'SKU' ? 'primary--text' : 'secondary--text'">{{ item.item_type }}</span>
                </template>
                <template v-slot:item.template_id="{ item }">
                    <a  v-if="item.status === 'Done'"
                        :href="`https://docs.google.com/spreadsheets/d/${item.template_id}`"
                        target="blank">
                        Go to work order
                    </a>
                </template>
                <template v-slot:item.status="{ item }">
                    <span :class="statusClass(item.status)">{{ item.status }}</span>
                </template>
                <template v-slot:item.date_created="{ item }">
                    <span>{{ formatDate(item.date_created) }}</span>
                </template>
                <template v-slot:item.generate="{ item }">
                    <v-progress-circular
                        v-if="workOrderSubmitStatus[item.id]"
                        indeterminate
                        color="secondary"
                        width="1" />
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
import { format, parseISO } from "date-fns";
import workOrderApi from "@/api/work-order";
import { padID } from "@/util";


export default {
    name: "WorkOrders",

    data() {
        return {
            workOrders: [],
            workOrderSubmitStatus: {},
            selectedWorkOrders: [],
            tableHeaders: [
                { text: "ID", value: "id", align: "center", sortable: false },
                { text: "Item ID", value: "item_id", align: "center", sortable: false },
                { text: "Item Type", value: "item_type", align: "center"},
                { text: "Document", value: "template_id", align: "center", sortable: false },
                { text: "Status", value: "status", align: "center", filter: value => this.selectedStatus.includes(value) },
                { text: "Date", value: "date_created", align: "center", sortable: false },
                { text: "", value: "generate", align: "center", sortable: false }
            ],
            loadingWorkOrders: false,
            isGenerating: false,
            search: "",
            statuses: ["Pending", "Failed", "Done"],
            selectedStatus: ["Pending", "Failed"]
        }
    },

    computed: {
        displayedWorkOrders() {
            return this.workOrders.map(workOrder => {
                workOrder.isSelectable = workOrder.status !== "Done";
                return workOrder;
            });
        }
    },
    
    watch: {
        workOrders() {
            this.workOrderSubmitStatus = this.workOrders.reduce((grouping, workOrder) => {
                grouping[workOrder.id] = false;
                return grouping;
            }, {});
        }
    },

    methods: {
        async bulkGenerateWorkOrders() {
            try {
                this.isGenerating = true;
                this.selectedWorkOrders.forEach(({ id }) => this.workOrderSubmitStatus[id] = true);
                const indexMapping = this.selectedWorkOrders.map(workOrder => ({
                    id: workOrder.id,
                    index: this.workOrders.indexOf(workOrder)
                }));
                const results = await Promise.allSettled(this.selectedWorkOrders.map(workOrder => workOrderApi.generateWorkOrder(workOrder.id)));
                results.forEach(result => {
                    const { status } = result;
                    if (status === "fulfilled") {
                        const { id, template_id, status } = result.value.data;
                        console.info(`Work Order ID processed: ${id}`);
                        const { index } = indexMapping.find(idx => idx.id === Number(id));
                        const { item_id, item_type, date_created } = this.workOrders.find(workOrder => workOrder.id === Number(id));
                        this.$set(this.workOrders, index, {
                            id,
                            item_id,
                            item_type,
                            template_id,
                            date_created,
                            status
                        });
                    } else {
                        const { id } = result.reason.response.data;
                        const { index } = indexMapping.find(idx => idx.id === Number(id));
                        const { item_id, item_type, date_created } = this.workOrders.find(workOrder => workOrder.id === Number(id));
                        this.$set(this.workOrders, index, {
                            id,
                            item_id,
                            item_type,
                            template_id: null,
                            date_created,
                            status: "Failed"
                        });
                    }
                });
            } catch (error) {
                console.error("Error in bulk generating work orders: ", error);
            } finally {
                this.isGenerating = false;
                this.selectedWorkOrders.forEach(({ id }) => this.workOrderSubmitStatus[id] = false);
                this.selectedWorkOrders = [];
            }
        },
        statusClass(status) {
            let statusClass = "font-weight-medium ";
            switch (status) {
                case "Done":
                    statusClass += "success--text";
                    break;
                case "Pending":
                    statusClass += "warning--text";
                    break;
                case "Failed":
                    statusClass += "error--text";
                    break;
            }
            return statusClass;
        },
        filterByItemId(value, search, workOrder) {
            return value != null &&
                search != null &&
                workOrder.item_id === Number(search);
        },
        padID,
        formatDate(date) {
            const parsed = parseISO(date, "yyyy-MM-dd", new Date());
            return format(parsed, "MM/dd/yyyy");
        }
    },

    async mounted() {
        try {
            this.loadingWorkOrders = true;
            const response = await workOrderApi.getWorkOrders();
            this.workOrders = response.data;
        } catch (error) {
            console.error("Error in loading work orders: ", error);
        } finally {
            this.loadingWorkOrders = false;
        }
    }
}
</script>

<style scoped>
.card-header {
    color: white;
    background-color: #C93941;
}
</style>
