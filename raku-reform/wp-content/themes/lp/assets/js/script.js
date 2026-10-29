jQuery(function ($) {

  // jQuery(function ($) {
  //     alert('jQuery is ready.');
  // });

  /*=====================================
  drawer
  =====================================*/

  jQuery('.header__drawer').click(function(e) {
    e.preventDefault()

    jQuery(this).toggleClass('is-active');
    jQuery('.header__content').toggleClass('is-active');

    return false;
  });

  jQuery('.header__list, .header__cta').click(function() {
    jQuery('.header__drawer').removeClass('is-active');
    jQuery('.header__content').removeClass('is-active');
  });


  //------------------------------------
  // swiper fv
  //------------------------------------
  const swiper1 = new Swiper('.fv__swiper', {
    // オプションのパラメーター
    // スライドのループ
    loop: true,
    // スライドの移動スピード
    speed: 2000,
    // 表示スライド数
    slidesPerView: 1,
    // スライドの切替方法
    effect: 'fade',
    // false:スワイプでの切り替え無効
    allowTouchMove: false, 

    // 自動再生
    autoplay: {
      delay: 3000,
      // スライドの表示時間(4秒)
      pauseOnMouseEnter: false,        
      // false:カーソルを乗せても停止しない
      disableOnInteraction: false,    
      // false:操作して自動再生を停止しない
    },
  });


  //------------------------------------
  // swiper features
  //------------------------------------
  const swiper2 = new Swiper('.features__swiper--individual', {
    // オプションのパラメーター
    // スライドのループ
    loop: false,
    // スライドの移動スピード
    speed: 300,
    // 表示スライド数
    slidesPerView: 1,
    // スライドの切替方法
    effect: 'fade',
    // false:スワイプでの切り替え無効
    allowTouchMove: false, 

  });

  jQuery(function ($) {
    const $lists = $('.features__lists .features__list').not('.--corporation');

    // 修飾子 "--1" ～ "--6" があればそれを index に（1始まり → 0始まり）
    // 無ければ DOM 上の順序で index を算出
    const toIndex = ($li) => {
      const m = ($li.attr('class') || '').match(/--(\d+)/);
      return m ? (Number(m[1]) - 1) : $lists.index($li);
    };

    $lists.on('click', function (e) {
      e.preventDefault();

      // is-active付与
      $lists.removeClass('is-active');
      $(this).addClass('is-active');

      // 該当スライドへ移動
      const idx = toIndex($(this));
      swiper2.slideTo(idx);
    });
  });

  //------------------------------------
  // swiper features 2
  //------------------------------------
  const swiper3 = new Swiper('.features__swiper--corporation', {
    // オプションのパラメーター
    // スライドのループ
    loop: false,
    // スライドの移動スピード
    speed: 300,
    // 表示スライド数
    slidesPerView: 1,
    // スライドの切替方法
    effect: 'fade',
    // false:スワイプでの切り替え無効
    allowTouchMove: false, 

  });

  jQuery(function ($) {
    const $corpLists = $('.features__lists .features__list.--corporation');

    // 修飾子 "--1" ～ "--6" があればそれを index に（1始まり → 0始まり）
    // 無ければ DOM 上の順序で index を算出
    const toIndex = ($li) => {
      const m = ($li.attr('class') || '').match(/--(\d+)/);
      return m ? (Number(m[1]) - 1) : $corpLists.index($li);
    };

    $corpLists.on('click', function (e) {
      e.preventDefault();

      // is-active付与
      $corpLists.removeClass('is-active');
      $(this).addClass('is-active');

      const $corpWrap = $('#corporation'); // ←法人側のラッパID（あなたの実装に合わせて）
      if ($corpWrap.length && !$corpWrap.is(':visible')) {
        $('#individual').hide();
        $corpWrap.show();
      }

      // 該当スライドへ移動
      const idx = toIndex($(this));
      swiper3.slideTo(idx, 0);;
    });
  });


  /*=====================================
  タブ切替
  =====================================*/
  jQuery(function ($) {
    // 個人用と法人用をまとめて処理
    const groups = [
      { tab: ".price__tab.--individual", genre: ".price__genre.--individual" },
      { tab: ".price__tab.--corporation", genre: ".price__genre.--corporation" },
    ];

    groups.forEach(function (group) {
      const $tabs = $(group.tab);
      const $genres = $(group.genre);

      // 初期表示
      $genres.hide();
      $("#" + $tabs.filter(".is-active").data("target")).show();

      // クリックイベント
      $tabs.on("click", function () {
        const targetId = $(this).data("target");

        $tabs.removeClass("is-active");
        $(this).addClass("is-active");

        $genres.hide();
        $("#" + targetId).show();
      });
    });
  });
    
  
  /*=====================================
  アコーディオン
  =====================================*/

  jQuery('.faq__item').click(function(){
    if($(this).hasClass('is-active')) {
      $(this).removeClass('is-active');
      $(this).find('.faq__body').slideUp();
    } else {
      $(this).addClass('is-active');
      $(this).find('.faq__body').slideDown();
    }
  });

  /*=====================================
  ファイル添付
  =====================================*/

  //fileを変更したら
  jQuery('input[type="file"]').on('change', function () {
      //propを使って、file[0]にアクセスする
      var file = $(this).prop('files')[0];
      //text()で要素内のテキストを変更する
      $('.select-image').text(file.name);
  });

  jQuery(function(){
      $('select.placeholder').on('change', function(){
          if($(this).val() == ""){
              $(this).css('color','#999');
          } else {
              $(this).css('color','#000');
          }
      });
  });

document.addEventListener('wpcf7mailsent', function (event) {
  const form = event.target;

  // LPフォームのみ処理したい場合は調整
  if (!form.closest('.estimate__group') && !form.querySelector('[name="estimate-price"]')) {
    return;
  }

  const priceField = form.querySelector('#cf7-estimate-price, [name="estimate-price"]');
  const rawPrice = priceField ? priceField.value : '';

  // ディレクトリベース
  const baseUrl = '/raku-reform/thanks-estimate/';

  if (!rawPrice) {
    location.href = baseUrl;
    return;
  }

  const price = Number(String(rawPrice).replace(/,/g, '')) || 0;

  location.href = `${baseUrl}?price=${encodeURIComponent(price)}`;
}, false);

});