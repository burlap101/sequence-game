import '@riotjs/hot-reload'
import { component, register } from 'riot'
import TheGame from './components/TheGame.riot'

register("TheGame", TheGame);

TheGame.shared = [
  "warningText",
  "cardName",
  "bcid"
];

component(TheGame)(document.getElementById('app'), {
  title: 'Hi there!'
})