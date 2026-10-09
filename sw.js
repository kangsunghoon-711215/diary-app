/* 일기장 서비스워커: 한 번 열어 두면 인터넷 없이도 열려요. 일기 데이터는 건드리지 않고 화면·그림 파일만 보관해요. */
const CACHE = "diary-v2";
const STICKERS = [
 "./stickers/blob/life-book.png",
 "./stickers/blob/life-coffee.png",
 "./stickers/blob/life-exercise.png",
 "./stickers/blob/life-food.png",
 "./stickers/blob/life-heart.png",
 "./stickers/blob/life-rain.png",
 "./stickers/blob/life-travel.png",
 "./stickers/blob/mood-1.png",
 "./stickers/blob/mood-2.png",
 "./stickers/blob/mood-3.png",
 "./stickers/blob/mood-4.png",
 "./stickers/blob/mood-5.png",
 "./stickers/blobwc/life-book.png",
 "./stickers/blobwc/life-coffee.png",
 "./stickers/blobwc/life-exercise.png",
 "./stickers/blobwc/life-food.png",
 "./stickers/blobwc/life-heart.png",
 "./stickers/blobwc/life-rain.png",
 "./stickers/blobwc/life-travel.png",
 "./stickers/blobwc/mood-1.png",
 "./stickers/blobwc/mood-2.png",
 "./stickers/blobwc/mood-3.png",
 "./stickers/blobwc/mood-4.png",
 "./stickers/blobwc/mood-5.png",
 "./stickers/duck/life-book.png",
 "./stickers/duck/life-coffee.png",
 "./stickers/duck/life-exercise.png",
 "./stickers/duck/life-food.png",
 "./stickers/duck/life-heart.png",
 "./stickers/duck/life-rain.png",
 "./stickers/duck/life-travel.png",
 "./stickers/duck/mood-1.png",
 "./stickers/duck/mood-2.png",
 "./stickers/duck/mood-3.png",
 "./stickers/duck/mood-4.png",
 "./stickers/duck/mood-5.png",
 "./stickers/owl/life-book.png",
 "./stickers/owl/life-coffee.png",
 "./stickers/owl/life-exercise.png",
 "./stickers/owl/life-food.png",
 "./stickers/owl/life-heart.png",
 "./stickers/owl/life-rain.png",
 "./stickers/owl/life-travel.png",
 "./stickers/owl/mood-1.png",
 "./stickers/owl/mood-2.png",
 "./stickers/owl/mood-3.png",
 "./stickers/owl/mood-4.png",
 "./stickers/owl/mood-5.png",
 "./stickers/penguin/life-book.png",
 "./stickers/penguin/life-coffee.png",
 "./stickers/penguin/life-exercise.png",
 "./stickers/penguin/life-food.png",
 "./stickers/penguin/life-heart.png",
 "./stickers/penguin/life-rain.png",
 "./stickers/penguin/life-travel.png",
 "./stickers/penguin/mood-1.png",
 "./stickers/penguin/mood-2.png",
 "./stickers/penguin/mood-3.png",
 "./stickers/penguin/mood-4.png",
 "./stickers/penguin/mood-5.png"
];
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([...SHELL, ...STICKERS])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  const isPage = r.mode === "navigate" || r.url.endsWith("/index.html");
  if (isPage) { // 화면은 새 버전이 있으면 먼저 받고, 인터넷이 없으면 보관본을 써요
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); return res; }).catch(() => caches.match(r).then((m) => m || caches.match("./index.html"))));
  } else { // 그림 파일은 보관본이 있으면 바로 써요
    e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); return res; })));
  }
});
