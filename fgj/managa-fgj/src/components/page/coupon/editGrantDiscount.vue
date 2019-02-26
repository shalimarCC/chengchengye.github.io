<template>
    <div id="example">
        <template v-if="active==1">
            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="优惠券/优惠券组">
                    {{form.title}}
                </el-form-item>

                <el-form-item label="批次名称">
                    <el-input v-model="form.couponBatchName" style="width: 300px;"></el-input>
                </el-form-item>

                <el-form-item label="发放类型">
                    <el-select v-model="form.grantType" placeholder="请选择发放类型" style="width: 200px;margin-right:15px;" disabled>
                        <el-option label="系统发放" :value="0">
                        </el-option>
                        <el-option label="用户领取" :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="领取方式"  v-if="form.grantType===1" >
                    <el-select v-model="form.getType" placeholder="请选择发放类型" style="width: 200px;margin-right:15px;" disabled="">
                        <el-option label="手工领取/扫码领取" :value="0">
                        </el-option>
                        <el-option label="注册领取" :value="1">
                        </el-option>
                        <el-option label="unit领取" :value="2">
                        </el-option>
                        <el-option label="以旧换新" :value="3">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择渠道" v-if="form.getType==2">
                    <el-select v-model="form.channelId" @change="channelChange">
                        <el-option
                            v-for="item in channelList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择活动" v-if="form.getType==2">
                    <el-select v-model="form.channelActivityId">
                        <el-option
                            v-for="item in activityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择员工方式" v-if="form.grantType===0">
                    <el-select v-model="form.chooseWay" placeholder="请选择员工方式" style="width: 200px;margin-right:15px;">
                        <el-option label="根据企业选择员工" :value="0">
                        </el-option>
                        <el-option label="根据员工列表选择员工" :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="根据企业选择员工" v-if="form.grantType===0&&form.chooseWay===0">
                    <el-select v-model="form.comps" multiple @change="compsChange">
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <p style="font-size:12px;line-height:30px;color:#999;text-align:left;">Tips : 共发放{{couponNumComps*sum}}张优惠券。</p>
                </el-form-item>

                <el-form-item label="根据员工列表添加员工" v-if="form.grantType===0&&form.chooseWay==1">
                    <el-tag
                    :disable-transitions="false">
                    已选择{{form.emps.length}}个员工
                    </el-tag>

                    <el-button class="filter-item" type="primary" @click="addUser">选择员工</el-button>
                    <p style="font-size:12px;line-height:30px;color:#999;text-align:left;">Tips : 共发放{{form.emps.length*sum}}张优惠券。</p>
                </el-form-item>

                <el-form-item label="发放数量"  v-if="form.grantType==1">
                    <el-input-number v-model="form.grantCount" :disabled="grantCountStatus" :min="1"></el-input-number>
                    <el-checkbox v-model="grantCountStatus" :disabled="form.getType==2">不限量</el-checkbox>
                </el-form-item>

                <el-form-item label="使用/过期后是否可再次领用" v-if="form.grantType==1">
                    <el-radio-group v-model="form.isRepeat">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="是否前端展示" v-if="form.grantType==1">
                    <el-radio-group v-model="form.isDisplay">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="可领取日期"  v-if="form.grantType===1">
                    <el-date-picker
                    v-model="startEndTime1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="有效期">
                    <el-radio-group v-model="form.effectType">
                        <p style="margin-bottom:5px;"><el-radio :label="0">不限时间</el-radio></p>
                        <p style="margin-bottom:5px;"><el-radio :label="1">
                        <el-date-picker
                        v-model="startEndTime2"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                        </el-radio></p>
                        <p style="margin-bottom:5px;"><el-radio :label="2">从领取日起<el-input-number v-model="form.effectDays" :min="1"></el-input-number>日内有效</el-radio></p>
                    </el-radio-group>
                </el-form-item>

                <!-- 跳转页面 -->
                <el-form-item label="移动端页面">
                    <el-select v-model="skipIds.cmsPageMId" style="width: 200px;margin-right:15px;" placeholder="跳转页面" @focus="getPageDateM">
                        <el-option
                        v-for="(item,index) in clientTypeDate"
                        :key="item.id"
                        :label="item.pageName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="PC端页面">
                    <el-select v-model="skipIds.cmsPagePcId" style="width: 200px;margin-right:15px;" placeholder="跳转页面" @focus="getPageDatePc">
                        <el-option
                            v-for="(item,index) in clientTypeDate"
                            :key="item.id"
                            :label="item.pageName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>


            <div style="position: sticky;bottom: 0;text-align:center;width:100%;">
                <el-button size="medium" style="margin: 12px;" @click='saveGrant'>保存</el-button>
            </div>
            <el-dialog title="选择员工" :visible.sync="dialogFormVisible" size="tiny">
                <div style="margin-bottom:20px;">

                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="姓名" v-model="userForm.name">
                    </el-input>

                    <el-select v-model="userForm.sex" placeholder="性别" style="width: 200px;margin-right:15px;">
                        <el-option label="女" :value="0">
                        </el-option>
                        <el-option label="男" :value="1">
                        </el-option>
                    </el-select>

                    <el-select v-model="userForm.companyId"  placeholder="所属公司">
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.companyName"
                            :value="item.id">
                        </el-option>
                    </el-select>



                </div>
                <div style="margin-bottom:20px;">
                    <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-right:15px;" class="filter-item" placeholder="员工编号" v-model="userForm.memberCode">
                    </el-input>

                    <el-button class="filter-item" type="primary" icon="search" size="medium" @click="">搜索</el-button>
                    <el-button @click="resetForm" size="medium">重置</el-button>
                </div>

                <el-checkbox-group v-model="form.emps">
                    <el-table :key='tableKey1' :data="userList" border fit highlight-current-row style="width: 100%">
                        <el-table-column
                        align="center"
                        width="30">
                            <template slot-scope="scope">
                                <el-checkbox :label="scope.row.userId" :name="null"></el-checkbox>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="姓名" min-width="250">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="员工编号" min-width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.memberCode}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="邮箱" min-width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.mail}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="手机号码" min-width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.mobile}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="性别" min-width="80">
                            <template slot-scope="scope">
                                <span v-if="scope.row.sex == 0">女</span>
                                <span v-else-if="scope.row.sex == 1">男</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="生日" min-width="80">
                            <template slot-scope="scope">
                                {{setTime(scope.row.birthday)}}
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="所属公司" min-width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.companyName}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="所在部门" min-width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.departmentName}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-checkbox-group>

                <div class="pagination-container" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page.sync="userForm.pageNo"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="userForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count1">
                    </el-pagination>
                </div>


            </el-dialog>
        </template>
        <template v-else-if="active==2">
            <img src="../../../assets/success.jpg" />
        </template>

  </div>

