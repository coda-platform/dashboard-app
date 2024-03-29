<template>
  <v-container v-bind:class="[{ slim: minimize }, 'mainContainer']">

    <div v-if="modal" class="modalOverlay">
      <div class="modalBody">
      <span>Select resource type: </span>
      <select
        class="form-control"
        v-model="newResource"
        style="background-color: white; margin-top: 8px;"
      >
        <option 
          v-for="(option, index) in resourceTabOptions"
          :key="index"
          :value="option.text"
        >
          {{ option.text }}
        </option>
      </select>
        <BButton class="mt-3" id="newTab" block @click="newTab"
          >Add</BButton
        >
        <BButton class="mt-3" id="closeModal" block @click="toggleModal" 
        style="background-color: gray; margin-right: 16px;"
          >Close</BButton
        >
      </div>
    </div>

    <BForm
      v-bind:class="{ inline: minimize }"
      @submit.prevent="onSubmit"
      @reset="onReset"
    >
      <div class="selectData">
        <v-card class="selectContainer" style="z-index: 9">
          <div class="panelTitle">
            <span>{{ $t("selectHospitalTxt") }}</span>
          </div>
          <div class="selectionPanel">
            <multiselect
              v-model="form.sites"
              :placeholder="$t('selectHospitalTxt')"
              :options="connectionOptions"
              group-label="group"
              group-values="sites"
              :group-select="true"
              label="text"
              :multiple="true"
              track-by="value"
              :clear-on-select="false"
              :close-on-select="false"
              :showLabels="false"
            >
              <template v-slot:clear="sites">
                <div
                  class="multiselect__clear"
                  v-if="form.sites.length"
                  @mousedown.prevent.stop="clearAllSites(sites.search)"
                ></div>
              </template>
              <template v-slot:noResult>No site found.</template>
            </multiselect>
          </div>
        </v-card>

        <v-card id="selectContinuousContainer" class="selectContainer" style="z-index: 8">
          <div class="panelTitle">
            <span>{{ $t("selectMeasuresTxt") }}</span>
          </div>
          <div class="selectionPanel">
            <div class="subPanel" v-if="measures.cont">
              <span>{{ $t("contTxt") }}</span>
              <multiselect
                v-model="form.measures.cont"
                :placeholder="$t('selectContTxt')"
                :options="this.measures.cont"
                :label="'label_' + $t('langCode')"
                track-by="value"
                :multiple="true"
                :clear-on-select="false"
                :close-on-select="false"
                :showLabels="false"
              >
                <template v-slot:clear="cont">
                  <div
                    class="multiselect__clear"
                    v-if="measuresSelected('cont', componentKey)"
                    @mousedown.prevent.stop="clearAllCont(cont.search)"
                  ></div>
                </template>
                <template v-slot:noResult>No measure found.</template>
              </multiselect>
            </div>
            <div class="subPanel" v-if="measures.disc" style="margin-top: 16px;">
              <span>{{ $t("discTxt") }}</span>
              <multiselect
                v-model="form.measures.disc"
                :placeholder="$t('selectDiscTxt')"
                :options="this.measures.disc"
                :label="'label_' + $t('langCode')"
                track-by="value"
                :multiple="true"
                :clear-on-select="false"
                :close-on-select="false"
                :showLabels="false"
              >
                <template v-slot:clear="disc">
                  <div
                    class="multiselect__clear"
                    v-if="measuresSelected('disc', componentKey)"
                    @mousedown.prevent.stop="clearAllDisc(disc.search)"
                  ></div>
                </template>
                <template v-slot:noResult>No measure found.</template>
              </multiselect>
            </div>
          </div>
        </v-card>

        <v-card class="selectContainer" style="z-index: 7">
          <div class="panelTitle">
            <span>{{ $t("resourceTxt") }}</span>
          </div>

          <div class="selectionPanel">
            <BCard id="selectResourceCard" no-body>
              <BTabs id="selectResourceTabs" v-model="tabIndex" card>
                <BTab
                  v-for="resource in form.qB"
                  :key="'dyn-tab-' + resource.label"
                  active
                >
                  <template #title>
                    {{ resource.name }}
                    <a class="closeBtn" @click="removeTab(resource)"
                      ><i class="fas fa-times"></i
                    ></a>
                  </template>

                  <div class="subPanel">
                    <span>{{ $t("filters") }}</span>
                    <QueryBuilder
                      :id="resource.label + '-queryBuilder'"
                      :key="componentKey"
                      :query="form.qB.query"
                      :resource="resource.name"
                    ></QueryBuilder>
                  </div>
                  <div class="subPanel">
                    <span>{{ $t("fields") }}</span>
                    <multiselect
                      v-model="resource.field"
                      :placeholder="$t('selectFieldTxt')"
                      label="path"
                      :options="resourceAttributeFieldOptions(resource.name)"
                      :multiple="true"
                      track-by="path"
                      :clear-on-select="false"
                      :close-on-select="false"
                      :showLabels="false"
                      openDirection="below"
                    >
                      <template v-slot:clear="fields">
                        <div
                          class="multiselect__clear"
                          v-if="form.field.length"
                          @mousedown.prevent.stop="
                            clearAllFields(fields.search)
                          "
                        ></div>
                      </template>
                      <template v-slot:noResult>No site found.</template>
                    </multiselect>
                  </div>
                </BTab>

                <!-- New Tab Button (Using tabs-end slot) -->
                <template #tabs-end>
                  <BNavItem role="presentation" href="#" @click="toggleModal">
                    <span style="font-size: 14px; padding-left: 8px;">{{ $t("resources_add") }}</span>
                  </BNavItem>
                </template>

                <!-- Render this if no tabs -->
                <template #empty>
                  <div class="text-center text-muted">
                    There are no open tabs<br />
                    Open a new tab using the <b>Add (+)</b> button above.
                  </div>
                </template>
              </BTabs>
            </BCard>
          </div>
        </v-card>

        <v-card id="selectBreakdownContainer " class="selectContainer" style="z-index: 6">
          <div class="panelTitle">
            <span>{{ $t("selectBreakdownTxt") }}</span>
          </div>
          <div class="selectBreakdown selectionPanel" style="width: 100%">
            <BButton
              class="toggleBreakdownButton"
              :class="breakdown ? 'toggled' : ''"
              @click="toggleBreakdown"
            >
              <span v-if="breakdown">{{ $t("disableBreakdown") }}</span>
              <span v-if="!breakdown">{{ $t("enableBreakdown") }}</span>
            </BButton>

            <div v-if="breakdown">
            <div style="padding: 8px;">
              <div class="row">
                <div>{{ $t("selectResourceTypeTxt") }}</div>
                <div>
                  <select
                    class="form-control"
                    v-model="form.breakdown.resourceType"
                  >
                    <option 
                      v-for="(option, index) in resourceTabOptions"
                      :key="index"
                      :value="option.text"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row"
                v-if="this.form.breakdown.resourceType"
              >
                <div>{{ $t("selectResourceAttributeTxt") }}</div>
                <div>
                  <select
                    class="form-control"
                    v-model="form.breakdown.resourceAttribute"
                  >
                    <option 
                      v-for="(option, index) in resourceAttributeBreakdownOptions(
                        form.breakdown.resourceType,
                      )"
                      :key="index"
                      :value="option.path"
                    >
                      {{ option.path }}
                    </option>
                  </select>
                </div>
              </div>
              
            </div>
            
            <div class="row" v-if="this.form.breakdown.resourceAttribute" style="padding: 8px;">
              <div class="col-lg-4 col-md-4">
                <span>{{ $t("breakdownStart") }}</span>
                <input
                  class="form-control"
                  step="any"
                  :type="breakdownDataType"
                  id="start_breakdown"
                  v-model.number="form.breakdown.period.start"
                  :disabled="!breakdown"
                />
              </div>
              <div class="col-lg-4 col-md-4">
                <span>{{ $t("breakdownEnd") }}</span>
                <input
                  class="form-control"
                  step="any"
                  :type="breakdownDataType"
                  id="end_breakdown"
                  v-model.number="form.breakdown.period.end"
                  :disabled="!breakdown"
                />
              </div>
              <div class="col-lg-4 col-md-4">
                <span>{{ $t("breakdownStep") }}</span>
                <input
                  class="form-control"
                  step="any"
                  type="number"
                  :placeholder="$t('breakdownSteps')"
                  id="step_breakdown"
                  v-model.number="form.breakdown.period.step"
                  :disabled="!breakdown"
                />
              </div>
            </div>
          </div>
          </div>
        </v-card>
      </div>

      <div class="submit-btn">
        <BButton
          type="submit"
          :disabled="dataUpdate"
          class="queryButton"
          v-if="!awaitSubmit"
          >{{ $t("runQueryTxt") }}</BButton
        >
        <BButton pill block variant="success" disabled v-if="awaitSubmit">
          <BSpinner small type="grow"></BSpinner>
          Loading...
        </BButton>
      </div>
    </BForm>

    <div class="error-alert">
      <BAlert v-model="isError" variant="danger" dismissible>
        {{ errorMsg }}
      </BAlert>
    </div>

    <!--    <div class="col-lg-5 col-md-5 ">-->

    <!--                <div class="connectedPanel">-->
    <!--                  <h3>{{ $t("siteTitleTxt") }}</h3>-->
    <!--                  <hr />-->
    <!--                  <div class="row">-->
    <!--                  <div class="col-log-6 col-md-6 siteList">-->
    <!--                    <ul v-for="conn in connections.slice(0,5)" v-bind:key="conn.uid">-->
    <!--                      <li class="ok">{{ conn.name }}</li>-->
    <!--                    </ul>-->
    <!--                  </div>-->

    <!--                  <div class="col-log-6 col-md-6 siteList">-->
    <!--                    <ul v-for="conn in connections.slice(5,10)" v-bind:key="conn.uid">-->
    <!--                      <li class="ok">{{ conn.name }}</li>-->
    <!--                    </ul>-->
    <!--                  </div>-->
    <!--                  </div>-->
    <!--                </div>-->

    <!--    </div>-->
  </v-container>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<script>

