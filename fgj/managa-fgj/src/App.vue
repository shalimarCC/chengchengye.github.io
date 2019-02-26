<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<style>
    @import "../static/css/main.css";
    /*@import "../static/css/color-dark.css";     深色主题*/
    @import "../static/css/theme-green/color-green.css";   /*  浅绿色主题*/
    .el-table th{
        background-color:rgb(238, 246, 246);
    }
    .el-upload {
        border:1px dashed #ccc;
    }
</style>