Evaluation of TinaCMS
=====================
- TinaCMS requires two ports (localhost:3000 and localhost:4001) and 
  this leads to CORS problems in the web browser, when running 
  the system containerized.
- Possible solution would be to hide the whole setup behind a proxy
  but that would introduce a lot of additional complexity and 
  probably would be brittle
