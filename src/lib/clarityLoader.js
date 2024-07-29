export function loadClarity() {
  if (typeof window !== 'undefined' && localStorage.getItem('clarityConsent') === 'accepted') {
    try {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];
        if (y && y.parentNode) {
          y.parentNode.insertBefore(t,y);
        } else {
          l.head.appendChild(t);
        }
      })(window, document, "clarity", "script", "nf033mep7f");
    } catch (error) {
      console.error("Error loading Clarity:", error);
    }
  }
}