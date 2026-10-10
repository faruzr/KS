function classifyLineResponse(response, requestId) {
  const headers = response.headers || {};
  const lineRequestId = response.statusCode === 200 ? headers['x-line-request-id'] : response.statusCode === 409 ? headers['x-line-accepted-request-id'] : null;
  if (typeof lineRequestId === 'string' && lineRequestId) return {statusCode:200,requestId,delivery:'accepted',lineRequestId};
  return {statusCode:502,requestId,delivery:'unknown',message:'ยังยืนยันว่า LINE รับรายงานไม่ได้ กรุณาตรวจกลุ่มก่อนลองใหม่'};
}

return [{ json: classifyLineResponse($input.first().json, $('Build LINE push').first().json.requestId) }];