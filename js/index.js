var pageData = {
    tempPage:1,
    pageSize:10,
    total:0
}
$(function () {
    uploadData();
    $("#pageSizeSelector").change(function () {
        pageData.pageSize = $("#pageSizeSelector").val();
        uploadData();
    })
})

/**
 * 渲染表格
 */
function uploadData() {
    var rows;
    $.ajax({
        url:"http://47.94.22.211:8086/test/pagination",
        type:"get",
        data:{
            page:pageData.tempPage,
            page_size:pageData.pageSize
        },
        dataType:"json",
        async:false,
        success:function (res) {
            console.log(res);
            if (res.code == 0){
                pageData.total = res.data.total;
                $("#totalNum").text(pageData.total);
                rows = res.data.rows;
            } else{
                alert(res.msg);
            }
        },
        error:function (res) {
            alert(res.status);
        }
    })
    renderPagination();
    renderTable(rows);
}

/**
 * 渲染分页器
 */
function renderPagination() {
    if (pageData.pageSize >= pageData.total) {
        $(".pagination").hide();
    }else{
        $(".pagination").show();
        var totalPage = Math.ceil(pageData.total / pageData.pageSize);
        $(".pagination").empty();
        if (pageData.tempPage != 1) {
            $(".pagination").append("<li class=\"page-item\">\n" +
                "                        <a class=\"page-link\" href=\"javascript:switchPage(-1)\" aria-label=\"Previous\">\n" +
                "                            <span aria-hidden=\"true\">&laquo;</span>\n" +
                "                            <span class=\"sr-only\">Previous</span>\n" +
                "                        </a>\n" +
                "                    </li>");
        }
        for (var i = 0; i < totalPage; i++) {
            var active="";
            if ((i + 1) == pageData.tempPage) {
                active = "active";
            }
            $(".pagination").append("<li class=\"page-item "+active+"\"><a class=\"page-link\" href=\"javascript:switchPage("+(i+1)+")\">"+(i+1)+"</a></li>");
        }
        if (pageData.tempPage != totalPage) {
            $(".pagination").append("<li class=\"page-item\">\n" +
                "                        <a class=\"page-link\" href=\"javascript:switchPage(-2)\" aria-label=\"Next\">\n" +
                "                            <span aria-hidden=\"true\">&raquo;</span>\n" +
                "                            <span class=\"sr-only\">Next</span>\n" +
                "                        </a>\n" +
                "                    </li>");
        }
    }
}

/**
 * 渲染表格
 */
function renderTable(rows) {
    $("#pigTableBody").empty();
    for (var i = 0; i < rows.length; i++) {
        $("#pigTableBody").append("<tr>\n" +
            "                    <th scope=\"row\">"+rows[i].id+"</th>\n" +
            "                    <td>"+rows[i].position+"</td>\n" +
            "                    <td>"+rows[i].daysOverdue+"</td>\n" +
            "                    <td>"+rows[i].earMark+"</td>\n" +
            "                    <td>"+rows[i].happenedDayNum+"</td>\n" +
            "                    <td>"+rows[i].recordType+"</td>\n" +
            "                    <td>"+rows[i].recordTime+"</td>\n" +
            "                </tr>");
    }
}

/**
 * 切换页面
 * @param page
 */
function switchPage(page) {
    if (page == -1) {
        if (pageData.tempPage > 1) {
            pageData.tempPage --;
        }
    }else if (page == -2) {
        if(Math.ceil(pageData.total / pageData.pageSize) > pageData.tempPage){
            pageData.tempPage ++;
        }
    }else{
        pageData.tempPage = page;
    }
    uploadData();
}