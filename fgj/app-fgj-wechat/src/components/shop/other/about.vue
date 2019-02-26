<template>
    <div id="about">
        <div id="main">
            <p>客服热线：021-34788330</p>
            <p>企业QQ：2598452166</p>
            <p>企业微信：迩格信息</p>
        </div>
        <div  class="about_foot">
            <h5>服务时间：9:00-18:00</h5>
        </div>
    </div>
</template>

<script>

</script>

<style lang="scss" scoped>
$baseWidth:750px;
@function px($val) {
    @return $val/$baseWidth*10+rem;
}

#about{
    width:100%;
    height:100%;
    background:#fff;
    text-align:center;
}

#main{
    margin-top:px(240px);
    width:px(480px);
    height:px(212px);
    border: 1px solid #C8C8C8;
    border-radius: 10px;
    display:inline-block;
    padding-left:px(120px);
    padding-top:px(48px);
    text-align:left;
    p{
        font-size:px(30px);
        color:#323232;
        line-height:px(50px);
        font-weight:900;
    }
}
.about_foot{
    width:100%;
    position:absolute;
    bottom:px(100px);
    text-align:center;
}
h5{
    font-size:px(24px);
    color: #787878;
}
</style>