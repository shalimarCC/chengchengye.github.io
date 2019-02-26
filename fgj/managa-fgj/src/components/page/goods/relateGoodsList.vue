<template>
  <div class="filter-container" id="example">

    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品编号" v-model="ruleForm.merchantProductSerialNumber" @keyup.native="checkSerialNumber(ruleForm.merchantProductSerialNumber)" maxlength="18"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="最低销售价格" v-model="ruleForm.beginSalePrice" @keyup.native="checkBeginSalePrice(ruleForm.beginSalePrice)"></el-input>至
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;margin-left:15px;" class="filter-item" placeholder="最高销售价格" v-model="ruleForm.endSalePrice" @keyup.native="checkEndSalePrice(ruleForm.endSalePrice)"></el-input>
        <el-select v-model="ruleForm.status" placeholder="是否上架" style="width: 200px;margin-right:15px;">
            <el-option label="待上架" value="1">
            </el-option>
            <el-option label="审核中" value="2">
            </el-option>
            <el-option label="已上架" value="3">
            </el-option>
            <el-option label="已下架" value="4">
            </el-option>
            <el-option label="审核未通过" value="5">
            </el-option>
        </el-select></br>
    </div>
    <div style="margin-bottom:20px;">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="商品名称" v-model="ruleForm.name"></el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="最低促销价格" v-model="ruleForm.beginPromotionPrice" @keyup.native="checkBeginPromotionPrice(ruleForm.beginPromotionPrice)"></el-input>至
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;margin-left:15px;" class="filter-item" placeholder="最高促销价格" v-model="ruleForm.endPromotionPrice" @keyup.native="checkEndPromotionPrice(ruleForm.endPromotionPrice)"></el-input>
        <el-select v-model="ruleForm.isVisible" placeholder="商品状态" style="width: 200px;margin-right:15px;">
            <el-option label="显示" value="0">
            </el-option>
            <el-option label="隐藏" value="1">
            </el-option>
        </el-select>
    </div>

    <div style="margin-bottom:20px;">

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter" size="medium">搜索</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>

    </div>


    <el-table :key='tableKey' :data="dataSource" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" max-height="600">

        <el-table-column align="center" label="商品编号" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.merchantProductSerialNumber}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="销售价格" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.salePrice}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="促销价格" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.promotionPrice}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="市场价格" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.marketPrice}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="是否上架" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.status==1">待上架</span>
                <span v-else-if="scope.row.status==2">审核中</span>
                <span v-else-if="scope.row.status==3">已上架</span>
                <span v-else-if="scope.row.status==4">已下架</span>
                <span v-else-if="scope.row.status==5">审核未通过</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="商品显示状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.isVisible==0">显示</span>
                <span v-else-if="scope.row.isVisible==1">隐藏</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="400" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain  @click="delMpTag(scope.row.id)">清除引用</el-button>
            </template>
        </el-table-column>

    </el-table>
    <div class="pagination-container" style="text-align: left;margin-top: 10px;">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="ruleForm.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="ruleForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
        </el-pagination>
    </div>

    <el-dialog title="查看商品" :visible.sync="dialogFormVisible">
        <div style="height:400px;overflow-y:auto;overflow-x:hidden;">
            <see-goods :goods-id="goodsId" v-if="dialogFormVisible" ref="seegoods"></see-goods>
        </div>
    </el-dialog>
  </div>
</template>


