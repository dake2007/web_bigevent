$(function () {
  //调用getUserInfo函数获取用户信息
  getUserInfo();
  $(btnLogout).on("click", () => {
    //提示用户是否确认退出
    layer.confirm(
      "是否要退出当前用户?",
      { icon: 3, title: "退出用户" },
      (index) => {
        //清除本地token 跳转到login页面 关闭退出询问框
        localStorage.removeItem("token");
        location.href = "/login.html";
        layer.close(index);
      }
    );
  });
});
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      //调用renderAcatar渲染用户头像
      renderAvatar(res.data);
    },
    //无论成功还是失败都调用这个complete回调函数
    complete: function (res) {
      // console.log(`res`, res);
      //在complete中可以拿到responseJSON里的数据
      if (
        res.responseJSON.status === 1 &&
        res.responseJSON.message === "身份认证失败"
      ) {
        //强制清空token
        localStorage.removeItem("token");
        location.href = "/login.html";
      }
    },
  });
}
//渲染用户信息头像函数
function renderAvatar(user) {
  //获取用户的名称
  var name = user.username || user.nickname;
  //欢迎的文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  //渲染用户头像
  if (user.user_pic != null) {
    //渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
