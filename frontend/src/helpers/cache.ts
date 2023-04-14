
export const refreshCacheAndReload = () => {
  console.log("Clearing cache and hard reloading...");
  if (caches) {
    // Service worker cache should be cleared with caches.delete()
    caches.keys().then(function (names) {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
  // delete browser cache and hard reload
  window.location.reload(true);
};
