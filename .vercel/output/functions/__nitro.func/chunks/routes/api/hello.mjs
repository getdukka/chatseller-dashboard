import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const hello = defineEventHandler(() => {
  return { message: "Hello from JS endpoint!" };
});

export { hello as default };
//# sourceMappingURL=hello.mjs.map
