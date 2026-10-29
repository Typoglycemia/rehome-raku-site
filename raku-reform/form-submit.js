/* RAKUリフォーム LP: お問い合わせ・簡易見積もりフォームの送信処理(Web3Forms)
   旧WordPress(Contact Form 7)の送信を置き換える */
(function () {
  var ACCESS_KEY = '0941aad9-6363-433f-9b73-ef4d3af25a53';
  var ENDPOINT = 'https://api.web3forms.com/submit';
  // Googleスプレッドシート記録 + 自動返信メール(Google Apps Script)
  var SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw2kVEis1wXAQsT2kgjLfOwSb_IQCLAKb5Bxm8xim53GszOhAqs1bAEGgOup_AmftMfjg/exec';

  function labelOf(el) {
    var l = el.closest('label');
    var t = l && l.querySelector('.wpcf7-list-item-label');
    t = t ? t.textContent.trim() : (l ? l.innerText.replace(/\s+/g, ' ').trim() : '');
    return t || el.value;
  }
  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? (el.value || '').trim() : '';
  }
  function checkedLabels(form, name) {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="' + name + '"]:checked'), labelOf);
  }
  function showMsg(form, text, ok) {
    var box = form.querySelector('.wpcf7-response-output');
    if (!box) return;
    box.removeAttribute('aria-hidden');
    box.textContent = text;
    box.style.display = 'block';
    box.style.color = ok ? '#2e7d32' : '#c62828';
    box.style.borderColor = ok ? '#2e7d32' : '#c62828';
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.classList || !form.classList.contains('wpcf7-form')) return;
    // 旧プラグイン(WordPress宛の送信)を止める
    e.preventDefault();
    e.stopImmediatePropagation();

    var isEstimate = !!form.querySelector('[name="estimate-price"]');
    var name = val(form, 'your-name');
    var tel = val(form, 'your-number');
    var mail = val(form, 'your-email');
    var kind = val(form, 'your-kind');

    if (!name || !tel || !mail || (!isEstimate && (!kind || kind.indexOf('選択してください') === 0))) {
      showMsg(form, '未入力の必須項目があります。ご確認ください。', false);
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
      showMsg(form, 'メールアドレスの形式をご確認ください。', false);
      return;
    }

    function num(v) { return Number(String(v || '').replace(/[^0-9.]/g, '')) || 0; }
    var estPrice = 0, estDiscount = 0;
    if (isEstimate) {
      var places = form.querySelectorAll('input[name="estimate-place[]"]:checked');
      var ageEl = form.querySelector('input[name="estimate-age"]:checked');
      var sizeEl = form.querySelector('input[name="estimate-size"]:checked');
      if (!places.length || !ageEl || !sizeEl) {
        showMsg(form, '工事箇所・築年数・広さを選択してください。', false);
        return;
      }
      estPrice = num(val(form, 'estimate-price'));
      if (!estPrice) {  // 計算プラグインの値が取れない場合は、同じ式(箇所の合計 × 築年数 × 広さ)で自前計算
        var sum = 0;
        Array.prototype.forEach.call(places, function (el) { sum += num(el.value); });
        estPrice = Math.floor(sum * (num(ageEl.value) || 1) * (num(sizeEl.value) || 1));
      }
      estDiscount = num(val(form, 'estimate-discount')) || Math.floor(estPrice * 0.9);
    }

    var data = {
      access_key: ACCESS_KEY,
      subject: isEstimate ? '【RAKUリフォームLP】簡易見積もり' : '【RAKUリフォームLP】無料相談',
      from_name: 'RAKUリフォームLP(raku-reform)',
      replyto: mail,
      'お名前': name,
      'メールアドレス': mail,
      '電話番号': tel,
      '工事の希望時期': checkedLabels(form, 'your-radio').join(', '),
      '工事の種類': (kind.indexOf('選択してください') === 0 ? '' : kind),
      '工事場所(住所)': val(form, 'your-area')
    };
    if (isEstimate) {
      data['工事箇所'] = checkedLabels(form, 'estimate-place[]').join(', ');
      data['築年数'] = checkedLabels(form, 'estimate-age').join(', ');
      data['広さ'] = checkedLabels(form, 'estimate-size').join(', ');
      data['概算金額'] = String(estPrice);
      data['割引後金額'] = String(estDiscount);
    } else {
      data['ご相談内容'] = val(form, 'your-message');
    }

    // スプレッドシート記録・自動返信(結果は待たず、失敗してもフォーム送信には影響させない)
    if (SHEET_ENDPOINT.indexOf('https://') === 0) {
      try {
        fetch(SHEET_ENDPOINT, {
          method: 'POST', mode: 'no-cors', keepalive: true,
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            type: isEstimate ? 'estimate' : 'contact',
            name: name, phone: tel, email: mail,
            timing: data['工事の希望時期'], area: data['工事場所(住所)'],
            kind: data['工事の種類'] || '',
            place: data['工事箇所'] || '', age: data['築年数'] || '', size: data['広さ'] || '',
            price: data['概算金額'] || '', discount: data['割引後金額'] || '',
            message: isEstimate ? '' : (data['ご相談内容'] || '')
          })
        });
      } catch (err) {}
    }

    var btn = form.querySelector('input[type="submit"]');
    var orig = btn ? btn.value : '';
    if (btn) { btn.disabled = true; btn.value = '送信中...'; }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.success) throw new Error(d.message || 'failed');
      if (isEstimate) {
        var price = Number(String(data['概算金額']).replace(/,/g, '')) || 0;
        location.href = '/raku-reform/thanks-estimate/' + (price ? '?price=' + encodeURIComponent(price) : '');
      } else {
        location.href = '/raku-reform/thanks/';
      }
    }).catch(function () {
      showMsg(form, '送信に失敗しました。お手数ですが、お電話(03-5326-3024)にてご連絡ください。', false);
      if (btn) { btn.disabled = false; btn.value = orig; }
    });
  }, true);
})();
