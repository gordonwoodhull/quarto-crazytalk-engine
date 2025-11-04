
import { withSpinner } from "../../core/console.ts";  
import { delay } from "https://deno.land/std/async/delay.ts";  
  
// Generate random duration between 1-15 seconds (in milliseconds)  
const randomDuration = Math.floor(Math.random() * 14000) + 1000;  
  
await withSpinner({  
  message: "Processing with random duration...",  
  doneMessage: "Processing complete!"  
}, async () => {  
  await delay(randomDuration);  
});



// from https://deepwiki.com/search/how-do-the-cool-spinner-effect_5b10adbc-d76d-4452-a193-8fdff2056e11?mode=fast