</template>



<script>
import {userExtendAllOfPage,
    findCouponById,
    findCouponCompanyOfPage,
    insertOrUpdateCouponBatchWithTx,
    findCouponGroupById,
    findCouponBatchInfoById,
    findChannelAll,
    findChannelActivityByChannelId,
    findCmsPageAllByClientType
} from '../../../api/getData';
export default {
    data() {
        return {
            form:{
                couponBatchName:'',
                couponRelType:1,
                couponRelId:'',
                grantType:'',
                chooseWay:'',
                grantCount:'',
                isRepeat:0,
                isDisplay:1,
                receiveStartTime:'',
                receiveEndTime:'',
                effectStartTime:'',
                effectEndTime:'',
                effectDays:'',
                isEffect:'',
                emps:[],
                comps:[],
                effectType:'',
                getType:'',
                channelId:'',
                activityId:'',
                channelActivityId:'',
             //   linkableButtonPageList:[]
            },
            skipIds:{
                cmsPagePcId:'',
                cmsPageMId:'',
            },
            active:1,
            dialogFormVisible:false,
            tableKey1: 0,
            listLoading1: true,
            offset1: 0,
            count1: null,
            userForm:{
                name :'',
                couponId:'',
                companyId :'',
                sex :'',
                memberCode:'',
                pageNo:1,
                pageSize:10,
            },
            userList:[],
            checkList:[],
            companyList:[],
            startEndTime1:[],
            startEndTime2:[],
            grantCountStatus:'',
            couponName:'',
            couponNumComps:0,
            sum:'',
            channelList:[],
            activityList:[],
            clientTypeDate:[]
        }
    },
    created () {
        this.findCouponBatchInfoById();
        this.findChannelAll();
        this.findCmsPageAllByClientType(5);
        this.findCmsPageAllByClientType(6);
    },
    watch : {
        "$route": {
            handler(curVal,oldVal){
                 let str = curVal.path;
                 str = str.substring(0,18)

                if(str == "/editGrantDiscount"){
                    Object.assign(this.$data, this.$options.data());
                    this.findCouponBatchInfoById();
                    this.findChannelAll();
                    this.findCmsPageAllByClientType(5);
                    this.findCmsPageAllByClientType(6);
                }

            },
        }
    },
    methods:{
        //根据渠道查询活动列表
        async findChannelActivityByChannelId(id){
            try {
                const res = await findChannelActivityByChannelId({channelId:id});
                if (res.data.code == 0) {
                    this.activityList = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '获取数据失败,请联系管理员！404'
                    message: 'findChannelActivityByChannelId'
                });

            }
        },
        channelChange(){
            // this.form.channelActivityId='';
            this.findChannelActivityByChannelId(this.form.channelId);
        },
       async findCouponBatchInfoById(){
            try {
                const res = await findCouponBatchInfoById({id:this.$route.params.id});
                if (res.data.code == 0) {
                    let that = this;
                    that.form = res.data.data;
                    //编辑回显
                    if(that.form.getType==2){
                        that.form.channelId=that.form.qrCode.channelId;
                        that.findChannelActivityByChannelId(that.form.channelId);
                        that.form.channelActivityId=that.form.qrCode.campaignId;
                    }
                    if(res.data.data.grantCount == -1){
                        that.grantCountStatus = true;
                    }
                    that.startEndTime1 = [res.data.data.receiveStartTime,res.data.data.receiveEndTime];
                    that.startEndTime2 = [res.data.data.effectStartTime,res.data.data.effectEndTime];
                    if(res.data.data.linkbuttonPageList){
                        $.each(res.data.data.linkbuttonPageList,function(key,info){
                            if(info.clientType == 5){
                                that.skipIds.cmsPagePcId= info.cmsPageId
                            }else{
                                that.skipIds.cmsPageMId= info.cmsPageId
                            }
                        })
                    }
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
        //选择企业change事件
        compsChange(arr){
            let thtf = this;
            this.couponNumComps = 0;
            $.each(arr,function(k,i){
                $.each(thtf.companyList,function(key,info){
                    if(i==info.id){
                        thtf.couponNumComps+=info.empCount;
                        return;
                    }
                })
            })
        },
        //查询渠道列表
        async findChannelAll(){
            try {
                const res = await findChannelAll();
                if (res.data.code == 0) {
                    this.channelList = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '获取数据失败,请联系管理员！404'
                    message: 'findChannelAll'
                });

            }
        },
        //通过id查询优惠卷分组详情
        async findCouponGroupById(){
            try {
                const res = await findCouponGroupById({id:this.$route.params.id});
                if (res.data.code == 0) {
                    this.findCouponCompanyOfPage();
                    this.couponName = res.data.data.groupName;
                    this.form.couponRelType = 1;
                    this.sum = res.data.data.couponList.length;
                    this.form.couponRelId = res.data.data.id;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '获取数据失败,请联系管理员！404'
                    message: 'findCouponGroupById'
                });

            }
        },
        //通过id查询优惠卷详情
        async findCouponById () {
            try {
                const res = await findCouponById({id:this.$route.params.id});
                if (res.data.code == 0) {
                    this.form.couponRelId = res.data.data.id;
                    this.form.couponRelType = 0;
                    this.sum = 1;
                    this.couponName = res.data.data.title;
                    this.findCouponCompanyOfPage();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '获取数据失败,请联系管理员！404'
                    message: 'findCouponById'
                });

            }
        },
        //通过id查询优惠卷详情
        async findCouponCompanyOfPage () {
            try {
                const res = await findCouponCompanyOfPage({id:this.$route.params.id});
                if (res.data.code == 0) {
                    this.companyList = res.data.data.list;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '获取数据失败,请联系管理员！404'
                    message: 'findCouponCompanyOfPage'
                });

            }
        },

        //选择用户
        addUser(){
            this.userForm = {
                name :'',
                couponId:this.form.id,
                companyId :'',
                sex :'',
                memberCode:'',
                pageNo:1,
                pageSize:10,

            };

            this.userExtendAllOfPage();
        },

        //获取员工列表
        async userExtendAllOfPage () {
            try {
                const obj = new Object();
                $.each(this.userForm, function (key, info) {
                    if (info !== "") {
                        obj[key] = info;
                    }
                })
                const res = await userExtendAllOfPage(obj);
                if (res.data.code == 0) {
                    this.count1 = res.data.data.totalSize;
                    this.userList = res.data.data.list;
                    this.dialogFormVisible = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '获取数据失败,请联系管理员！404'
                    message: 'userExtendAllOfPage'
                });
            }
        },

         //分页
        handleSizeChange1(val) {
            this.goodsForm.pageSize = val;
            this.userExtendAllOfPage()
        },
        handleCurrentChange1(val) {
            this.ruleForm.pageNo = val;
            this.offset1 = (val - 1) * this.goodsForm.pageSize;
            this.userExtendAllOfPage()
        },
        //重置
        resetForm(){
            this.goodsForm = {
                standardUnitName:'',
                status:'',
                saleWay:'',
                pageNo:1,
                pageSize:10,

            };
            this.userExtendAllOfPage();
        },

        //保存
        saveGrant(){
            if(this.form.getType==2){
                if(this.form.grantCount>10000){
                    this.$message({
                        type: 'error',
                        message: 'unit领取方式的发放数量须≤10000 '
                    });
                    this.form.grantCount =10000;
                    return
                }
            }
            delete this.form.linkbuttonPageList;
            console.log(this.form);
            const obj = new Object();
            $.each(this.form, function (key, info) {
                if (info !== "") {
                    obj[key] = info;
                }
            })
            if(this.startEndTime1[0]!='' && this.startEndTime1[0]!=undefined){
                obj.receiveStartTime =  this.setTimestamp(this.startEndTime1[0]);
            }
            if(this.startEndTime1[1]!='' && this.startEndTime1[1]!=undefined){
                obj.receiveEndTime =  this.setTimestamp(this.startEndTime1[1]);
            }
            if(this.startEndTime2[0]!='' && this.startEndTime2[0]!=undefined){
                obj.effectStartTime =  this.setTimestamp(this.startEndTime2[0]);
            }
            if(this.startEndTime2[1]!='' && this.startEndTime2[1]!=undefined){
                // obj.effectEndTime =  this.setTimestamp(this.startEndTime2[1]);
                obj.effectEndTime =  this.setTimestamp(this.startEndTime2[1]) + 24*60*60*1000 - 1000;
            }
            if(this.grantCountStatus){
                obj.grantCount = -1;
            }
            this.form.linkableButtonPageList = [
                {
                "cmsPageId": this.skipIds.cmsPagePcId,
                "clientType": 5, // 5: pc端  6:移动端
                },
                {
                "cmsPageId": this.skipIds.cmsPageMId,
                "clientType": 6,
                }
            ];
            obj.linkableButtonPageList = JSON.stringify(this.form.linkableButtonPageList);
            obj.emps = JSON.stringify(this.form.emps);
            obj.comps = JSON.stringify(this.form.comps);
            console.log(obj);
            this.insertOrUpdateCouponBatchWithTx(obj)
        },

        //发放
        async insertOrUpdateCouponBatchWithTx (obj) {
            try {
                const res = await insertOrUpdateCouponBatchWithTx(obj);
                if (res.data.code == 0) {
                    this.active = 2;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '获取数据失败,请联系管理员！404'
                    message: 'insertOrUpdateCouponBatchWithTx'
                });

            }
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
            const t = new Date(time);
            return t.getTime()
        },
        //通过客户端类型查询商品页列表
        async findCmsPageAllByClientType (clientType) {
            try {
                const res = await findCmsPageAllByClientType({clientType:clientType});
                if (res.data.code == 0) {
                    this.clientTypeDate = res.data.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    // message: '获取数据失败,请联系管理员！404'
                    message: 'findCmsPageAllByClientType'
                });

            }
        },
        //移动端页面获取
        getPageDateM(){
            this.clientTypeDate = [];
            this.findCmsPageAllByClientType(6);
        },
        //移动端页面获取
        getPageDatePc(){
            this.clientTypeDate = [];
            this.findCmsPageAllByClientType(5);
        }

    }


}
</script>

<style scoped>
#example {
    padding: 5px 20px;

}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
.avatar-uploader img{
    width:100%;
    height:100%;
}

</style>


