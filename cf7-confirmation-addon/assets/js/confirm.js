jQuery(function($){
  // フォーム内で .input_area があるものだけ処理するので、input_area を忘れずに付与してください
  $('.wpcf7-form .input_area').each(function(){
    var $inputArea = $(this);
    var $wrapper   = $inputArea.closest('.wpcf7-form');

    // 確認画面コンテナを用意
    var $confirmArea = $(
      '<div class="confirm_area">' +
        '<p class="ttl">入力内容確認</p>' +
        '<p>以下の内容でよろしいですか？</p>' +
      '</div>'
    );
    $wrapper.append($confirmArea);

    // 完了画面コンテナを用意（別ページリダイレクト運用なら不要）
    var $thanksArea = $(
      '<div class="thanks_area">' +
        '<p class="ttl">送信完了</p>' +
        '<p class="text-center">お問い合わせありがとうございました。</p>' +
      '</div>'
    );
    $wrapper.append($thanksArea);

    // ── 確認行を自動生成 ──
    $inputArea.find('[name]').each(function(){
      var $field = $(this);
      var idAttr = $field.attr('id');

      // 「notConfirm」を含む id のフィールドはスキップ
      if ( idAttr && idAttr.indexOf('notConfirm') !== -1 ) {
        return;  // 続行（＝このフィールドは確認画面に出さない）
      }

      var nameAttr = $field.attr('name');
      // ラベル取得：まずは for 属性が name と一致するものを探す
      var labelTxt = $inputArea.find('label[for="'+ nameAttr +'"]').text().trim();
      // フォールバック：placeholder または name 属性
      if (!labelTxt) labelTxt = $field.attr('placeholder') || nameAttr;

      var $row = $(
        '<div class="row confirm-row">' +
          '<div class="label col-5 col-md-2">'+ labelTxt +'</div>' +
          '<div class="value col-7 col-md-10"><span class="confirm_'+ nameAttr +'"></span></div>' +
        '</div>'
      );
      $confirmArea.append($row);
    });

    // 「送信する」ボタン生成・処理
    var $submitBtnWrap = $('<div class="submitBtn"></div>');
    var $newSubmit = $(
      '<input ' +
        'type="submit" ' +
        'value="送信する" ' +
        'class="wpcf7-form-control wpcf7-submit has-spinner" ' +
      '>'
    );
    $submitBtnWrap.append($newSubmit);
    $confirmArea.append($submitBtnWrap);

    // 「戻る」ボタン生成・処理
    var $backBtn = $('<input type="button" class="back_button" value="戻る">');
    $confirmArea.append($backBtn);
    $backBtn.on('click', function(){
      $confirmArea.hide();
      $inputArea.show();
      $('html,body').animate({ scrollTop: $wrapper.offset().top }, 300);
    });

    // 入力内容を確認画面に反映（name 属性対応）
    $inputArea.on('change input', 'input, select, textarea', function(){
      var $el       = $(this);
      var val       = $el.is(':radio,:checkbox')
                      ? ($el.is(':checked') ? $el.val() : '')
                      : $el.val();
      var nameAttr  = $el.attr('name');
      $confirmArea.find('.confirm_'+ nameAttr).text(val);
    });
    // 初期値の反映（チェック済み要素など）
    $inputArea.find('input:checked, select, textarea').trigger('change');

    // 「確認する」ボタンクリック
    var $confirmBtn = $wrapper.find('.confirm_button');
    $confirmBtn.on('click', function(){
      $inputArea.hide();
      $confirmArea.show();
      $('html,body').animate({ scrollTop: $wrapper.offset().top }, 300);
    });

    // CF7 の送信（submit）後に完了画面切り替え
    $wrapper.on('submit', function(){
      setTimeout(function(){
        $confirmArea.hide();
        $thanksArea.fadeIn(500);
        $('html,body').animate({ scrollTop: $wrapper.offset().top }, 300);
      }, 100);
    });

    // 必須項目チェック（aria-required 属性） → 確認ボタン制御
    var $required = $inputArea.find('[aria-required="true"]');
    $required.on('input change', function(){
      var ok = true;
      $required.each(function(){ if (!$(this).val()) ok = false; });
      $confirmBtn.prop('disabled', !ok);
    });
    $required.trigger('change');
  });
});
