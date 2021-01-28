$(function() {
	var $frm = $(".login_frm").find('form');
	$(".login_frm-submit").click(function(event) {
		var userNo = $("#userNo").val();
		var userPw = $("#userPw").val();
		var code = $("#verCode").val();

		var $no_error = $(".bblens_frm-error[data-field='no']");
		var $pw_error = $(".bblens_frm-error[data-field='pw']");
		var $code_error = $(".bblens_frm-error[data-field='vercode']");

		if (userNo == '') {
			$no_error.html('請輸入客戶編號');
			return false;
		}
		if (userPw == '') {
			$pw_error.html('請輸入密碼');
			return false;
		}

		if (code == '') {
			$code_error.html('請輸入驗證碼');
			return false;
		}


		$frm.submit();


	});


});