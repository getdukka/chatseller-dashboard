import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const knowledgeBase_get = defineEventHandler(async (event) => {
  const knowledgeBase = [
    {
      id: "1",
      title: "Catalogue Produits",
      type: "csv",
      size: "2.3 MB",
      status: "active",
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString(),
      entriesCount: 145
    },
    {
      id: "2",
      title: "Politique de Retour",
      type: "pdf",
      size: "856 KB",
      status: "active",
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString(),
      entriesCount: 1
    },
    {
      id: "3",
      title: "FAQ Clients",
      type: "manual",
      size: "1.1 MB",
      status: "active",
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString(),
      entriesCount: 67
    }
  ];
  return {
    success: true,
    data: knowledgeBase,
    total: knowledgeBase.length
  };
});

export { knowledgeBase_get as default };
//# sourceMappingURL=knowledge-base.get.mjs.map
