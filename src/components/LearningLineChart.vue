<template>
  <v-chart class="chart" ref="LearningLineChart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  LineChart,
]);

export default {
  name: "LearningLineChart",
  components: { VChart },
  props: {
    dataValues: Array,
    dataToPlot: Object,
  },
  data() {
    return {
      series: [],
      dataset: {},
      xAxis: [],
      sites: []
    };
  },
  methods: {
    onResize() {
      this.$refs.MultiLineChart.resize();
    },
    datasetTransform: function () {
      this.dataValues.forEach((data) => {
        if (!this.dataset[data.siteCode]) this.dataset[data.siteCode] = []
        if (!this.sites.includes(data.siteCode)) this.sites.push(data.siteCode)
        if (data.currentRound === this.dataset[data.siteCode].length + 1) {
          this.dataset[data.siteCode].push(data.value)
        }
      })
      if (this.dataValues.length > 0) {
        this.xAxis = this.range(1, this.dataset[Object.keys(this.dataset)[0]].length, 1);
      } else {
        this.xAxis = []
      }
      return this.dataset;
    },
    datasetSeries: function () {
      let series = [];
      this.sites.forEach((site) => {
        const serie = {
          type: "line",
          name: site,
          showSymbol: true,
          data: this.dataset[site].reverse(),
        };
        series.push(serie);
      });
      this.series = series
      return series;
    },

  range: function (start, stop, step) { 
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)
  },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  computed: {
    option() {
      this.datasetTransform()
      this.datasetSeries()
      return {
        series: this.series,
        legend: { data: this.sites },
        tooltip: { trigger: "axis" },
        grid: { bottom: "3%", containLabel: true },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xAxis
        },
        yAxis: {
          type: "value",
        },
      };
    },
  },
};
</script>

<style scoped></style>
