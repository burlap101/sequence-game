<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <a class="navbar-brand" href="#">SEQUENCE</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarsExampleDefault"
      aria-controls="navbarsExampleDefault"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a
            class="nav-link"
            target="_blank"
            href="https://en.wikipedia.org/wiki/Sequence_(game)"
            >Rules</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" v-bind:href="statsurl">Stats</a>
        </li>
      </ul>
      <span
        v-if="gameid != '' && gameid != undefined"
        class="nav-link text-light"
        >Game ID: {{ gameid }}</span
      >
    </div>
  </nav>
</template>

<script>
const statsUrl = window.location.protocol + "//" + window.location.hostname + ":50135/stats";

export default {
  name: "Navbar",
  props: ["gameid"],
  data() {
    return {
      statsurl: statsUrl
    };
  }
};
</script>
