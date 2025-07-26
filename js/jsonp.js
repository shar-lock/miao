function jsonp(url,callback){
  let script = document.createElement('script')
  let callbackName = 'json-callback'
  window[callbackName] = (data)=>{
    callback(data)
  }
  script.src = url + '&callback=' + callbackName
  document.body.append(script)
  script.onload = ()=>{
    delete window[callbackName]
    document.body.removeChild(script)
  }
}

function jsonp(url) {
  return new Promise((resolve, reject) => {
    if (typeof url !== 'string' || !url.trim()) {
      reject(new Error('Invalid URL provided'));
      return;
    }
    const script = document.createElement('script');
    const callbackName = 'jsonp_callback_' + Date.now() + Math.round(Math.random() * 1000);
    // 设置超时处理
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timed out'));
    }, 10000); // 10秒超时

    // 清理函数
    const cleanup = () => {
      clearTimeout(timeoutId);
      delete window[callbackName];
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.src = url.includes('?') 
      ? `${url}&callback=${callbackName}`
      : `${url}?callback=${callbackName}`;

    script.onerror = () => {
      cleanup();
      reject(new Error('Failed to load JSONP script'));
    };

    document.body.appendChild(script);
  });
}