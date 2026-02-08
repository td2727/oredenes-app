globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, r as renderTemplate, k as renderScript, l as renderSlot, n as renderHead, h as addAttribute, o as renderComponent } from '../chunks/astro/server_CAomdprQ.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Main = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Main;
  const { pageClass = "" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"', '> <head><meta charset="utf-8"><link rel="icon" type="image/png" href="/favicon.ico"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"><meta name="generator"', '><meta name="description" content="Medical Orders Manager - Create and manage medical orders efficiently"><meta name="theme-color" content="#006AFF"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="MedOrders"><link rel="manifest" href="/manifest.json"><link rel="apple-touch-icon" href="/icon-192.png"><script src="/clear-storage.js"><\/script><title>Administrador De Ordenes Medicas </title>', '</head> <!-- Dark mode class injection point - will be replaced with `dark` class based on your site palette --> <body class="__DARK_MODE_CLASS__"> ', " ", " </body> </html>"], ['<html lang="en"', '> <head><meta charset="utf-8"><link rel="icon" type="image/png" href="/favicon.ico"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"><meta name="generator"', '><meta name="description" content="Medical Orders Manager - Create and manage medical orders efficiently"><meta name="theme-color" content="#006AFF"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="MedOrders"><link rel="manifest" href="/manifest.json"><link rel="apple-touch-icon" href="/icon-192.png"><script src="/clear-storage.js"><\/script><title>Administrador De Ordenes Medicas </title>', '</head> <!-- Dark mode class injection point - will be replaced with \\`dark\\` class based on your site palette --> <body class="__DARK_MODE_CLASS__"> ', " ", " </body> </html>"])), addAttribute(pageClass, "class"), addAttribute(Astro2.generator, "content"), renderHead(), renderSlot($$result, $$slots["default"]), renderScript($$result, "/app/src/layouts/main.astro?astro&type=script&index=0&lang.ts"));
}, "/app/src/layouts/main.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "MedicalOrdersApp", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/MedicalOrdersApp", "client:component-export": "default" })} ` })}`;
}, "/app/src/pages/index.astro", void 0);

const $$file = "/app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
