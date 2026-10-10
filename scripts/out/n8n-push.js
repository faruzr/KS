function withSheetImages(messages, imageFileIds) {
  if (!Array.isArray(imageFileIds) || imageFileIds.length !== SHEET_COUNT || SHEET_COUNT > 5
    || !imageFileIds.every(id => typeof id === 'string' && /^[A-Za-z0-9_-]{10,200}$/.test(id))) return messages;
  return imageFileIds.map(id => ({ type:'image', originalContentUrl:`https://lh3.googleusercontent.com/d/${id}=w1080`, previewImageUrl:`https://lh3.googleusercontent.com/d/${id}=w480` }));
}

const sheets = $('Validate and render stock sheet').all().map(i => i.json);
const SHEET_COUNT = sheets.length;
let imageFileIds = null;
try {
  const ups = $('Upload image to Drive').all().map(i => i.json);
  const shares = $('Share image by link').all().map(i => i.json);
  imageFileIds = ups.map((up, i) => up.id && !up.error && up.mimeType === 'image/png' && shares[i]?.id && !shares[i].error ? up.id : null);
} catch {}
const messages = withSheetImages(sheets[0].delivery.messages, imageFileIds);
return [{ json: { requestId: sheets[0].requestId, imageFileIds, push: { to: sheets[0].delivery.to, messages } } }];