<script>
import {baseUrl} from '../../../config/env'
import {queryMpByTagId,findCommodityDetailsOfPage,delMpTagInfo} from '../../../api/getData';
export default {
    data() {
        return {
            ruleForm: {
                merchantProductSerialNumber: "",
                name: "",
                beginSalePrice: "",
                endSalePrice: "",
                beginPromotionPrice: "",
                endPromotionPrice: "",
                saleWay: "",
                status: "",
                isVisible:"",
                platformId: "",
                pageNo:1,
                pageSize:10,
            },
            dataSource: [],
            offset: 0,
            count: null,
            tableKey: 0,
            listLoading: true,
            goodsId:'',
            dialogFormVisible:false,
            tagId:0,
            pageNo:1,
            pageSize:10,
        }
    },
    created() {
        this.tagId = this.$route.params.id;
        this.queryMpByTagId();
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                let str = curVal.path;
                str = str.substring(0,11);
                if(/\/goodsList\//.test(curVal.path)){
                    Object.assign(this.$data, this.$options.data());
                    this.tagId = this.$route.params.id;
                    this.queryMpByTagId();
                }

            },
        }
    },

    methods: {
        //获取列表
        async queryMpByTagId() {
            try {
                this.listLoading = false;
                const res = await queryMpByTagId({tagId:this.tagId,pageNo:this.pageNo,pageSize:this.pageSize});

                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.dataSource = res.data.data.list;

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },

        //获取筛选过滤后列表
        async findCommodityDetailsOfPage() {
            try {
                const obj = new Object();
                $.each(this.ruleForm, function (key, info) {
                    if (info != "") {
                        obj[key] = info;
                    }
                })
                obj.tagId = this.tagId;
                this.listLoading = false;
                console.log(obj);
                const res = await queryMpByTagId(obj);

                if (res.data.code == 0) {
                    this.count = res.data.data.totalSize;
                    this.dataSource = res.data.data.list;

                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },

        //清除引用
        delMpTag(id) {
            this.$confirm('是否取消商品与该标签关联?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delMpTagInfo(id);
            }).catch(() => {

            });
        },
        async delMpTagInfo(id) {
            try {
                const res = await delMpTagInfo({standardUnitId:id});

                if (res.data.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '清除成功'
                    });
                    this.findCommodityDetailsOfPage();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '获取数据失败,请联系管理员！404'
                });

            }
        },

        //分页
        handleSizeChange(val) {
            this.ruleForm.pageSize = val;
            this.findCommodityDetailsOfPage()
        },
        handleCurrentChange(val) {
            this.ruleForm.pageNo = val;
            this.offset = (val - 1) * this.ruleForm.pageNo;
            this.findCommodityDetailsOfPage()
        },

        //搜索
        handleFilter() {
            this.ruleForm.pageSize = 10;
            this.ruleForm.pageNo = 1;
            if (parseInt(this.ruleForm.endSalePrice)<parseInt(this.ruleForm.beginSalePrice)) {
                alert("最高销售价格不得低于最低销售价格");
                this.ruleForm.endSalePrice = '';
                return;
            }
            if (parseInt(this.ruleForm.endPromotionPrice)<parseInt(this.ruleForm.beginPromotionPrice)) {
                alert("最高促销售价格不得低于最低促销价格");
                this.ruleForm.endPromotionPrice = '';
                return;
            }
            if (this.ruleForm.beginSalePrice) {this.ruleForm.beginSalePrice = parseInt(this.ruleForm.beginSalePrice);}
            if (this.ruleForm.endSalePrice) {this.ruleForm.endSalePrice = parseInt(this.ruleForm.endSalePrice);}
            if (this.ruleForm.beginPromotionPrice) {this.ruleForm.beginPromotionPrice = parseInt(this.ruleForm.beginPromotionPrice);}
            if (this.ruleForm.endPromotionPrice) {this.ruleForm.endPromotionPrice = parseInt(this.ruleForm.endPromotionPrice);}
            // console.log(this.ruleForm);
            this.findCommodityDetailsOfPage();
        },
        //重置
        resetForm(formName) {
            this.ruleForm = {
                merchantProductSerialNumber: "",
                name: "",
                beginSalePrice: "",
                endSalePrice: "",
                beginPromotionPrice: "",
                endPromotionPrice: "",
                saleWay: "",
                status: "",
                platformId: "",
                pageNo:1,
                pageSize:10,
            }
            this.findCommodityDetailsOfPage();
        },

        //时间戳转换
        setTime(time) {
            const t = new Date(time);
            let y = t.getFullYear();
            let m = t.getMonth() + 1;
            let d = t.getDate();
            let h = t.getHours();
            let f = t.getMinutes();
            let s = t.getSeconds();
            if (m < 10) {
                m = '0' + m
            }
            if (d < 10) {
                d = '0' + d
            }
            if (h < 10) {
                h = '0' + h
            }
            if (f < 10) {
                f = '0' + f
            }
            if (s < 10) {
                s = '0' + s
            }
            return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
        },
        //时间转换时间戳
        setTimestamp(time) {
            if(time == ""){
                return "";
            }
            const t = new Date(time);
            return t.getTime()
        },

        //验证过滤器内容
        checkSerialNumber(value) {
            value=value.replace(/[^\w\.\/]/ig,'');
            this.ruleForm.merchantProductSerialNumber = value;
        },
        checkBeginSalePrice(value) {
            value=value.replace(/[^\d]/g,'');
            this.ruleForm.beginSalePrice = value;
            if (parseInt(value)<=0) {
                alert("请输入大于零的整数");
                this.ruleForm.beginSalePrice = '';
            }
        },
        checkBeginPromotionPrice(value) {
            value=value.replace(/[^\d]/g,'');
            this.ruleForm.beginPromotionPrice = value;
            if (parseInt(value)<=0) {
                alert("请输入大于零的整数");
                this.ruleForm.beginPromotionPrice = '';
            }
        },
        checkEndSalePrice(value) {
            value=value.replace(/[^\d]/g,'');
            this.ruleForm.endSalePrice = value;
        },
        checkEndPromotionPrice(value) {
            value=value.replace(/[^\d]/g,'');
            this.ruleForm.endPromotionPrice = value;
        },

    }
}
</script>

<style scoped>
#example {
    padding: 10px 20px;
}
</style>


