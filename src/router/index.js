import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import GameView from "../views/GameView";
import SignUp from "../views/SignUp";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/gameview/:gpID",
    name: "gameview",
    props: true,
    component: GameView
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
