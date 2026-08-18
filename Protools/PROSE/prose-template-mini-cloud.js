/*
  PROSE Template Mini-Cloud Loader
  Public-safe, same-origin template registry loader for PROSE.
  It combines the canonical template manifest with registered extension packs
  without imposing a fixed template-count ceiling.
*/
(function(){
  'use strict';

  const scriptUrl = (document.currentScript && document.currentScript.src)
    ? new URL(document.currentScript.src, window.location.href)
    : new URL(window.location.href);
  const defaultCloudUrl = new URL('../templates/mini-cloud.json', scriptUrl);

  function asArray(value){
    return Array.isArray(value) ? value : [];
  }

  function cleanText(value){
    return typeof value === 'string' ? value.trim() : '';
  }

  function sameOriginUrl(path, base){
    const url = new URL(path, base);
    if(url.origin !== window.location.origin){
      throw new Error('PROSE Mini-Cloud rejected a non-same-origin resource.');
    }
    return url;
  }

  function normalizeTemplate(record, sourceId, baseUrl){
    if(!record || typeof record !== 'object') return null;

    const id = cleanText(record.id);
    const title = cleanText(record.title);
    const file = cleanText(record.file);
    if(!id || !title || !file) return null;

    const fileUrl = sameOriginUrl(file, baseUrl);
    return {
      id,
      title,
      defaultTitle: cleanText(record.defaultTitle) || title,
      category: cleanText(record.category) || 'Other',
      tags: asArray(record.tags).map(cleanText).filter(Boolean),
      description: cleanText(record.description),
      file,
      fileUrl: fileUrl.href,
      sourceId: cleanText(sourceId) || 'unknown'
    };
  }

  async function fetchJson(url){
    const response = await fetch(url, {
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if(!response.ok){
      throw new Error('PROSE Mini-Cloud could not load ' + url.pathname + ' (' + response.status + ').');
    }
    return response.json();
  }

  async function loadSource(source, cloudUrl){
    const manifestPath = cleanText(source && source.manifest);
    if(!manifestPath) return { categories: [], templates: [] };

    const manifestUrl = sameOriginUrl(manifestPath, cloudUrl);
    const manifest = await fetchJson(manifestUrl);
    const categories = asArray(manifest.categories).map(cleanText).filter(Boolean);
    const templates = [];

    for(const record of asArray(manifest.templates)){
      const normalized = normalizeTemplate(record, source.id, manifestUrl);
      if(normalized) templates.push(normalized);
    }

    return { categories, templates };
  }

  function mergeUniqueTemplates(groups, rejectDuplicateIds){
    const byId = new Map();
    for(const group of groups){
      for(const template of asArray(group)){
        if(byId.has(template.id)){
          if(rejectDuplicateIds){
            throw new Error('PROSE Mini-Cloud duplicate template id: ' + template.id);
          }
          continue;
        }
        byId.set(template.id, template);
      }
    }
    return Array.from(byId.values());
  }

  function orderedCategories(preferred, templates){
    const seen = new Set();
    const result = [];

    for(const category of preferred){
      if(category && !seen.has(category)){
        seen.add(category);
        result.push(category);
      }
    }
    for(const template of templates){
      if(template.category && !seen.has(template.category)){
        seen.add(template.category);
        result.push(template.category);
      }
    }
    return result;
  }

  async function load(options){
    const opts = options || {};
    const cloudUrl = sameOriginUrl(opts.cloudUrl || defaultCloudUrl.href, scriptUrl);
    const cloud = await fetchJson(cloudUrl);
    const sourceResults = [];
    const sourceCategories = [];

    for(const source of asArray(cloud.sources)){
      const result = await loadSource(source, cloudUrl);
      sourceResults.push(result.templates);
      sourceCategories.push.apply(sourceCategories, result.categories);
    }

    const extensions = [];
    for(const record of asArray(cloud.extensions)){
      const normalized = normalizeTemplate(record, 'mini-cloud-extension', cloudUrl);
      if(normalized) extensions.push(normalized);
    }

    const rejectDuplicateIds = !cloud.policies || cloud.policies.rejectDuplicateIds !== false;
    const templates = mergeUniqueTemplates(sourceResults.concat([extensions]), rejectDuplicateIds);
    const categories = orderedCategories(sourceCategories, templates);

    const byCategory = {};
    for(const category of categories) byCategory[category] = [];
    for(const template of templates){
      if(!byCategory[template.category]) byCategory[template.category] = [];
      byCategory[template.category].push(template);
    }

    const result = {
      schema: cleanText(cloud.schema) || 'prose-template-mini-cloud',
      schemaVersion: cloud.schemaVersion || 1,
      title: cleanText(cloud.title) || 'PROSE Template Mini-Cloud',
      templates,
      categories,
      byCategory,
      count: templates.length,
      cloudUrl: cloudUrl.href,
      policies: cloud.policies || {}
    };

    window.dispatchEvent(new CustomEvent('prose-template-cloud-ready', { detail: result }));
    return result;
  }

  window.PROSETemplateMiniCloud = Object.freeze({
    load,
    url: defaultCloudUrl.href
  });
})();