import { bus } from "@/main";
import _ from "underscore";
import Multiselect from "vue-multiselect";
import GeneralApi from "../api/GeneralApi";
import QueryBuilder from "@/components/QueryBuilder";
import SummaryFormFactory from "../control/SummaryFormFactory";
import { ResourceTypes, AttributesByResourceType } from "../../fhir-types";

const nameResource = (res) =>
  `${res.type} > ${res.attribute} (${res.datatype})`;
const idResource = (res) => `${res.type}|${res.attribute}|${res.datatype}`;

export default {
  name: "AppHeader",
  props: ["connections", "resources", "minimize", "measures"],
  mounted() {
    bus.on("queryUpdate", (query) => {
      this.getQuery(query);
    });
  },
  computed: {
    options() {
      return [
        { value: "length_of_stay", text: "Length of stay" },
        { value: "icu", text: "ICU" },
        { value: { C: "CIUSS" }, text: "Group", disabled: true },
        { value: "age_groups", text: "Age groups" },
      ];
    },
    connectionOptions() {
      var sites = this.connections.map((conn) => ({
        text: conn.name,
        value: conn.uid,
      }));
      var group = "Select all";
      var connOptions = [{ sites: sites, group: group }];
      return connOptions;
    },
    resourceOptions() {
      return this.resources.map((res) => ({
        text: nameResource(res),
        value: idResource(res),
      }));
    },
    dataUpdate() {
      console.log(this.form.qB);
      return (
        this.form.sites.length === 0 ||
        (this.form.measures.cont.length === 0 &&
          this.form.measures.disc.length === 0) ||
        _.isEqual(this.form, this.cached) ||
        (this.breakdown &&
          (this.form.breakdown.resourceType.length === 0 ||
            this.form.breakdown.resourceAttribute.length === 0))
      );
    },
    resourceTabOptions() {
      return ResourceTypes.map((resource) => ({
        value: resource,
        text: resource,
      }));
    },
    breakdownDataType() {
      const field = this.form.breakdown.attributeType;

      if (field) {
        console.log(field);
        if (field == "dateTime") {
          return "date";
        } else if (field == "integer") {
          return "number";
        } else return "date";
      } else return "date";
    }
  },
  data() {
    return {
      tabIndex: 0,
      lastLang: "",
      newResource: null,
      conns: [],
      connOptions: [],
      allSelected: true,
      indeterminate: false,
      breakdownResourceType: undefined,
      modal: false,
      componentKey: this.$i18n.locale,
      form: {
        qB: [
          {
            name: "Patient",
            label: "Patient_0",
            query: {
              condition: "AND",
              rules: [],
            },
            field: [],
          },
        ],
        variables: [],
        breakdown: {
          resourceType: "",
          resourceAttribute: "",
          attributeType: "",
          period: {
            start: "2021-04-01",
            end: "2021-05-01",
            step: 5,
          },
        },
        measures: {
          cont: [
            { value: "count", label_en: "count", label_fr: "décompte" },
            { value: "mean", label_en: "mean", label_fr: "moyenne" },
            { value: "stdev", label_en: "stdev", label_fr: "stdev" },
            { value: "ci95", label_en: "ci95", label_fr: "ci95" },
          ],
          disc: [
            { value: "count", label_en: "count", label_fr: "décompte" },
            { value: "mode", label_en: "mode", label_fr: "mode" },
          ],
        },
        sites: [],
        field: [],
      },
      cached: {
        variables: [],
        breakdown: [],
        sites: [],
      },
      sites: [],
      fieldOptions: {
        en: [
          { label: "age", value: "age" },
          { label: "gender", value: "gender" },
        ],
        fr: [
          { label: "age", value: "age" },
          { label: "genre", value: "gender" },
        ],
      },
      breakdown: false,
      preFillSites: [112],
      preFillAllSites: false,
      awaitSubmit: false,
      isError: false,
      errorMsg: "",
    };
  },
  components: {
    Multiselect,
    QueryBuilder,
  },
  methods: {
    toggleModal: function(event) {
      event.preventDefault();
      this.modal = !this.modal
    },
    getMockedSummaryData: async function () {
      return {
        summary: {
          categories: ["mean_age"],
          data: [
            [
              [1, "111"],
              [2, "112"],
            ],
          ],
          means: [1.5],
          ranges: [[1, 2]],
          sites: ["CHUM", "MUHC"],
          types: ["value", "value", "value", "value", "time", "value"],
        },
      };
    },
    getSummaryData: async function () {
      const post_data = {
        conns: this.form.sites,
        sites: ["CHUM", "MUHC"],
        query: this.form.query,
        breakdown: this.form.breakdown,
        variables: ["length_of_stay"],
      };

      console.info("post_data", post_data);

      //TODO: Send request to server
      try {
        return GeneralApi.testData(post_data).then((res) => res.data);
      } catch (err) {
        console.error('Error getting test data', err)
        return []
      }
    },

    getNSummaryData: async function () {
      this.cached.sites = this.form.sites;
      // this.cached.breakdown  = this.form.breakdown;
      // this.cache.measures = this.from.measures;

      const sitesUri = encodeURI(
        this.form.sites.map((conn) => {
          return conn.value;
        }),
      );
      const contMeasuresUri = encodeURI(
        this.form.measures.cont.map((cat) => {
          return cat.value;
        }),
      );
      const discMeasuresUri = encodeURI(
        this.form.measures.disc.map((cat) => {
          return cat.value;
        }),
      );
      const breakdownUri = encodeURI(JSON.stringify(this.form.breakdown));
      const resourcesParams = encodeURI(
        JSON.stringify({
          fields: this.form.field.map((f) => f.value),
          query: this.form.query,
        }),
      );

      try {
        const data = await GeneralApi.mockStats(
          sitesUri,
          contMeasuresUri,
          discMeasuresUri,
          resourcesParams,
          breakdownUri,
        )
        .then((res) => res.data)
        .catch((err) => console.error(err));

        return data;
      } catch (err) {
        console.error('Error getting summary data', err)
        return {}
      }

    },

    onSubmit: async function () {
      try {
        const sites = this.form.sites.map((s) => s.value);
        const request = SummaryFormFactory.fromForm(this.form, this.breakdown);
        console.log("Making Summary requests with given sites", request, sites);
        this.awaitSubmit = true;

        const data = await GeneralApi.customRequest(request, sites);

        console.info(
          "[SelectData.vue] Data received with correct format ",
          data,
        );
        this.awaitSubmit = false;
        const results = this.prepareData(data.data.data);

        console.info("[SelectData.vue] Prepared Data", results);

        //console.log('old', await this.getSummaryData());
        const dat = await this.getNSummaryData();
        console.info("res_data", dat);

        bus.emit("showResults", results);
      } catch (err) {
        this.isError = true;
        this.errorMsg = err.message;
        this.awaitSubmit = false;
        console.log('Error on submit', err.message);
      }
    },
    onReset() {},
    toggleAll(checked) {
      this.form.sites = checked ? this.connOptions.map((opt) => opt.value) : [];
    },
    clearAllVar() {
      this.form.variables = [];
    },
    clearAllSites() {
      this.form.sites = [];
    },
    clearAllFields() {
      this.form.field = [];
    },
    measuresSelected(category) {
      if (category === "cont") {
        return this.form.measures.cont.length > 0;
      }
      if (category === "disc") {
        return this.form.measures.disc.length > 0;
      } else return false;
    },
    clearAllCont() {
      this.form.measures.cont = [];
    },
    clearAllDisc() {
      this.form.measures.disc = [];
    },
    getQuery(query) {
      this.form.qB[this.tabIndex].query = query;
    },
    toggleBreakdown() {
      console.log(this.breakdown)
      this.breakdown = !this.breakdown
    },
    newTab() {
      this.modal = false
      if (!this.newResource) {
        alert("Choose a resource");
        return;
      }
      this.form.qB.push({
        name: this.newResource,
        label: this.newResource + "_" + this.form.qB.length,
        query: {
          condition: "AND",
          rules: [{}],
        },
        field: [],
      });
      this.newResource = "";
      //
    },
    removeTab(x) {
      for (let i = 0; i < this.form.qB.length; i++) {
        if (this.form.qB[i] === x) {
          this.form.qB.splice(i, 1);
        }
      }
    },
    prepareData(data) {
      var results = {
        tables: [],
        figures: [],
      };
      results.tables = this.prepareTables(data);
      results.figures = this.prepareFigures(data);

      return results;
    },
    prepareTables(data) {
      var tables = [];

      data.forEach((d) => {
        var table = {
          items: [],
          fieldslang: {
            en: {},
            fr: {},
          },
        };
        table.nameKey = d.about.field;
        d.data.forEach((dat) => {
          var item = {};
          d.cols.forEach((col, i) => {
            if (!col.categories) {
              if (isNaN(dat[i])) {
                item[col.code] = dat[i];
              } else {
                item[col.code] = this.roundNum(dat[i]);
              }
            } else {
              col.categories.forEach((cat, j) => {
                if (isNaN(dat[i][j])) {
                  item[cat.code] = dat[i];
                } else {
                  item[cat.code] = this.roundNum(dat[i][j]);
                }
              });
            }
          });

          table.items.push(item);
        });

        tables.fieldslang = { en: {}, fr: {} };
        d.cols.forEach((col) => {
          if (!col.categories) {
            table.fieldslang.en[col.code] = col.labels.en;
            table.fieldslang.fr[col.code] = col.labels.fr;
          } else {
            col.categories.forEach((cat) => {
              //temporary solution for times
              table.fieldslang.en[col.code + cat.code] = `${col.labels.en} ${
                d.about.fieldType == "dateTime"
                  ? new Date(cat.code).toISOString().split("T")[0]
                  : cat.code
              }`;
              table.fieldslang.fr[col.code + cat.code] = `${col.labels.en} ${
                d.about.fieldType == "dateTime"
                  ? new Date(cat.code).toISOString().split("T")[0]
                  : cat.code
              }`;
            });
          }
        });

        tables.push(table);
      });

      return tables;
    },

    prepareFigures(data) {
      var figures = [];

      data.forEach((d) => {
        var figure = {};
        figure.nameKey = d.about.field;
        figure.breakdown = this.breakdown;

        if (d.about.measure === "categorical") {
          var primaryCategory = d.data.map(
              (dat) => dat[d.cols.findIndex((col) => col.code === "site")],
            ),
            subCategory = d.cols[
              d.cols.findIndex((col) => col.code === "count")
            ].categories.map((c) => c.code);

          figure.category = [primaryCategory, subCategory];
          (figure.type = "bar"),
            (figure.data = d.data.map(
              (dat) => dat[d.cols.findIndex((col) => col.code === "count")],
            ));
        }

        if (d.about.measure === "continuous") {
          (figure.category = [
            d.data.map(
              (dat) => dat[d.cols.findIndex((col) => col.code === "site")],
            ),
          ]),
            (figure.type = "bar"),
            (figure.data = d.data.map((dat) =>
              this.roundNum(
                dat[d.cols.findIndex((col) => col.code === "mean")],
              ),
            )),
            (figure.margin = []);
          // d.data.forEach((dat,i)=>{
          //   var marg = [];
          //   marg[0] = figure.category[0][i];
          //   var ci = dat[d.cols.findIndex(col=>col.code==='ci95')].slice(0,2);
          //   figure.margin.push(marg.concat(ci));
          // })
        }

        if (d.about.fieldType == "dateTime") {
          figure.type = "line";
          figure.categories = d.data.map(
            (dat) => dat[d.cols.findIndex((col) => col.code === "site")],
          );
          figure.dates = d.cols[
            d.cols.findIndex((col) => col.code === "count")
          ].categories.map((c) => new Date(c.code).toISOString().split("T")[0]);
          figure.data = d.data.map(
            (dat) => dat[d.cols.findIndex((col) => col.code === "count")],
          );
        } else if (d.about.fieldType == "integer") {
          figure.type = "stackBar";
          var figureData = d.data.filter(
            (dat) =>
              dat[d.cols.findIndex((col) => col.code === "site")] != "all",
          ); //filter out 'all' site
          (primaryCategory = d.cols[
            d.cols.findIndex((col) => col.code === "count")
          ].categories.map((c) => c.code)), //get x axis
            (subCategory = figureData.map(
              (dat) => dat[d.cols.findIndex((col) => col.code === "site")],
            )); //get sites
          figure.category = [primaryCategory, subCategory];
          figure.data = figureData.map(
            (dat) => dat[d.cols.findIndex((col) => col.code === "count")],
          ); //get data from each site
          figure.stack = "x";
        }

        figures.push(figure);
      });

      return figures;
    },

    roundNum(num) {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    },

    resourceAttributeOptions(resource) {
      if (!resource) return;
      const attributes = AttributesByResourceType[resource];
      let fields = [];
      attributes.forEach((attr) => {
        fields.push(this.recursiveGetAttributePath(attr, attr.name));
      });
      return this.fieldCorrection(fields.flat(Infinity));
    },

    recursiveGetAttributePath(attr, path) {
      if (!attr.subpaths) {
        return { path: path, type: attr.type };
      } else {
        let filters = [];
        attr.subpaths.forEach((sub) => {
          filters.push(
            this.recursiveGetAttributePath(sub, path + "." + sub.name),
          );
        });
        return filters;
      }
    },
    fieldCorrection(fields) {
      fields.forEach((field, index) => {
        if (field.path.startsWith("valueQuantity")) {
          const subpath = field.path.split(".");
          fields[index].path = "value.Quantity." + subpath[1];
        } else if (field.path == "effectiveDateTime") {
          fields[index].path = "effective.dateTime";
        } else if (field.path == "deceasedDateTime") {
          fields[index].path = "deceased.dateTime";
        }
      });
      return fields;
    },
    resourceAttributeFieldOptions(resource) {
      var attributes = this.resourceAttributeOptions(resource);
      attributes = attributes.filter((attr) => {
        return attr.type != "dateTime";
      });
      return attributes;
    },
    resourceAttributeBreakdownOptions(resource) {
      var attributes = this.resourceAttributeOptions(resource);
      attributes = attributes.filter((attr) => {
        return attr.type == "dateTime" || attr.type == "integer";
      });
      return attributes;
    },
    getAttributeType(attribute, resource) {
      var allAttributes = this.resourceAttributeOptions(resource);
      var result = allAttributes.find((attr) => {
        return attr.path == attribute;
      });
      return result.type;
    },
  },
  watch: {
    connections() {
      var sites = this.connections.map((conn) => ({
        text: conn.name,
        value: conn.uid,
      }));
      var group = "Select all";
      this.connOptions.push({ sites: sites, group: group });
    },
    conns(newVal) {
      if (newVal.length === 0) {
        this.indeterminate = false;
        this.allSelected = false;
      } else if (newVal.length === this.connOptions.length) {
        this.indeterminate = false;
        this.allSelected = true;
      } else {
        this.indeterminate = true;
        this.allSelected = false;
      }
    },
    "form.breakdown.resourceAttribute"(newVal) {
      var type = this.getAttributeType(
        newVal,
        this.form.breakdown.resourceType,
      );
      this.form.breakdown.attributeType = type;
      this.form.breakdown.resourceAttribute = newVal;
    },
  },
};
</script>