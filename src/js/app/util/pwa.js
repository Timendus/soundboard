// Install Service worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

// PWA install prompt
//
// let deferredPrompt;
// window.addEventListener('beforeinstallprompt', (e) => {
//   // Prevent Chrome 67 and earlier from automatically showing the prompt
//   e.preventDefault();
//   // Stash the event so it can be triggered later.
//   deferredPrompt = e;
//   // Show the install button
//   document.querySelectorAll('.install-button').forEach(function(b) {
//     b.classList.add('active');
//     b.addEventListener('click', install2HS);
//   });
// });
//
// function install2HS() {
//   // Hide install button
//   document.querySelectorAll('.install-button').forEach(function(b) {
//     b.classList.remove('active');
//   });
//
//   deferredPrompt.prompt();
//   deferredPrompt.userChoice.then((choiceResult) => {
//     if (choiceResult.outcome !== 'accepted') {
//       document.querySelectorAll('.install-button').forEach(function(b) {
//         b.classList.add('active');
//       });
//     }
//   });
// }
