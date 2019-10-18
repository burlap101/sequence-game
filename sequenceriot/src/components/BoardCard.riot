<template>
  <g>
    <image
      v-bind:href="'/assets/cards/' + card.name + '.svg'"
      v-bind:height="imgParams.height"
      v-bind:width="imgParams.width"
      v-bind:x="imgParams.x"
      v-bind:y="imgParams.y"
      v-on:click="placeChip"
    />
    <circle
      v-if="card.isOccupied"
      v-bind:cx="chipParams.cx"
      v-bind:cy="chipParams.cy"
      v-bind:r="chipParams.r"
      v-bind:fill="card.fill"
    />
  </g>
</template>

<script>
export default {
  name: "BoardCard",
  props: [
    "card",
    "imgParams",
    "chipParams",
    "playerHand",
    "playerTurn",
    "aiHand",
    "bcid",
    "jacks",
    "winnerFound"
  ],
  data() {
    return {
      warningText: ""
    };
  },
  methods: {
    logClick: function() {
      console.log(this.card.isOccupied);
    },
    placeChip: function() {
      if (!this.winnerFound && this.card.name != "w") {
        if (
          this.playerHand.includes(this.card.name) &&
          !this.card.isOccupied &&
          this.playerTurn
        ) {
          this.card.isOccupied = true;
          this.$emit("turn-taken", this.card.name, this.bcid);
        } else if (
          (this.jacks.oneEyedSelected || this.jacks.twoEyedSelected) &&
          !this.card.isOccupied &&
          this.playerTurn
        ) {
          this.card.isOccupied = true;
          this.$emit("jack-played", this.card.name, this.bcid);
        } else if (this.card.isOccupied) {
          this.warningText =
            "That location is already occupied. Please select another";
          this.$emit("show-warning", this.warningText);
        } else if (!this.playerHand.includes(this.card.name)) {
          this.warningText =
            "You don't have that card in your hand. Please select another.";
          this.$emit("show-warning", this.warningText);
        }
      } else if (this.winnerFound) {
        this.warningText =
          "Game's over. You can start another by hitting refresh and clicking 'New Game'";
        this.$emit("show-warning", this.warningText);
      }
    }
  }
};
</script>
