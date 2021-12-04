<template>
    <v-form ref="form">
        <v-row>
            <v-col cols="12">
                Client Details
            </v-col>

            <v-col cols="3">
                <v-text-field
                    label="Client Email Address"
                    v-model="clientDetails.email"
                    :rules="fieldRules.emailRequired"
                    outlined
                    clearable
                    type="email"
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-select
                    :items="getAllUsers"
                    :rules="fieldRules.general"
                    v-model="clientDetails.sales_rep_id"
                    label="Sales Representative"
                    :item-text="item => item.first_name + ' ' + item.last_name"
                    item-value="id"
                    persistent-hint
                    outlined
                    clearable
                ></v-select>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    label="Doing Business As(DBA)"
                    :rules="fieldRules.general"
                    v-model="clientDetails.doing_business_as"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.licensed_business_name"
                    :rules="fieldRules.general"
                    label="License Business Name"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>

            <v-col cols="3">
                <DatepickerDialog
                    :value.sync="clientDetails.license_expiration"
                    label="License Expiration Date"
                    :rules="fieldRules.general"
                />
            </v-col>
            <v-col cols="3">
                <v-select
                    v-model="licenseTypes"
                    :rules="fieldRules.select"
                    :items="licenseType"
                    label="License Type(s)"
                    outlined
                    clearable
                    multiple
                ></v-select>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.license_address"
                    :rules="fieldRules.general"
                    label="License Address"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.license_address_city"
                    :rules="fieldRules.general"
                    label="License Address City"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.license_address_state"
                    :rules="fieldRules.general"
                    label="License Address State"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.license_address_zip"
                    :rules="fieldRules.general"
                    label="License Address Zip"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.cdtfa_seller_permit_num"
                    :rules="fieldRules.general"
                    label="CDTFA Seller Permit #"
                    outlined
                ></v-text-field>
            </v-col>

            <!-- Checks if CDTFA Permit File Exists -->
            <v-col v-if="isCDTFAFileExisting" align="center" cols="3">
                <v-text-field
                    v-model="clientDetails.cdtfa_seller_permit_file"
                    label="CDTFA Seller Permit File"
                    readonly
                    outlined
                    clearable
                ></v-text-field>
                <a
                    :href="clientDetails.cdtfa_seller_permit_file"
                    target="_blank"
                    >Click here to view File</a
                >
            </v-col>

            <v-col v-else cols="3">
                <v-file-input
                    v-model="clientDetails.cdtfa_seller_permit_file"
                    :rules="fieldRules.general"
                    accept="image/png, image/jpeg, image/bmp, .pdf, .doc, .docx"
                    prepend-icon="mdi-file-document-multiple-outline"
                    label="CDTFA Seller Permit File"
                    outlined
                ></v-file-input>
            </v-col>

            <!-- Checks if W9 document Exists -->
            <v-col v-if="isW9Existing" align="center" cols="3">
                <v-text-field
                    v-model="clientDetails.completed_w9"
                    label="Complete W9 Document"
                    readonly
                    outlined
                    clearable
                ></v-text-field>
                <a :href="clientDetails.completed_w9" target="_blank"
                    >Click to View File</a
                >
            </v-col>

            <v-col v-else cols="3">
                <v-file-input
                    v-model="clientDetails.completed_w9"
                    :rules="fieldRules.general"
                    label="Complete W9 Document"
                    accept="image/png, image/jpeg, image/bmp, .pdf, .doc, .docx"
                    prepend-icon="mdi-file-document-multiple-outline"
                    outlined
                ></v-file-input>
                <v-card-text
                    >*For transactions over $600, Please fill out this form, and
                    upload it above:
                    <a
                        href="https://www.irs.gov/pub/irs-pdf/fw9.pdf"
                        target="_blank"
                        >Form</a
                    ></v-card-text
                >
            </v-col>
        </v-row>
        <v-divider class="my-6"></v-divider>
        <v-row>
            <v-col cols="12">
                License File Upload (Upload up to 3 entries)
            </v-col>
            <v-col cols="12">
                <!-- Dynamically show number of Licenses Field -->
                <v-row
                    align="center"
                    cols="3"
                    v-for="(license, index) in licenseList"
                    :key="`license-container-${index}`"
                >
                    <v-col cols="3">
                        <v-text-field
                            v-model="license[Object.keys(license)[0]]"
                            :rules="getLicenseRule(index)"
                            :label="`License #${index + 1} Number`"
                            outlined
                        ></v-text-field>
                    </v-col>

                    <v-col cols="3">
                        <!-- Checks if License File Exists, then render this  -->
                        <div
                            v-if="
                                checkLicenseFileExist(
                                    license[Object.keys(license)[1]]
                                )
                            "
                        >
                            <v-text-field
                                v-model="license[Object.keys(license)[1]]"
                                :label="`License #${index + 1} File `"
                                readonly
                                outlined
                                clearable
                            ></v-text-field>
                            <a
                                :href="license[Object.keys(license)[1]]"
                                target="_blank"
                                >Click to View File</a
                            >
                        </div>

                        <v-file-input
                            v-else
                            v-model="license[Object.keys(license)[1]]"
                            :rules="getLicenseRule(index)"
                            accept="image/png, image/jpeg, image/bmp, .pdf, .doc, .docx"
                            prepend-icon="mdi-file-document-multiple-outline"
                            :label="`License #${index + 1} File Upload`"
                            outlined
                        ></v-file-input>
                    </v-col>

                    <!-- Action buttons for Adding/Delete License -->
                    <v-col cols="3" class="pa-0">
                        <!-- Button for rendering new License Field -->

                        <v-btn
                            class="mr-4"
                            v-if="
                                isLicenseLengthValid &&
                                    getLicenseLength === index + 1
                            "
                            @click="generateLicenseItem"
                        >
                            <v-icon dark>
                                mdi-plus
                            </v-icon>
                        </v-btn>

                        <v-btn
                            v-if="getLicenseLength !== 1"
                            @click="removeLicenseEntry(index)"
                        >
                            <v-icon dark>
                                mdi-minus
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>

            <v-divider class="my-6"></v-divider>
        </v-row>
        <!-- 3 License Number / File Upload -->

        <v-row>
            <v-col cols="12">
                <v-divider class="my-6"></v-divider>

                Main Contact Details
            </v-col>

            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.main_contact_name"
                    :rules="fieldRules.general"
                    label="Main Contact Name"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.main_contact_title"
                    :rules="fieldRules.general"
                    label="Main Contact Title"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.main_contact_phone"
                    :rules="fieldRules.general"
                    label="Main Contact Phone Number"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.delivery_pickup_contact_name"
                    label="Delivery/Pickup Point of Contact - Name"
                    hint="Provide NAME If applicable"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.delivery_pickup_contact_phone"
                    label="Delivery/Pickup Point of Contact - Phone # "
                    hint="Provide PHONE If applicable"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.delivery_pickup_contact_email"
                    :rules="fieldRules.email"
                    label="Delivery/Pickup Point of Contact - Email"
                    hint="Provide EMAIL If applicable"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.delivery_pickup_constraints"
                    label="Delivery/Pickup Window or Constraints "
                    hint="i.e only Tues & Fri from 10am-4pm by appointment only"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>

        <!-- Metric / Accouting Detail -->
        <v-row>
            <v-col cols="12">
                <v-divider class="my-6"></v-divider>

                METRC / Accounting Detail
            </v-col>

            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.metrc_contact_phone"
                    label="METRC Contact Phone Number"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.metrc_contact_email"
                    :rules="fieldRules.email"
                    label="METRC Contact Email Address"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.accounting_full_name"
                    label="Accounting - Full Name (if applicable)"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.accounting_email"
                    :rules="fieldRules.email"
                    label="Accounting - Email (if applicable)"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.accounting_phone"
                    label="Accounting - Phone # (if applicable)"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="clientDetails.accounting_instructions"
                    label="Accounting - Instructions "
                    hint="i.e schedule cash pickup via link, email 48hrs before arrival, etc"
                    outlined
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <!-- Products client are interested in-->
        <v-card-text>
            <h2 class="title mb-2">
                Which product(s) are you interested in?
            </h2>

            <v-chip-group
                v-model="productSelected"
                :rules="fieldRules.general"
                column
                multiple
            >
                <v-chip
                    v-for="product in productList"
                    :key="`product-${product}`"
                    filter
                    outlined
                >
                    {{ product }}
                </v-chip>
            </v-chip-group>

            <v-combobox
                v-if="isOtherProductSelected || isOtherProductNotEmpty"
                v-model="otherProducts"
                label="If others, please specify the product here"
                multiple
                chips
                clearable
                :search-input.sync="searchProduct"
                hint="Add as many products as you want"
            >
                <template
                    v-slot:selection="{
                        attrs,
                        item,
                        parent,
                        selected
                    }"
                >
                    <v-chip
                        :key="JSON.stringify(item)"
                        v-bind="attrs"
                        :input-value="selected"
                        @click="parent.selectItem(item)"
                    >
                        <v-avatar
                            class="accent white--text"
                            left
                            v-text="item.slice(0, 1).toUpperCase()"
                        ></v-avatar>
                        {{ item }}
                    </v-chip>
                </template>
                <template v-slot:no-data>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>
                                Press <kbd>enter</kbd> to add "<strong>{{
                                    searchProduct
                                }}</strong
                                >" to your product list
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-combobox>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                v-if="!isPagePublic"
                color="blue darken-1"
                dark
                large
                outlined
                @click="closeFunction"
                >Close</v-btn
            >

            <v-btn
                v-if="isPagePublic"
                class="my-4"
                dark
                large
                block
                color="blue darken-1"
                @click="handleSubmit"
                >Save Onboarding</v-btn
            >
            <base-loading-button
                v-else
                :click-function="handleSubmit"
                btnText="Save"
            ></base-loading-button>
        </v-card-actions>
    </v-form>
