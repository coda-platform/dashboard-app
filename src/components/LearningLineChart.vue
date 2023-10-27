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
    sites: Array
  },
  data() {
    return {
      series: [],
      dataset: {},
      xAxis: [],
    };
  },
  methods: {
    onResize() {
      this.$refs.MultiLineChart.resize();
    },
    datasetTransform: function () {
      this.sites.forEach((site) => {
        this.dataset[site] = [] //make an array in dateset for each site
      })
      this.dataValues.forEach((data) => { //push each line of data into right site
        this.dataset[data.siteCode].push(data.value)
      })
      this.xAxis = this.range(1, this.dataset[this.sites[0]].length, 1);
      return this.dataset;
    },
    datasetSeries: function () {
      let series = [];
      this.sites.forEach((site) => {
        const serie = {
          type: "line",
          name: site,
          showSymbol: true,
          data: this.dataset[site],
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
