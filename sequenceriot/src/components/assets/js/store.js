import { createStore } from "riot-state";

const name = "gamestore";

const state = {
  warningText: "",
  cardName: "",
  bcid: "",
};

const actions = {
  showWarning(text) {
    this.warningText = text;
    console.log(this.warningText);
  },

  jackPlayed(name, bcid) {
    this.cardName = name,
    this.bcid = bcid
  },

  turnTaken(name, bcid) {
    this.cardName = name,
    this.bcid = bcid,
    console.log("BCID = " + this.bcid);
  }
};

export default createStore({
  name,
  state,
  actions
});