</template>

<script>
import DatepickerDialog from "@/components/DatepickerDialog";
import clientApi from "@/api/client";
import pick from "lodash/pick";

export default {
    components: {
        DatepickerDialog
    },
    props: {
        client: {
            default: () => {
                return {};
            },
            type: Object
        },
        closeFunction: {
            default: () => {
                return {};
            },
            type: Object
        }
    },

    data() {
        return {
            searchProduct: null,
            clientDetails: {},
            licenseType: [],
            licenseTypes: [],
            productList: [],
            productSelected: [],
            otherProducts: [],
            isOtherProductSelected: false,
            clientImage: null,
            licenseList: [],
            fieldRules: {
                general: [v => !!v || "This field is required"],
                emailRequired: [
                    v => !!v || "This field is required",
                    v =>
                        !v ||
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                        "E-mail must be valid"
                ],
                email: [
                    v =>
                        !v ||
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                        "E-mail must be valid"
                ],
                select: [
                    v => !!v || "This field is required",
                    v => (!!v && v.length !== 0) || "This field is required"
                ]
            },
            isTesting: false,
            clientBase: {
                email: "",
                sales_rep_id: "",
                licensed_business_name: "",
                doing_business_as: "",
                completed_w9: null,
                license_num: "",
                license_file_1: null,
                license_num_2: "",
                license_file_2: null,
                license_num_3: null,
                license_file_3: "",
                cdtfa_seller_permit_file: null,
                cdtfa_seller_permit_num: "",
                license_types: "",
                license_expiration: "",
                license_address: "",
                license_address_city: "",
                license_address_state: "",
                license_address_zip: "",
                main_contact_name: "",
                main_contact_title: "",
                main_contact_phone: "",
                delivery_pickup_contact_name: "",
                delivery_pickup_contact_phone: "",
                delivery_pickup_contact_email: "",
                delivery_pickup_constraints: "",
                metrc_contact_phone: "",
                metrc_contact_email: "",
                accounting_full_name: "",
                accounting_phone: "",
                accounting_email: "",
                accounting_instructions: "",
                products_interested: null
            }
        };
    },

    computed: {
        isPagePublic() {
            return this.$route.path.includes("/public");
        },
        getLicenseLength() {
            return this.licenseList.length;
        },
        isLicenseLengthValid() {
            return this.getLicenseLength <= 2;
        },

        isExistingClient() {
            return this.client && this.client.id;
        },
        isW9Existing() {
            return (
                typeof this.clientDetails.completed_w9 === "string" &&
                this.isExistingClient
            );
        },
        isCDTFAFileExisting() {
            return (
                typeof this.clientDetails.cdtfa_seller_permit_file ===
                    "string" && this.isExistingClient
            );
        },
        isOtherProductNotEmpty() {
            return this.otherProducts.length !== 0;
        },
        getAllUsers() {
            return this.$store.state.values.salesReps;
        }
    },

    watch: {
        productSelected() {
            // if product selected inclues "Others" index
            if (this.productSelected.includes(7)) {
                this.isOtherProductSelected = true;
            } else {
                // Clear the Other Products if unchecked
                this.isOtherProductSelected = false;
                this.otherProducts = [];
            }
        }
    },

    created() {
        this.clientDetails = Object.assign(
            {},
            this.isExistingClient ? this.client : this.clientBase
        );
    },

    async mounted() {
        await this.$store.dispatch("loadValuesOfType", "sales_rep");
        this.populateLicenseType();
        this.generateProductList();
        this.getLicenseItemList();
        this.getLicenstTypes();
        this.getProductInterested();

        // Global Submit buttont
        this.$root.$on("handleClientSubmit", () => {
            this.handleSubmit();
        });
    },

    methods: {
        getLicenseRule(index) {
            return index === 0 ? this.fieldRules.general : [];
        },
        checkLicenseFileExist(license) {
            return typeof license === "string";
        },
        getLicenseItemList() {
            const license1 = pick(this.clientDetails, [
                "license_num",
                "license_file_1"
            ]);

            const license2 = pick(this.clientDetails, [
                "license_num_2",
                "license_file_2"
            ]);

            const license3 = pick(this.clientDetails, [
                "license_num_3",
                "license_file_3"
            ]);

            this.licenseList = [license1, license2, license3].filter(
                license => {
                    return license[Object.keys(license)[1]];
                }
            );

            if (this.licenseList.length === 0) {
                this.generateLicenseItem();
            }
        },

        getLicenstTypes() {
            if (this.clientDetails.license_types) {
                this.licenseTypes = this.clientDetails.license_types.split(",");
            } else {
                this.licenseTypes = [];
            }
        },
        getProductInterested() {
            const productInterested = this.clientDetails.products_interested;
            if (productInterested) {
                //   Split string, and trim white spaces
                const productList = productInterested
                    .split(",")
                    .map(item => item.trim());

                // Get Products that are listed
                this.productSelected = productList
                    .filter(item => this.productList.includes(item))
                    .map(item => this.productList.indexOf(item));

                // Get Other products that are not listed
                this.otherProducts = productList.filter(
                    item => !this.productList.includes(item)
                );

                if (this.isOtherProductNotEmpty) {
                    this.productSelected.push(
                        this.productList.indexOf("Others")
                    );
                }
            }
        },

        generateLicenseItem() {
            if (this.isLicenseLengthValid) {
                const getKeyName1 = `license_num${
                    this.getLicenseLength >= 1
                        ? `_${this.getLicenseLength + 1}`
                        : ""
                }`;
                const getKeyName2 = `license_file_${this.getLicenseLength + 1}`;
                this.licenseList.push({
                    [getKeyName1]: "",
                    [getKeyName2]: null
                });
            }
        },

        removeLicenseEntry(index) {
            this.licenseList.splice(index, 1);
            this.licenseList = this.licenseList.map((license, index) => {
                const getKeyName1 = `license_num${
                    index >= 1 ? `_${index + 1}` : ""
                }`;
                const getKeyName2 = `license_file_${index + 1}`;
                return {
                    [getKeyName1]: license[Object.keys(license)[0]],
                    [getKeyName2]: license[Object.keys(license)[1]]
                };
            });
        },

        populateLicenseType() {
            this.licenseType = [
                "Manufacturing",
                "Cultivator",
                "Distributor",
                "Retailer"
            ];
        },

        generateProductList() {
            this.productList = [
                "Concentrates",
                "Disitillate",
                "Cartridges",
                "Packaging Services",
                "Toll Processing",
                "Split Toll Processing",
                "Solventless Processing",
                "Others"
            ];
        },

        handleSubmit: function() {
            const isValid = this.$refs.form.validate();

            if (isValid) {
                this.appendFields();
                const formData = this.isExistingClient
                    ? this.removeUnchangedFields()
                    : this.clientDetails;

                if (this.isExistingClient) {
                    this.updateClient(formData);
                } else {
                    this.postCreateClient(formData);
                }
            }
        },

        appendFields() {
            this.clientDetails.license_types = this.licenseTypes.join();
            this.clientDetails.products_interested = this.productSelected
                .map(item => {
                    return this.productList[item];
                })
                .filter(item => item !== "Others")
                .concat(this.otherProducts)
                .join();

            this.licenseList.forEach(license => {
                Object.entries(license).forEach(item => {
                    this.clientDetails[item[0]] = item[1];
                });
            });
        },

        async postCreateClient(payload) {
            let response = null;
            try {
                response = await clientApi.saveClient(payload);

                console.log(response);
            } catch (error) {
                console.log(error);
            } finally {
                this.postAction();
                console.log("Client successfully created.");
            }

            return response;
        },

        async updateClient(payload) {
            const { id } = this.clientDetails;
            let response = null;
            try {
                response = await clientApi.updateClient(id, payload);
                console.log(response);
            } catch (error) {
                console.log(error);
            } finally {
                this.postAction();
                console.log("Client details updated.");
            }

            return response;
        },

        postAction() {
            if (this.isPagePublic) {
                this.$root.$emit("openDialog", {
                    title: "Client Info",
                    message: "Your Client data has been updated! ",
                    type: "info",
                    submitFunction: () => {
                        location.reload();
                    }
                });
            } else {
                this.$root.$emit("postRequest");
                const message = this.isExistingClient
                    ? "Client Information has been updated."
                    : "Client has been successfully created.";
                this.$root.$emit("showSnackbar", {
                    show: true,
                    message
                });
            }
        },

        removeUnchangedFields() {
            return Object.fromEntries(
                Object.entries(this.clientDetails).filter(([key, value]) => {
                    return value != this.client[key];
                })
            );
        }
    }
};
</script>

<style></style>
