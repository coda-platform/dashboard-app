
<template>
    <v-card  class="roundBorderPanel">
        <div class="txTile">
            <h3 class="tileTitle">{{txTitle}}</h3>
            <div class="dataTileContent">{{!data ? '...' : $n(data)}}</div>
            <div class="nSitesTextTile">{{nSites}} Sites</div>
            <div class="bottomTextTile" style="opacity: 0.5;">{{txBottom}}</div>
        </div>
    </v-card>
</template>

<script>
export default {
  name: "HomeTextTile",
  props:{
    txTitle: String,
    txBottom: String,
    nSites: Number,
    data: Number,
  }
}
</script>
